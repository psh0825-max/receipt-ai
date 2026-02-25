export const CATEGORIES = {
  food: { label: '식비', icon: '🍽️', color: 'bg-orange-100 text-orange-700', chartColor: '#f97316' },
  transport: { label: '교통', icon: '🚗', color: 'bg-blue-100 text-blue-700', chartColor: '#3b82f6' },
  medical: { label: '의료', icon: '🏥', color: 'bg-red-100 text-red-700', chartColor: '#ef4444' },
  shopping: { label: '쇼핑', icon: '🛍️', color: 'bg-pink-100 text-pink-700', chartColor: '#ec4899' },
  living: { label: '생활', icon: '🏠', color: 'bg-green-100 text-green-700', chartColor: '#22c55e' },
  culture: { label: '문화', icon: '🎭', color: 'bg-purple-100 text-purple-700', chartColor: '#a855f7' },
  education: { label: '교육', icon: '📚', color: 'bg-yellow-100 text-yellow-700', chartColor: '#eab308' },
  telecom: { label: '통신', icon: '📱', color: 'bg-cyan-100 text-cyan-700', chartColor: '#06b6d4' },
  other: { label: '기타', icon: '📋', color: 'bg-gray-100 text-gray-700', chartColor: '#6b7280' },
} as const

export type CategoryKey = keyof typeof CATEGORIES

export function getCategoryInfo(key: string) {
  return CATEGORIES[key as CategoryKey] || CATEGORIES.other
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount)
}
