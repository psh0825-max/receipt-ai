'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats, getReceipts, type Receipt } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo } from '@/lib/categories'
import { ReceiptCard } from '@/components/receipt-card'
import { Camera, TrendingUp, TrendingDown, Receipt as ReceiptIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
  const [stats, setStats] = useState<{ total: number; count: number; byCategory: Record<string, number> } | null>(null)
  const [recent, setRecent] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const month = format(new Date(), 'yyyy-MM')

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          getMonthlyStats(month),
          getReceipts({ month }),
        ])
        setStats(s)
        setRecent(r.slice(0, 5))
      } catch { /* */ } finally { setLoading(false) }
    }
    load()
  }, [month])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  const sortedCategories = Object.entries(stats?.byCategory || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Monthly Total */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/25">
        <p className="text-sm text-emerald-100">{format(new Date(), 'M월')} 총 지출</p>
        <p className="text-3xl font-extrabold mt-1">{formatAmount(stats?.total || 0)}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-emerald-100">
          <span>영수증 {stats?.count || 0}건</span>
        </div>
      </div>

      {/* Category Summary */}
      {sortedCategories.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="font-bold text-sm mb-3">카테고리별 지출</h2>
          <div className="space-y-3">
            {sortedCategories.map(([cat, amount]) => {
              const info = getCategoryInfo(cat)
              const pct = stats?.total ? Math.round((amount / stats.total) * 100) : 0
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg">{info.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{info.label}</span>
                      <span>{formatAmount(amount)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: info.chartColor }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Receipts */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-sm">최근 영수증</h2>
          <Link href="/receipts" className="text-xs text-emerald-600 font-medium">전체 보기 →</Link>
        </div>
        {recent.length > 0 ? (
          <div className="space-y-2">
            {recent.map(r => <ReceiptCard key={r.id} receipt={r} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-50">
            <ReceiptIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 mb-1">아직 영수증이 없어요</p>
            <p className="text-xs text-gray-300">영수증을 스캔해서 시작하세요!</p>
          </div>
        )}
      </div>

      {/* Scan FAB */}
      <Link href="/scan"
        className="fixed bottom-24 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-4 shadow-xl shadow-emerald-500/30 animate-pulse-soft z-40">
        <Camera className="h-6 w-6" />
      </Link>
    </div>
  )
}
