'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart3, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { href: '/receipts', icon: Receipt, label: '영수증' },
  { href: '/report', icon: BarChart3, label: '리포트' },
  { href: '/settings', icon: Settings, label: '설정' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5">
            <Receipt className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base">영수증AI</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-4">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto flex">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2 text-xs transition ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                <Icon className={`h-5 w-5 mb-0.5 ${active ? 'text-emerald-600' : ''}`} />
                <span className={active ? 'font-semibold' : ''}>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
