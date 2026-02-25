'use client'
import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Check, X, Sparkles, ArrowRight } from 'lucide-react'
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

const ANALYSIS_STEPS = [
  { label: '업로드', icon: Upload },
  { label: '분석', icon: Sparkles },
  { label: '완료', icon: Check },
]

export default function ScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
      setResult(null)
      setCurrentStep(1)
    }
    reader.readAsDataURL(file)
  }

  async function analyze() {
    if (!image) return
    setAnalyzing(true)
    setCurrentStep(1)
    
    try {
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      })
      if (!res.ok) throw new Error('분석 실패')
      const data = await res.json()
      setResult(data)
      setCurrentStep(2)
      toast.success('영수증 분석 완료!')
    } catch {
      toast.error('분석에 실패했습니다. 다시 시도해주세요.')
      setCurrentStep(0)
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
      <div className="text-center">
        <h1 className="text-2xl font-bold gradient-text mb-2">영수증 스캔</h1>
        <p className="text-sm text-gray-600">AI가 자동으로 분석해드려요</p>
      </div>

      {/* Step Progress Indicator */}
      <div className="glass-card rounded-2xl p-4 animate-fade-in animate-stagger-1">
        <div className="flex items-center justify-between mb-3">
          {ANALYSIS_STEPS.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                ${index <= currentStep 
                  ? 'gradient-primary text-white shadow-glow' 
                  : 'bg-gray-200 text-gray-400'
                }
              `}>
                <step.icon className="h-5 w-5" />
              </div>
              {index < ANALYSIS_STEPS.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-3 transition-all duration-500
                  ${index < currentStep ? 'gradient-primary' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <span className="text-sm font-semibold text-gray-600">
            {ANALYSIS_STEPS[Math.min(currentStep, ANALYSIS_STEPS.length - 1)].label}
          </span>
          {analyzing && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="gradient-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera/Upload Area */}
      {!image ? (
        <div className="animate-fade-in animate-stagger-2">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative glass-card rounded-3xl p-16 text-center cursor-pointer hover:bg-gray-50 transition-all group overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.02) 0%, rgba(13, 148, 136, 0.02) 100%)'
            }}
          >
            {/* Animated dashed border */}
            <div className="absolute inset-4 border-2 border-dashed border-emerald-300 rounded-2xl animate-dash-flow opacity-50" 
                 style={{
                   backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(5, 150, 105, 0.1) 25%, rgba(5, 150, 105, 0.1) 50%, transparent 50%, transparent 75%, rgba(5, 150, 105, 0.1) 75%)',
                   backgroundSize: '20px 20px'
                 }}>
            </div>
            
            {/* Pulsing camera icon */}
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-full mb-4 animate-pulse-soft shadow-glow">
                <Camera className="h-10 w-10 text-white" />
              </div>
              
              {/* Floating capture hint */}
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-bounce-soft">
                터치!
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-emerald-700 mb-2 group-hover:scale-105 transition-transform">
              영수증을 촬영하세요 📸
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              카메라로 촬영하거나<br />
              갤러리에서 선택하세요
            </p>
            
            <input 
              ref={fileRef} 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} 
            />
          </div>
        </div>
      ) : (
        <div className="relative animate-fade-in animate-stagger-2">
          <div className="relative glass-card rounded-2xl p-4 shadow-lg">
            <img src={image} alt="영수증" className="w-full rounded-xl shadow-md" />
            <button 
              onClick={() => { setImage(null); setResult(null); setCurrentStep(0) }}
              className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all hover-scale"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {image && !result && (
        <button 
          onClick={analyze} 
          disabled={analyzing}
          className="w-full py-5 gradient-primary text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 disabled:opacity-50 hover-lift transition-all group animate-fade-in animate-stagger-3"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> 
              AI가 분석 중...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" /> 
              AI 분석 시작
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      )}

      {/* Analysis Result */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          {/* Receipt Paper Style Result */}
          <div className="receipt-paper glass-card rounded-2xl p-6 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold gradient-text">분석 완료! ✨</h2>
              <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                정확도 {Math.round((result.confidence || 0.9) * 100)}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                <span className="text-gray-600">🏪 가게명</span>
                <span className="font-bold text-lg">{result.store_name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-dashed border-gray-200">
                <span className="text-gray-600">📅 날짜</span>
                <span className="font-semibold">{result.receipt_date}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 bg-emerald-50 rounded-xl px-4">
                <span className="text-emerald-700 font-semibold">💰 총액</span>
                <span className="font-extrabold text-2xl text-emerald-700">{formatAmount(result.total_amount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">🏷️ 카테고리</span>
                <span className={`px-3 py-1.5 rounded-full font-semibold ${getCategoryInfo(result.category).color}`}>
                  {getCategoryInfo(result.category).icon} {getCategoryInfo(result.category).label}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">💳 결제방법</span>
                <span className="font-semibold">
                  {result.payment_method === 'card' ? '💳 카드' : 
                   result.payment_method === 'cash' ? '💵 현금' : '📲 계좌이체'}
                </span>
              </div>
              
              {result.tax_deductible && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-bounce-soft">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold">세금 공제 가능 항목입니다!</span>
                </div>
              )}
            </div>

            {/* Items List */}
            {result.items && result.items.length > 0 && (
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  📋 구매 항목
                </h3>
                <div className="space-y-2">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-gray-500 ml-2">× {item.qty}</span>
                      </span>
                      <span className="font-bold text-emerald-600">{formatAmount(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="glass-card rounded-2xl p-5 animate-fade-in animate-stagger-1">
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              🏷️ 카테고리 변경
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button 
                  key={key} 
                  onClick={() => setResult({ ...result, category: key })}
                  className={`
                    p-3 rounded-xl text-sm font-medium transition-all hover-scale
                    ${result.category === key 
                      ? cat.color + ' ring-2 ring-emerald-500 shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={save} 
            disabled={saving}
            className="w-full py-5 gradient-primary text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3 disabled:opacity-50 hover-lift transition-all group animate-fade-in animate-stagger-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> 
                저장 중...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" /> 
                완료! 저장하기
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}