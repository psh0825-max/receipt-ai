'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReceipt, deleteReceipt, type Receipt } from '@/app/actions/receipts'
import { getCategoryInfo, formatAmount } from '@/lib/categories'
import { ArrowLeft, Trash2, Calendar, CreditCard, Tag, ShieldCheck, Edit3, MapPin, Share } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function ReceiptDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const r = await getReceipt(id as string)
        setReceipt(r)
      } catch (error) {
        console.error(error)
        toast.error('영수증을 불러올 수 없습니다')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleDelete() {
    if (!confirm('이 영수증을 삭제하시겠습니까?\n삭제된 영수증은 복구할 수 없습니다.')) return
    setDeleting(true)
    try {
      await deleteReceipt(id as string)
      toast.success('영수증이 삭제되었습니다')
      router.push('/receipts')
    } catch {
      toast.error('삭제에 실패했습니다')
    } finally {
      setDeleting(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && receipt) {
      try {
        await navigator.share({
          title: `영수증: ${receipt.store_name}`,
          text: `${receipt.store_name}에서 ${formatAmount(receipt.total_amount)} 지출`,
        })
      } catch (error) {
        // Fallback to copying to clipboard
        const textToCopy = `${receipt.store_name} ${formatAmount(receipt.total_amount)} (${receipt.receipt_date})`
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy)
          toast.success('영수증 정보가 복사되었습니다')
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="w-16 h-6 glass-card rounded-lg shimmer-overlay animate-shimmer" />
          <div className="w-20 h-8 glass-card rounded-lg shimmer-overlay animate-shimmer" />
        </div>
        <div className="receipt-paper glass-card rounded-3xl p-6 h-80 shimmer-overlay animate-shimmer" />
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="glass-card rounded-3xl text-center py-20 animate-fade-in">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-400 mb-2">영수증을 찾을 수 없습니다</h2>
        <p className="text-sm text-gray-500 mb-6">삭제되었거나 존재하지 않는 영수증입니다</p>
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl shadow-glow hover-lift"
        >
          <ArrowLeft className="h-4 w-4" />
          돌아가기
        </button>
      </div>
    )
  }

  const cat = getCategoryInfo(receipt.category)
  const hasAddress = receipt.store_name && receipt.store_name.includes('주소') // Example check for address

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">뒤로</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <Share className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Receipt Paper Style Main Card */}
      <div className="receipt-paper glass-card rounded-3xl p-6 shadow-lg animate-fade-in animate-stagger-1">
        {/* Large Store Name Header */}
        <div className="text-center mb-6 pb-4 border-b border-dashed border-gray-300">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 ${cat.color}`}>
            <span className="text-2xl">{cat.icon}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{receipt.store_name}</h1>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(receipt.receipt_date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
          </div>
        </div>

        {/* Total Amount - Highlighted */}
        <div className="text-center mb-6 py-4 bg-emerald-50 rounded-2xl">
          <div className="text-sm text-emerald-600 mb-1 font-semibold">총 결제 금액</div>
          <div className="text-4xl font-extrabold text-emerald-700 font-mono">
            {formatAmount(receipt.total_amount)}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">카테고리</span>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${cat.color}`}>
                {cat.icon} {cat.label}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">결제수단</span>
            </div>
            <div className="text-right text-gray-800 font-semibold">
              {receipt.payment_method === 'card' ? '💳 카드' : 
               receipt.payment_method === 'cash' ? '💵 현금' : '📲 계좌이체'}
            </div>
          </div>

          {receipt.tax_deductible && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold text-sm">세금 공제 가능 항목</span>
            </div>
          )}

          {/* Mock address for demonstration */}
          {hasAddress && (
            <button className="w-full bg-gray-50 rounded-xl p-3 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">위치 보기</div>
                <div className="text-xs text-gray-500">서울시 강남구 테헤란로 123</div>
              </div>
            </button>
          )}
        </div>

        {/* Items List with Alternating Colors */}
        {receipt.items && receipt.items.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-gray-300">
              <h2 className="text-lg font-bold text-gray-800">구매 항목</h2>
              <span className="text-xs text-gray-500">{receipt.items.length}개 항목</span>
            </div>
            
            <div className="space-y-1">
              {receipt.items.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center py-3 px-4 rounded-xl text-sm transition-colors ${
                    i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-emerald-50`}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    {item.qty > 1 && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatAmount(Math.round((item.price || 0) / (item.qty || 1)))} × {item.qty}개
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 font-mono">
                      {formatAmount(item.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Score */}
        {typeof receipt.ai_metadata?.confidence === 'number' && (
          <div className="text-center py-3 text-xs text-gray-500 border-t border-dashed border-gray-300">
            AI 분석 정확도: {Math.round((receipt.ai_metadata.confidence as number) * 100)}%
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in animate-stagger-2">
        <button className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl font-semibold hover:bg-blue-100 transition-colors">
          <Edit3 className="h-4 w-4" />
          수정하기
        </button>
        
        <button 
          onClick={handleDelete} 
          disabled={deleting}
          className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              삭제 중...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              삭제하기
            </>
          )}
        </button>
      </div>
    </div>
  )
}