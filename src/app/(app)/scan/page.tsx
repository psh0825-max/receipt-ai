'use client'
import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Check, X, Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCategoryInfo, formatAmount, CATEGORIES } from '@/lib/categories'

interface AnalysisResult {
  store_name: string
  receipt_date: string
  total_amount: number
  currency: string
  items: { name: string; qty: number; price: number }[]
  category: string
  payment_method: string
  tax_deductible: boolean
  confidence: number
}

const STEPS = [
  { label: '업로드', icon: Upload },
  { label: '분석', icon: Sparkles },
  { label: '완료', icon: Check },
]

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => { setImage(e.target?.result as string); setResult(null); setStep(1) }
    reader.readAsDataURL(file)
  }

  async function analyze() {
    if (!image) return
    setAnalyzing(true); setStep(1)
    try {
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      if (!res.ok) throw new Error('분석 실패')
      setResult(await res.json()); setStep(2)
      toast.success('영수증 분석 완료!')
    } catch { toast.error('분석에 실패했습니다.'); setStep(0) }
    finally { setAnalyzing(false) }
  }

  async function save() {
    if (!result) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('로그인이 필요합니다'); setSaving(false); return }
      const { error } = await supabase.from('receipts').insert({
        user_id: user.id, store_name: result.store_name, receipt_date: result.receipt_date,
        total_amount: result.total_amount, currency: result.currency || 'KRW',
        category: result.category, payment_method: result.payment_method,
        items: result.items || [], tax_deductible: result.tax_deductible || false,
        image_url: null, ai_metadata: { confidence: result.confidence },
      })
      if (error) throw error
      toast.success('영수증이 저장되었습니다!')
      router.push('/receipts')
    } catch (err: unknown) {
      toast.error(`저장 실패: ${err instanceof Error ? err.message : String(err)}`)
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5 animate-in">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">영수증 스캔</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI가 자동으로 분석해드려요</p>
      </div>

      {/* Progress Steps */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${
                i <= step ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <s.icon className="h-4 w-4" />
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-2 font-medium">
          {STEPS[Math.min(step, STEPS.length - 1)].label}
          {analyzing && ' 중...'}
        </p>
      </div>

      {/* Upload Area */}
      {!image ? (
        <div className="space-y-3">
          <button onClick={() => fileRef.current?.click()}
            className="w-full card p-8 text-center border-2 border-dashed border-emerald-200 hover:bg-emerald-50/50 transition-colors">
            <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-0.5">📸 카메라로 촬영</h3>
            <p className="text-xs text-gray-400">후면 카메라가 자동으로 열립니다</p>
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

          <button onClick={() => galleryRef.current?.click()}
            className="w-full card p-5 text-center hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">🖼️ 갤러리에서 선택</h3>
          </button>
          <input ref={galleryRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="relative card-elevated p-3">
          <img src={image} alt="영수증" className="w-full rounded-xl" />
          <button onClick={() => { setImage(null); setResult(null); setStep(0) }}
            className="absolute top-5 right-5 bg-black/50 text-white rounded-full p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {image && !result && (
        <button onClick={analyze} disabled={analyzing}
          className="w-full py-4 btn-primary flex items-center justify-center gap-2 text-[15px]">
          {analyzing ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> AI가 분석 중...</>
          ) : (
            <><Sparkles className="h-5 w-5" /> AI 분석 시작</>
          )}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-in">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">분석 완료 ✨</h2>
              <span className="badge bg-emerald-50 text-emerald-700">
                정확도 {Math.round((result.confidence || 0.9) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">🏪 가게명</span>
                <input type="text" value={result.store_name}
                  onChange={e => setResult({ ...result, store_name: e.target.value })}
                  className="font-semibold text-right bg-transparent focus:outline-none focus:border-b focus:border-emerald-500 max-w-[200px]" />
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">📅 날짜</span>
                <input type="date" value={result.receipt_date}
                  onChange={e => setResult({ ...result, receipt_date: e.target.value })}
                  className="font-semibold bg-transparent focus:outline-none" />
              </div>
              <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-xl px-4">
                <span className="text-emerald-700 font-semibold text-sm">💰 총액</span>
                <div className="flex items-center">
                  <span className="text-emerald-700 font-bold mr-1">₩</span>
                  <input type="number" value={result.total_amount}
                    onChange={e => setResult({ ...result, total_amount: Number(e.target.value) || 0 })}
                    className="font-extrabold text-xl text-emerald-700 text-right bg-transparent focus:outline-none w-28" />
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">🏷️ 카테고리</span>
                <span className={`badge ${getCategoryInfo(result.category).color}`}>
                  {getCategoryInfo(result.category).icon} {getCategoryInfo(result.category).label}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">💳 결제</span>
                <span className="font-medium text-sm">
                  {result.payment_method === 'card' ? '💳 카드' : result.payment_method === 'cash' ? '💵 현금' : '📲 이체'}
                </span>
              </div>
              {result.tax_deductible && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
                  💰 세금 공제 가능 항목
                </div>
              )}
            </div>

            {result.items?.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">📋 구매 항목</h3>
                <div className="space-y-1.5">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm">
                      <span className="text-gray-700">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
                      <span className="font-semibold text-gray-900">{formatAmount(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">🏷️ 카테고리 변경</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button key={key} onClick={() => setResult({ ...result, category: key })}
                  className={`p-2.5 rounded-xl text-xs font-medium transition-colors ${
                    result.category === key ? cat.color + ' ring-2 ring-emerald-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                  <div className="text-base mb-0.5">{cat.icon}</div>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button onClick={save} disabled={saving}
            className="w-full py-4 btn-primary flex items-center justify-center gap-2 text-[15px]">
            {saving ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> 저장 중...</>
            ) : (
              <><Check className="h-5 w-5" /> 완료! 저장하기</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
