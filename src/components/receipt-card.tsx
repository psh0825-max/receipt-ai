'use client'
import { getCategoryInfo, formatAmount } from '@/lib/categories'
import type { Receipt } from '@/app/actions/receipts'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight, CreditCard, Banknote, Smartphone, Receipt as ReceiptIcon } from 'lucide-react'
import Link from 'next/link'

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  const cat = getCategoryInfo(receipt.category)
  
  const getPaymentIcon = () => {
    switch (receipt.payment_method) {
      case 'card': return <CreditCard className="h-3 w-3" />
      case 'cash': return <Banknote className="h-3 w-3" />
      case 'transfer': return <Smartphone className="h-3 w-3" />
      default: return <ReceiptIcon className="h-3 w-3" />
    }
  }

  const getPaymentText = () => {
    switch (receipt.payment_method) {
      case 'card': return '카드'
      case 'cash': return '현금'
      case 'transfer': return '이체'
      default: return '기타'
    }
  }

  return (
    <Link href={`/receipts/${receipt.id}`} className="block">
      <div className="group relative glass-card rounded-2xl p-4 hover-lift transition-all border-l-4 border-l-transparent hover:border-l-emerald-500 hover:shadow-lg">
        {/* Subtle category color left border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all"
          style={{ backgroundColor: cat.chartColor }}
        />
        
        <div className="flex items-center gap-4">
          {/* Category Badge - Pill Style */}
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all group-hover:scale-105
            ${cat.color}
          `}>
            <span className="text-base">{cat.icon}</span>
            <span className="font-semibold">{cat.label}</span>
          </div>
          
          {/* Receipt Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-800 truncate group-hover:text-emerald-700 transition-colors">
                {receipt.store_name}
              </h3>
              
              {/* Amount - Bold Mono Style */}
              <div className="text-right ml-3">
                <div className="font-extrabold text-xl text-gray-900 font-mono group-hover:text-emerald-700 transition-colors">
                  {formatAmount(receipt.total_amount)}
                </div>
              </div>
            </div>
            
            {/* Meta Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  📅
                  <span>{format(new Date(receipt.receipt_date), 'M월 d일 (E)', { locale: ko })}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {getPaymentIcon()}
                  <span>{getPaymentText()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Tax Deductible Mini Badge */}
                {receipt.tax_deductible && (
                  <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 animate-scale-in">
                    💰
                    <span>공제</span>
                  </div>
                )}
                
                {/* Arrow indicator */}
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle hover glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
             style={{
               background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(5, 150, 105, 0.05), transparent 40%)'
             }} />
      </div>
    </Link>
  )
}