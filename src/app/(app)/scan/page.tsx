'use client'
import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createReceipt } from '@/app/actions/receipts'
import { getCategoryInfo, formatAmount, CATEGORIES, type CategoryKey } from '@/lib/categories'

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

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setResult(null)
    }
    reader.readAsDataURL(file)
  }

  async function analyze() {
    if (!image) return
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      if (!res.ok) throw new Error('분석 실패')
      const data = await res.json()
      setResult(data)
      toast.success('영수증 분석 완료!')
    } catch {
      toast.error('분석에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setAnalyzing(false)
    }
  }

  async function save() {
    if (!result) return
    setSaving(true)
    try {
      await createReceipt({
        store_name: result.store_name,
        receipt_date: result.receipt_date,
        total_amount: result.total_amount,
        currency: result.currency || 'KRW',
        category: result.category,
        payment_method: result.payment_method,
        items: result.items || [],
        tax_deductible: result.tax_deductible || false,
        image_url: null,
        ai_metadata: { confidence: result.confidence },
      })
      toast.success('영수증이 저장되었습니다!')
      router.push('/receipts')
    } catch {
      toast.error('저장에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">영수증 스캔</h1>

      {/* Upload Area */}
      {!image ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-emerald-300 rounded-2xl p-12 text-center cursor-pointer hover:bg-emerald-50 transition"
        >
          <Camera className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
          <p className="font-semibold text-emerald-700">영수증 촬영 또는 업로드</p>
          <p className="text-xs text-gray-400 mt-1">카메라로 촬영하거나 갤러리에서 선택하세요</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="relative">
          <img src={image} alt="영수증" className="w-full rounded-2xl shadow-md" />
          <button onClick={() => { setImage(null); setResult(null) }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {image && !result && (
        <button onClick={analyze} disabled={analyzing}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
          {analyzing ? <><Loader2 className="h-5 w-5 animate-spin" /> AI 분석 중...</> : <><Camera className="h-5 w-5" /> AI 분석 시작</>}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">분석 결과</h2>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                정확도 {Math.round((result.confidence || 0.9) * 100)}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">가게명</span>
                <span className="font-semibold text-sm">{result.store_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">날짜</span>
                <span className="font-semibold text-sm">{result.receipt_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">총액</span>
                <span className="font-bold text-lg text-emerald-600">{formatAmount(result.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">카테고리</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${getCategoryInfo(result.category).color}`}>
                  {getCategoryInfo(result.category).icon} {getCategoryInfo(result.category).label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">결제</span>
                <span className="text-sm">{result.payment_method === 'card' ? '💳 카드' : result.payment_method === 'cash' ? '💵 현금' : '📲 이체'}</span>
              </div>
              {result.tax_deductible && (
                <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-xl flex items-center gap-1">
                  💰 세금 공제 가능 항목입니다
                </div>
              )}
            </div>

            {/* Items */}
            {result.items && result.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold mb-2">구매 항목</h3>
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5">
                    <span className="text-gray-600">{item.name} × {item.qty}</span>
                    <span>{formatAmount(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Edit */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <h3 className="text-sm font-semibold mb-3">카테고리 변경</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button key={key} onClick={() => setResult({ ...result, category: key })}
                  className={`text-xs px-3 py-1.5 rounded-full transition ${result.category === key ? cat.color + ' ring-2 ring-offset-1' : 'bg-gray-100 text-gray-500'}`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button onClick={save} disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <><Loader2 className="h-5 w-5 animate-spin" /> 저장 중...</> : <><Check className="h-5 w-5" /> 저장하기</>}
          </button>
        </div>
      )}
    </div>
  )
}
