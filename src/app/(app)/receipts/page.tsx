'use client'
import { useState, useEffect } from 'react'
import { getReceipts, type Receipt } from '@/app/actions/receipts'
import { ReceiptCard } from '@/components/receipt-card'
import { CATEGORIES } from '@/lib/categories'
import { Search, Receipt as ReceiptIcon } from 'lucide-react'
import Link from 'next/link'

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getReceipts({ category: category || undefined, search: search || undefined })
      setReceipts(data)
      setLoading(false)
    }
    load()
  }, [category, search])

  // Group by date
  const grouped: Record<string, Receipt[]> = {}
  receipts.forEach(r => {
    const d = r.receipt_date
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(r)
  })

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold">영수증</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="가게 이름 검색" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        <button onClick={() => setCategory('')}
          className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition ${!category ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
          전체
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button key={key} onClick={() => setCategory(key)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition ${category === key ? cat.color : 'bg-gray-100 text-gray-500'}`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      ) : receipts.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs text-gray-400 font-medium mb-2 ml-1">{date}</p>
              <div className="space-y-2">
                {items.map(r => <ReceiptCard key={r.id} receipt={r} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <ReceiptIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">영수증이 없어요</p>
        </div>
      )}

      <Link href="/scan"
        className="fixed bottom-24 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-4 shadow-xl shadow-emerald-500/30 z-40">
        <Search className="h-6 w-6" />
      </Link>
    </div>
  )
}
