'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo } from '@/lib/categories'
import { format, subMonths, addMonths } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Download, TrendingUp, TrendingDown, Target, Award, Calendar, BarChart3, Sparkles } from 'lucide-react'

export default function ReportPage() {
  const [date, setDate] = useState(new Date())
  const [stats, setStats] = useState<{ 
    total: number
    count: number
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
        // Get current month stats
        const currentStats = await getMonthlyStats(month)
        setStats(currentStats)
        
        // Get previous month stats for comparison
        const prevMonth = format(subMonths(date, 1), 'yyyy-MM')
        const prevMonthStats = await getMonthlyStats(prevMonth)
        setPrevStats(prevMonthStats)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [month, date])

  const sortedCats = Object.entries(stats?.byCategory || {}).sort(([, a], [, b]) => b - a)
  const sortedDays = Object.entries(stats?.byDay || {}).sort(([a], [b]) => a.localeCompare(b))
  const maxDay = Math.max(...sortedDays.map(([, v]) => v), 1)
  const topCategory = sortedCats[0] ? getCategoryInfo(sortedCats[0][0]) : null
  const dailyAvg = stats?.count ? Math.round((stats.total / stats.count)) : 0
  
  // Calculate change from previous month
  const totalChange = prevStats && prevStats.total > 0 
    ? ((stats?.total || 0) - prevStats.total) / prevStats.total * 100 
    : 0
  const countChange = prevStats && prevStats.count > 0 
    ? ((stats?.count || 0) - prevStats.count) / prevStats.count * 100 
    : 0

  const taxDeductibleTotal = sortedCats
    .filter(([cat]) => ['medical', 'education', 'culture'].includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="glass-card rounded-xl p-3 w-24 h-10 shimmer-overlay animate-shimmer" />
          <div className="glass-card rounded-xl p-3 w-32 h-10 shimmer-overlay animate-shimmer" />
        </div>
        <div className="glass-card rounded-3xl p-6 h-48 shimmer-overlay animate-shimmer animate-stagger-1" />
        <div className="glass-card rounded-3xl p-6 h-64 shimmer-overlay animate-shimmer animate-stagger-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            리포트
          </h1>
          <p className="text-sm text-gray-500">월별 지출 분석</p>
        </div>
        
        {/* Month Selector with slide animation */}
        <div className="flex items-center gap-1 glass-card rounded-xl p-2">
          <button 
            onClick={() => setDate(subMonths(date, 1))} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-all hover-scale"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div className="px-3 py-1 min-w-[100px] text-center">
            <span className="text-sm font-bold gradient-text animate-fade-in">
              {format(date, 'yyyy년 M월', { locale: ko })}
            </span>
          </div>
          <button 
            onClick={() => setDate(addMonths(date, 1))} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-all hover-scale"
            disabled={date >= new Date()}
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Hero Summary Card */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white animate-fade-in animate-stagger-1">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400 text-sm">이번 달 총 지출</span>
            </div>
            {totalChange !== 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                totalChange > 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
              }`}>
                {totalChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(totalChange).toFixed(1)}%
              </div>
            )}
          </div>
          
          <div className="text-3xl font-extrabold mb-4 animate-fade-in">
            {formatAmount(stats?.total || 0)}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-gray-400 text-sm">
            <div>
              <div className="text-xl font-bold text-white">{stats?.count || 0}</div>
              <div className="flex items-center gap-1">건수</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{formatAmount(dailyAvg).replace('₩', '')}</div>
              <div>일평균</div>
            </div>
            <div>
              <div className="text-xl font-bold text-white">{topCategory?.icon || '📋'}</div>
              <div>최다</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      {(stats?.count || 0) > 0 && (
        <div className="grid grid-cols-2 gap-3 animate-fade-in animate-stagger-2">
          <div className="glass-card rounded-2xl p-4 text-center hover-lift">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-semibold text-gray-700">목표 달성률</div>
            <div className="text-xl font-bold text-emerald-600">
              {Math.min(Math.round(((stats?.total || 0) / 500000) * 100), 100)}%
            </div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center hover-lift">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-semibold text-gray-700">세금공제</div>
            <div className="text-xl font-bold text-blue-600">
              {formatAmount(taxDeductibleTotal).replace('₩', '')}
            </div>
          </div>
        </div>
      )}

      {/* Daily Spending Bar Chart */}
      {sortedDays.length > 0 && (
        <div className="glass-card rounded-3xl p-6 animate-fade-in animate-stagger-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold gradient-text flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              일별 지출 패턴
            </h2>
            <div className="text-xs text-gray-500">최고: {formatAmount(maxDay)}</div>
          </div>
          
          <div className="space-y-3">
            {sortedDays.map(([day, amount], index) => {
              const dayNum = day.split('-')[2]
              const percentage = Math.max((amount / maxDay) * 100, 2)
              
              return (
                <div key={day} className={`flex items-center gap-4 group animate-fade-in animate-stagger-${index + 1}`}>
                  <div className="w-8 text-xs text-gray-500 font-medium text-center">
                    {dayNum}일
                  </div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-xl overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-end px-3 transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {amount > 0 && (
                        <span className="text-white text-xs font-semibold">
                          {formatAmount(amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {sortedCats.length > 0 && (
        <div className="glass-card rounded-3xl p-6 animate-fade-in animate-stagger-4">
          <h2 className="text-lg font-bold gradient-text mb-6 flex items-center gap-2">
            <Target className="h-5 w-5" />
            카테고리별 분석
          </h2>
          
          <div className="space-y-4">
            {sortedCats.map(([cat, amount], index) => {
              const info = getCategoryInfo(cat)
              const percentage = stats?.total ? (amount / stats.total) * 100 : 0
              
              return (
                <div key={cat} className={`group hover:bg-gray-50 rounded-xl p-3 transition-all animate-fade-in animate-stagger-${index + 1}`}>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                        {info.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{info.label}</div>
                        <div className="text-xs text-gray-500">
                          {Math.round(percentage)}% • 평균 {formatAmount(amount / (stats?.count || 1))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatAmount(amount)}</div>
                    </div>
                  </div>
                  
                  {/* Animated progress bar */}
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: info.chartColor,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Insights Section */}
      {topCategory && (stats?.count || 0) > 0 && (
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-r from-purple-50 to-pink-50 animate-fade-in animate-stagger-5">
          <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            이번 달 인사이트
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl">
              <span className="text-lg">{topCategory.icon}</span>
              <span>
                <strong>가장 많이 쓴 카테고리:</strong> {topCategory.label}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl">
              <span className="text-lg">📊</span>
              <span>
                <strong>하루 평균 지출:</strong> {formatAmount(dailyAvg)}
              </span>
            </div>
            {taxDeductibleTotal > 0 && (
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-xl">
                <span className="text-lg">💰</span>
                <span>
                  <strong>세금공제 가능 금액:</strong> {formatAmount(taxDeductibleTotal)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(stats?.count || 0) === 0 && (
        <div className="glass-card rounded-3xl text-center py-20 animate-fade-in animate-stagger-3">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            {format(date, 'M월', { locale: ko })} 데이터가 없어요
          </h3>
          <p className="text-sm text-gray-500 mb-6">영수증을 스캔하면 리포트를 볼 수 있어요</p>
          <button 
            onClick={() => setDate(new Date())}
            className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl shadow-glow hover-lift"
          >
            <Calendar className="h-4 w-4" />
            이번 달로 돌아가기
          </button>
        </div>
      )}
    </div>
  )
}