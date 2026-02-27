'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart3, Settings, Scan } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { href: '/receipts', icon: Receipt, label: '영수증' },
  { href: '/scan', icon: Scan, label: '스캔', isCenter: true },
  { href: '/report', icon: BarChart3, label: '리포트' },
  { href: '/settings', icon: Settings, label: '설정' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-dvh bg-[#fafafa] pb-24">
      {/* Header — clean white */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3.5">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Receipt className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-[15px] text-gray-900 tracking-tight">영수증AI</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-5 animate-in">
        {children}
      </main>

      {/* Bottom Navigation — minimal */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto px-4 py-1.5">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map(({ href, icon: Icon, label, isCenter }) => {
              const active = pathname.startsWith(href)
              
              if (isCenter) {
                return (
                  <Link key={href} href={href} className="relative -mt-5 flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm transition-colors ${
                      active ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] mt-1 font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </Link>
                )
              }
              
              return (
                <Link key={href} href={href} className="flex flex-col items-center py-1.5 min-w-0 flex-1">
                  <Icon className={`h-[22px] w-[22px] transition-colors ${active ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className={`text-[10px] mt-1 font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
