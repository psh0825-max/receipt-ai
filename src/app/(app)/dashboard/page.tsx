'use client'
import { useState, useEffect } from 'react'
import { getMonthlyStats, getReceipts, type Receipt } from '@/app/actions/receipts'
import { formatAmount, getCategoryInfo, CATEGORIES } from '@/lib/categories'
import { ReceiptCard } from '@/components/receipt-card'
import { Camera, TrendingUp, TrendingDown, Receipt as ReceiptIcon, ChevronLeft, ChevronRight, Calendar, Target } from 'lucide-react'
import Link from 'next/link'
import { format, addMonths, subMonths } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function DashboardPage() {
  const [stats, setStats] = useState<{ total: number; count: number; byCategory: Record<string, number> } | null>(null)
  const [recent, setRecent] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const month = format(currentDate, 'yyyy-MM')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [s, r] = await Promise.all([
          getMonthlyStats(month),
          getReceipts({ month }),
        ])
        setStats(s)
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

  const dailyAvg = stats?.count ? Math.round((stats.total / stats.count)) : 0
  const topCategory = sortedCategories[0] 
    ? getCategoryInfo(sortedCategories[0][0]).label 
    : '없음'

  // Donut chart calculations
  const donutData = sortedCategories.map(([cat, amount], index) => {
    const info = getCategoryInfo(cat)
    const pct = stats?.total ? (amount / stats.total) * 100 : 0
    return { category: cat, amount, percentage: pct, info, index }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        <div className="glass-card rounded-3xl p-6 h-48 shimmer-overlay animate-shimmer" />
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-4 h-20 shimmer-overlay animate-shimmer animate-stagger-1" />
          <div className="glass-card rounded-2xl p-4 h-20 shimmer-overlay animate-shimmer animate-stagger-2" />
          <div className="glass-card rounded-2xl p-4 h-20 shimmer-overlay animate-shimmer animate-stagger-3" />
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className={`glass-card rounded-2xl p-4 h-16 shimmer-overlay animate-shimmer animate-stagger-${i}`} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between glass-card rounded-2xl p-4 animate-fade-in">
        <button 
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold gradient-text">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
        </div>
        
        <button 
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Hero Card with Sparkle Pattern */}
      <div className="relative glass-card rounded-3xl p-6 gradient-primary text-white shadow-glow overflow-hidden animate-fade-in animate-stagger-1">
        {/* Sparkle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-12 right-12 w-2 h-2 bg-white rounded-full animate-pulse-soft"></div>
          <div className="absolute bottom-8 left-16 w-1 h-1 bg-white rounded-full animate-bounce-soft"></div>
          <div className="absolute bottom-16 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute top-20 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse-soft animation-delay-500"></div>
        </div>
        
        <div className="relative">
          <p className="text-emerald-100 text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            이번 달 총 지출
          </p>
          <p className="text-4xl font-extrabold mb-4 animate-fade-in">
            {formatAmount(stats?.total || 0)}
          </p>
          <div className="flex items-center justify-between text-sm text-emerald-100">
            <span>영수증 {stats?.count || 0}건</span>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>목표 달성률 87%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in animate-stagger-2">
        <div className="glass-card rounded-2xl p-4 text-center hover-lift">
          <div className="text-2xl font-bold text-emerald-600 mb-1">
            {stats?.count || 0}
          </div>
          <div className="text-xs text-gray-500">건수</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover-lift">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {formatAmount(dailyAvg).replace('₩', '')}
          </div>
          <div className="text-xs text-gray-500">일평균</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover-lift">
          <div className="text-lg font-bold text-purple-600 mb-1">
            {topCategory === '없음' ? topCategory : getCategoryInfo(sortedCategories[0][0]).icon}
          </div>
          <div className="text-xs text-gray-500">최다카테고리</div>
        </div>
      </div>

      {/* Category Donut Chart */}
      {sortedCategories.length > 0 && (
        <div className="glass-card rounded-3xl p-6 animate-fade-in animate-stagger-3">
          <h2 className="font-bold text-lg mb-4 gradient-text">카테고리별 지출</h2>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* Pure CSS donut chart */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#f3f4f6" 
                  strokeWidth="12"
                />
                {donutData.map((item, index) => {
                  const radius = 40
                  const circumference = 2 * Math.PI * radius
                  const strokeDasharray = (item.percentage / 100) * circumference
                  const offset = donutData.slice(0, index).reduce((acc, curr) => 
                    acc + (curr.percentage / 100) * circumference, 0
                  )
                  
                  return (
                    <circle
                      key={item.category}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={item.info.chartColor}
                      strokeWidth="12"
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-1000 ease-out"
                      style={{ 
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: '1s',
                        animationName: 'fadeIn'
                      }}
                    />
                  )
                })}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold gradient-text">
                  {formatAmount(stats?.total || 0).replace('₩', '')}
                </div>
                <div className="text-xs text-gray-500">총 지출</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {donutData.map((item, index) => (
              <div key={item.category} className={`flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all animate-fade-in animate-stagger-${index + 4}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.info.chartColor }}
                  />
                  <span className="text-lg">{item.info.icon}</span>
                  <span className="font-medium">{item.info.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatAmount(item.amount)}</div>
                  <div className="text-xs text-gray-500">{Math.round(item.percentage)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Receipts */}
      <div className="animate-fade-in animate-stagger-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg gradient-text">최근 영수증</h2>
          <Link 
            href="/receipts" 
            className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            전체 보기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        {recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((receipt, index) => (
              <div key={receipt.id} className={`animate-fade-in animate-stagger-${index + 5}`}>
                <ReceiptCard receipt={receipt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl text-center py-16 animate-fade-in animate-stagger-5">
            <div className="mb-4">
              <ReceiptIcon className="h-16 w-16 text-gray-200 mx-auto animate-pulse-soft" />
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2">아직 영수증이 없어요</h3>
            <p className="text-sm text-gray-400 mb-6">영수증을 스캔해서 시작하세요! 📸</p>
            <Link 
              href="/scan"
              className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl shadow-glow hover-lift"
            >
              <Camera className="h-4 w-4" />
              영수증 스캔하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}