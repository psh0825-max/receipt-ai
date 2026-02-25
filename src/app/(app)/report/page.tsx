'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo } from '@/lib/categories'
import { format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'

export default function ReportPage() {
  const [date, setDate] = useState(new Date())
  const [stats, setStats] = useState<{ total: number; count: number; byCategory: Record<string, number>; byDay: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)
  const month = format(date, 'yyyy-MM')

  useEffect(() => {
    setLoading(true)
    getMonthlyStats(month).then(s => { setStats(s); setLoading(false) })
  }, [month])

  const sortedCats = Object.entries(stats?.byCategory || {}).sort(([, a], [, b]) => b - a)
  const sortedDays = Object.entries(stats?.byDay || {}).sort(([a], [b]) => a.localeCompare(b))
  const maxDay = Math.max(...sortedDays.map(([, v]) => v), 1)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">리포트</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setDate(subMonths(date, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold min-w-[80px] text-center">{format(date, 'yyyy년 M월')}</span>
          <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <p className="text-sm text-emerald-100">이번 달 총 지출</p>
            <p className="text-3xl font-extrabold mt-1">{formatAmount(stats?.total || 0)}</p>
            <p className="text-sm text-emerald-100 mt-2">영수증 {stats?.count || 0}건</p>
          </div>

          {/* Daily Chart */}
          {sortedDays.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
              <h2 className="font-bold text-sm mb-4">일별 지출</h2>
              <div className="space-y-2">
                {sortedDays.map(([day, amount]) => (
                  <div key={day} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-8">{day.split('-')[2]}일</span>
                    <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${Math.max((amount / maxDay) * 100, 10)}%` }}>
                        <span className="text-[10px] text-white font-medium">{formatAmount(amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {sortedCats.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
              <h2 className="font-bold text-sm mb-4">카테고리별</h2>
              <div className="space-y-3">
                {sortedCats.map(([cat, amount]) => {
                  const info = getCategoryInfo(cat)
                  const pct = stats?.total ? Math.round((amount / stats.total) * 100) : 0
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-lg w-8 text-center">{info.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{info.label}</span>
                          <span className="font-semibold">{formatAmount(amount)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: info.chartColor }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-10 text-right">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty */}
          {(stats?.count || 0) === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-50">
              <p className="text-sm text-gray-400">이번 달 데이터가 없어요</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
