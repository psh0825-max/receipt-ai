'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats, getReceipts, type Receipt } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo } from '@/lib/categories'
import { ReceiptCard } from '@/components/receipt-card'
import { Camera, TrendingDown, TrendingUp, ChevronLeft, ChevronRight, ChevronRight as Arrow } from 'lucide-react'
import Link from 'next/link'
import { format, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function DashboardPage() {
  const [stats, setStats] = useState<{ total: number; count: number; byCategory: Record<string, number> } | null>(null)
  const [prevStats, setPrevStats] = useState<{ total: number; count: number } | null>(null)
  const [recent, setRecent] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const month = format(currentDate, 'yyyy-MM')
  const prevMonth = format(subMonths(currentDate, 1), 'yyyy-MM')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [s, r, ps] = await Promise.all([
          getMonthlyStats(month),
          getReceipts({ month }),
          getMonthlyStats(prevMonth),
        ])
        setStats(s)
        setPrevStats(ps)
        setRecent(r.slice(0, 5))
      } catch { /* */ } finally { 
        setLoading(false) 
      }
    }
    load()
  }, [month])

  const sortedCategories = Object.entries(stats?.byCategory || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const dailyAvg = stats?.count ? Math.round(stats.total / stats.count) : 0

  const donutData = sortedCategories.map(([cat, amount]) => {
    const info = getCategoryInfo(cat)
    const pct = stats?.total ? (amount / stats.total) * 100 : 0
    return { category: cat, amount, percentage: pct, info }
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-12" />
        <div className="skeleton h-36" />
        <div className="grid grid-cols-3 gap-3">
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
          <div className="skeleton h-20" />
        </div>
        <div className="skeleton h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Total Spend Card */}
      <div className="card-elevated p-6">
        <p className="text-sm text-gray-500 mb-1">이번 달 총 지출</p>
        <p className="text-3xl font-extrabold text-gray-900 mb-2">
          {formatAmount(stats?.total || 0)}
        </p>
        
        {prevStats && prevStats.total > 0 && (
          <div className={`badge text-xs ${
            (stats?.total || 0) <= prevStats.total 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-red-50 text-red-600'
          }`}>
            {(stats?.total || 0) <= prevStats.total ? (
              <><TrendingDown className="h-3 w-3" /> 전월 대비 {formatAmount(prevStats.total - (stats?.total || 0))} 절약</>
            ) : (
              <><TrendingUp className="h-3 w-3" /> 전월 대비 {formatAmount((stats?.total || 0) - prevStats.total)} 초과</>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span>영수증 <strong className="text-gray-900">{stats?.count || 0}</strong>건</span>
          <span>일평균 <strong className="text-gray-900">{formatAmount(Math.round((stats?.total || 0) / Math.max(new Date().getDate(), 1)))}</strong></span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{stats?.count || 0}</div>
          <div className="text-[11px] text-gray-500 mt-1">건수</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xl font-bold text-gray-900">{formatAmount(dailyAvg).replace('₩', '')}</div>
          <div className="text-[11px] text-gray-500 mt-1">건당 평균</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-xl">
            {sortedCategories[0] ? getCategoryInfo(sortedCategories[0][0]).icon : '—'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">최다 카테고리</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <div className="card-elevated p-5">
          <h2 className="font-bold text-[15px] text-gray-900 mb-4">카테고리별 지출</h2>
          
          {/* Donut */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                {donutData.map((item, index) => {
                  const r = 38
                  const c = 2 * Math.PI * r
                  const dash = (item.percentage / 100) * c
                  const offset = donutData.slice(0, index).reduce((acc, cur) => acc + (cur.percentage / 100) * c, 0)
                  return (
                    <circle key={item.category} cx="50" cy="50" r={r} fill="none"
                      stroke={item.info.chartColor} strokeWidth="10"
                      strokeDasharray={`${dash} ${c}`} strokeDashoffset={-offset}
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-gray-900">{formatAmount(stats?.total || 0).replace('₩', '')}</div>
                <div className="text-[11px] text-gray-500">총 지출</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2.5">
            {donutData.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.info.chartColor }} />
                <span className="text-sm text-gray-600 flex-1">{item.info.icon} {item.info.label}</span>
                <span className="text-sm font-semibold text-gray-900">{formatAmount(item.amount)}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{Math.round(item.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Receipts */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-[15px] text-gray-900">최근 영수증</h2>
          <Link href="/receipts" className="text-sm text-emerald-600 font-medium flex items-center gap-0.5">
            전체 보기 <Arrow className="h-3.5 w-3.5" />
          </Link>
        </div>
        
        {recent.length > 0 ? (
          <div className="space-y-2.5">
            {recent.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center py-14">
            <div className="text-4xl mb-3">🧾</div>
            <h3 className="font-bold text-gray-400 mb-1">아직 영수증이 없어요</h3>
            <p className="text-sm text-gray-400 mb-5">영수증을 스캔해서 시작하세요!</p>
            <Link href="/scan" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Camera className="h-4 w-4" /> 영수증 스캔하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
