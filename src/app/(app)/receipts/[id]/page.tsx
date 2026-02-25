'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getReceipt, deleteReceipt, type Receipt } from '@/app/actions/receipts'
import { getCategoryInfo, formatAmount } from '@/lib/categories'
import { ArrowLeft, Trash2, Calendar, CreditCard, Tag, ShieldCheck } from 'lucide-react'
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
    getReceipt(id as string).then(r => { setReceipt(r); setLoading(false) })
  }, [id])

  async function handleDelete() {
    if (!confirm('이 영수증을 삭제하시겠습니까?')) return
    setDeleting(true)
    try {
      await deleteReceipt(id as string)
      toast.success('삭제되었습니다')
      router.push('/receipts')
    } catch { toast.error('삭제 실패') }
  }

  if (loading) return <div className="animate-pulse"><div className="h-40 bg-gray-200 rounded-2xl" /><div className="h-60 bg-gray-200 rounded-2xl mt-4" /></div>
  if (!receipt) return <div className="text-center py-20 text-gray-400">영수증을 찾을 수 없습니다</div>

  const cat = getCategoryInfo(receipt.category)

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-gray-500">
        <ArrowLeft className="h-4 w-4" /> 뒤로
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <div className={`rounded-xl ${cat.color} p-3 text-2xl`}>{cat.icon}</div>
          <div>
            <h1 className="font-bold text-lg">{receipt.store_name}</h1>
            <p className="text-xs text-gray-400">
              {format(new Date(receipt.receipt_date), 'yyyy년 M월 d일 (EEE)', { locale: ko })}
            </p>
          </div>
        </div>
        <div className="text-3xl font-extrabold text-emerald-600">{formatAmount(receipt.total_amount)}</div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3">
        <div className="flex items-center gap-3">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 w-16">카테고리</span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${cat.color}`}>{cat.icon} {cat.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 w-16">결제</span>
          <span className="text-sm">{receipt.payment_method === 'card' ? '💳 카드' : receipt.payment_method === 'cash' ? '💵 현금' : '📲 이체'}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 w-16">날짜</span>
          <span className="text-sm">{receipt.receipt_date}</span>
        </div>
        {receipt.tax_deductible && (
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-600 font-medium">세금 공제 가능</span>
          </div>
        )}
      </div>

      {/* Items */}
      {receipt.items && receipt.items.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="font-bold text-sm mb-3">구매 항목</h2>
          <div className="divide-y divide-gray-50">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-700">{item.name}</span>
                <div className="text-right">
                  <span className="font-medium">{formatAmount(item.price)}</span>
                  {item.qty > 1 && <span className="text-xs text-gray-400 ml-1">×{item.qty}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <button onClick={handleDelete} disabled={deleting}
        className="w-full py-3 text-red-500 bg-red-50 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition">
        <Trash2 className="h-4 w-4" />
        {deleting ? '삭제 중...' : '영수증 삭제'}
      </button>
    </div>
  )
}
