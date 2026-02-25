'use client'
import { getCategoryInfo, formatAmount } from '@/lib/categories'
import type { Receipt } from '@/app/actions/receipts'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const cat = getCategoryInfo(receipt.category)
  return (
    <Link href={`/receipts/${receipt.id}`}
      className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition">
      <div className={`rounded-xl ${cat.color} p-2.5 text-lg`}>
        {cat.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{receipt.store_name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {format(new Date(receipt.receipt_date), 'M월 d일 (EEE)', { locale: ko })}
          {receipt.payment_method === 'card' && ' · 카드'}
          {receipt.payment_method === 'cash' && ' · 현금'}
        </p>
      </div>
      <div className="text-right flex items-center gap-1">
        <span className="font-bold text-sm">{formatAmount(receipt.total_amount)}</span>
        <ChevronRight className="h-4 w-4 text-gray-300" />
      </div>
    </Link>
  )
}
