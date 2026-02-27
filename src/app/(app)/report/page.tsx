'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo } from '@/lib/categories'
import { format, subMonths, addMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar, BarChart3, Sparkles } from 'lucide-react'

export default function ReportPage() {
  const [date, setDate] = useState(new Date())
  const [stats, setStats] = useState<{ 
    total: number; count: number
    byCategory: Record<string, number>
    byDay: Record<string, number> 
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevStats, setPrevStats] = useState<{ total: number; count: number } | null>(null)
  const month = format(date, 'yyyy-MM')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [cur, prev] = await Promise.all([
          getMonthlyStats(month),
          getMonthlyStats(format(subMonths(date, 1), 'yyyy-MM')),
        ])
        setStats(cur)
        setPrevStats(prev)
      } catch { /* */ } finally { setLoading(false) }
    }
    load()
  }, [month, date])

  const sortedCats = Object.entries(stats?.byCategory || {}).sort(([, a], [, b]) => b - a)
  const sortedDays = Object.entries(stats?.byDay || {}).sort(([a], [b]) => a.localeCompare(b))
  const maxDay = Math.max(...sortedDays.map(([, v]) => v), 1)
  const topCategory = sortedCats[0] ? getCategoryInfo(sortedCats[0][0]) : null
  const dailyAvg = stats?.count ? Math.round(stats.total / stats.count) : 0
  const totalChange = prevStats && prevStats.total > 0 
    ? ((stats?.total || 0) - prevStats.total) / prevStats.total * 100 : 0

  const taxDeductibleTotal = sortedCats
    .filter(([cat]) => ['medical', 'education', 'culture'].includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0)

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10" />
        <div className="skeleton h-36" />
        <div className="skeleton h-48" />
        <div className="skeleton h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" /> 리포트
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">월별 지출 분석</p>
        </div>
        <div className="flex items-center gap-1 card px-2 py-1.5">
          <button onClick={() => setDate(subMonths(date, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
          <span className="text-sm font-semibold text-gray-900 min-w-[90px] text-center">
            {format(date, 'yyyy년 M월', { locale: ko })}
          </span>
          <button onClick={() => setDate(addMonths(date, 1))} className="p-1.5 rounded-lg hover:bg-gray-100" disabled={date >= new Date()}>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">이번 달 총 지출</span>
          {totalChange !== 0 && (
            <span className={`badge text-xs ${totalChange > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
              {totalChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(totalChange).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-3xl font-extrabold text-gray-900 mb-4">{formatAmount(stats?.total || 0)}</p>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{stats?.count || 0}</div>
            <div className="text-[11px] text-gray-500">건수</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">{formatAmount(dailyAvg).replace('₩', '')}</div>
            <div className="text-[11px] text-gray-500">건당 평균</div>
          </div>
          <div>
            <div className="text-lg">{topCategory?.icon || '📋'}</div>
            <div className="text-[11px] text-gray-500">최다</div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {(stats?.count || 0) > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4 text-center">
            <div className="text-xl mb-1">{(prevStats?.total || 0) > 0 && (stats?.total || 0) <= prevStats!.total ? '📉' : '📈'}</div>
            <div className="text-[11px] text-gray-500 mb-1">전월 대비</div>
            <div className={`text-sm font-bold ${(prevStats?.total || 0) > 0 && (stats?.total || 0) <= prevStats!.total ? 'text-emerald-600' : 'text-red-500'}`}>
              {(prevStats?.total || 0) > 0 
                ? (stats?.total || 0) <= prevStats!.total 
                  ? `${formatAmount(prevStats!.total - (stats?.total || 0))} 절약`
                  : `${formatAmount((stats?.total || 0) - prevStats!.total)} 초과`
                : '데이터 없음'}
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-xl mb-1">💰</div>
            <div className="text-[11px] text-gray-500 mb-1">세금공제</div>
            <div className="text-sm font-bold text-blue-600">{formatAmount(taxDeductibleTotal)}</div>
          </div>
        </div>
      )}

      {/* Daily Spending */}
      {sortedDays.length > 0 && (
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[15px] text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600" /> 일별 지출
            </h2>
            <span className="text-[11px] text-gray-400">최고 {formatAmount(maxDay)}</span>
          </div>
          <div className="space-y-2">
            {sortedDays.map(([day, amount]) => {
              const pct = Math.max((amount / maxDay) * 100, 3)
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-7 text-[11px] text-gray-400 text-center shrink-0">{day.split('-')[2]}</span>
                  <div className="flex-1 h-7 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-lg flex items-center justify-end px-2"
                      style={{ width: `${pct}%` }}
                    >
                      {amount > 0 && pct > 25 && (
                        <span className="text-white text-[10px] font-semibold">{formatAmount(amount)}</span>
                      )}
                    </div>
                  </div>
                  {amount > 0 && pct <= 25 && (
                    <span className="text-[11px] text-gray-500 shrink-0">{formatAmount(amount)}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {sortedCats.length > 0 && (
        <div className="card-elevated p-5">
          <h2 className="font-bold text-[15px] text-gray-900 mb-4">카테고리별 분석</h2>
          <div className="space-y-3.5">
            {sortedCats.map(([cat, amount]) => {
              const info = getCategoryInfo(cat)
              const pct = stats?.total ? (amount / stats.total) * 100 : 0
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">{info.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">{info.label}</div>
                      <div className="text-[11px] text-gray-400">{Math.round(pct)}%</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{formatAmount(amount)}</div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-11">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: info.chartColor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Insights */}
      {topCategory && (stats?.count || 0) > 0 && (
        <div className="card p-5 bg-gray-50">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" /> 이번 달 인사이트
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl">
              <span>{topCategory.icon}</span>
              <span className="text-gray-600"><strong>최다 카테고리:</strong> {topCategory.label}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl">
              <span>📊</span>
              <span className="text-gray-600"><strong>건당 평균:</strong> {formatAmount(dailyAvg)}</span>
            </div>
            {taxDeductibleTotal > 0 && (
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl">
                <span>💰</span>
                <span className="text-gray-600"><strong>세금공제:</strong> {formatAmount(taxDeductibleTotal)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty */}
      {(stats?.count || 0) === 0 && (
        <div className="card-elevated text-center py-16">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-gray-400 mb-1">{format(date, 'M월', { locale: ko })} 데이터가 없어요</h3>
          <p className="text-sm text-gray-400 mb-5">영수증을 스캔하면 리포트를 볼 수 있어요</p>
          <button onClick={() => setDate(new Date())} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Calendar className="h-4 w-4" /> 이번 달로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}
