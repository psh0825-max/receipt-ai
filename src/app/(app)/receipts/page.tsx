'use client'
import { useState, useEffect, useRef } from 'react'
import { getReceipts, type Receipt } from '@/app/actions/receipts'
import { ReceiptCard } from '@/components/receipt-card'
import { CATEGORIES } from '@/lib/categories'
import { Search, Receipt as ReceiptIcon, Filter, Calendar, RefreshCw, Zap } from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isYesterday } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getReceipts({ 
          category: category || undefined, 
          search: search || undefined 
        })
        setReceipts(data)
      } catch (error) {
        console.error('Error loading receipts:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, search])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await getReceipts({ 
        category: category || undefined, 
        search: search || undefined 
      })
      setReceipts(data)
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  // Format date for grouping
  const formatDateForGroup = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      if (isToday(date)) return '오늘'
      if (isYesterday(date)) return '어제'
      return format(date, 'M월 d일 (E)', { locale: ko })
    } catch {
      return dateStr
    }
  }

  // Group by date
  const grouped: Record<string, Receipt[]> = {}
  receipts.forEach(receipt => {
    const formattedDate = formatDateForGroup(receipt.receipt_date)
    if (!grouped[formattedDate]) grouped[formattedDate] = []
    grouped[formattedDate].push(receipt)
  })

  return (
    <div className="space-y-4">
      {/* Header with pull to refresh hint */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold gradient-text">영수증</h1>
          <p className="text-sm text-gray-500">총 {receipts.length}개</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors group"
        >
          <RefreshCw className={`h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-all ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-20 z-30 glass-frosted rounded-2xl p-4 animate-fade-in animate-stagger-1">
        <div className={`
          relative transition-all duration-300 ease-out
          ${searchFocused ? 'transform scale-105' : ''}
        `}>
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors" />
          <input 
            ref={searchRef}
            type="text" 
            placeholder="가게 이름을 검색하세요..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              input-focus w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm placeholder-gray-400 transition-all
              ${searchFocused ? 'border-emerald-500 shadow-glow' : 'hover:border-gray-300'}
            `}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ReceiptIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Filter Chips */}
      <div className="animate-fade-in animate-stagger-2">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">카테고리</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button 
            onClick={() => setCategory('')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all hover-scale text-sm
              ${!category 
                ? 'gradient-primary text-white shadow-glow' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            <span className="text-base">📋</span>
            전체
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button 
              key={key} 
              onClick={() => setCategory(category === key ? '' : key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all hover-scale text-sm
                ${category === key 
                  ? cat.color + ' shadow-md ring-2 ring-offset-1' + (cat.color.includes('emerald') ? ' ring-emerald-300' : ' ring-gray-300')
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Receipt List */}
      {loading ? (
        <div className="space-y-4 animate-fade-in animate-stagger-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card rounded-2xl p-4 h-20 shimmer-overlay animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : receipts.length > 0 ? (
        <div className="space-y-6 animate-fade-in animate-stagger-3">
          {Object.entries(grouped).map(([date, items], groupIndex) => (
            <div key={date} className={`animate-fade-in animate-stagger-${groupIndex + 4}`}>
              {/* Sticky Date Header */}
              <div className="sticky top-36 z-20 glass-frosted rounded-xl px-4 py-2 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-emerald-700 text-sm">{date}</span>
                <span className="text-xs text-gray-500 ml-auto">{items.length}건</span>
              </div>
              
              {/* Receipt Cards with staggered animation */}
              <div className="space-y-3">
                {items.map((receipt, index) => (
                  <div 
                    key={receipt.id} 
                    className={`animate-fade-in animate-stagger-${index + 1}`}
                  >
                    <ReceiptCard receipt={receipt} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* End indicator */}
          <div className="text-center py-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              모든 영수증을 확인했어요
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl text-center py-20 animate-fade-in animate-stagger-3">
          <div className="mb-6">
            {category ? (
              <div className="mb-4">
                <div className="text-4xl mb-2">{CATEGORIES[category as keyof typeof CATEGORIES]?.icon || '📋'}</div>
                <p className="text-lg font-bold text-gray-400 mb-2">
                  {CATEGORIES[category as keyof typeof CATEGORIES]?.label || '해당'} 영수증이 없어요
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <ReceiptIcon className="h-16 w-16 text-gray-200 mx-auto mb-3 animate-pulse-soft" />
                <p className="text-lg font-bold text-gray-400 mb-2">아직 영수증이 없어요</p>
              </div>
            )}
            <p className="text-sm text-gray-400 mb-6">
              {search ? `'${search}' 검색 결과가 없습니다` : '영수증을 스캔해서 시작해보세요! 📸'}
            </p>
            {!search && (
              <Link 
                href="/scan"
                className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl shadow-glow hover-lift transition-all"
              >
                <ReceiptIcon className="h-4 w-4" />
                첫 영수증 스캔하기
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Pull to refresh hint at bottom */}
      <div className="text-center py-4 animate-fade-in">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <RefreshCw className="h-3 w-3" />
          아래로 당겨서 새로고침
        </p>
      </div>
    </div>
  )
}