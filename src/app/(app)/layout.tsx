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
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Frosted Glass Header */}
      <header className="sticky top-0 z-40 glass-frosted border-b border-white/30 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="rounded-2xl gradient-primary p-2 shadow-glow">
            <Receipt className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">영수증AI</h1>
            <p className="text-xs text-gray-500">스마트 경비 관리</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 animate-fade-in">
        {children}
      </main>

      {/* Enhanced Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 glass-frosted border-t border-white/30 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around relative">
            {NAV_ITEMS.map(({ href, icon: Icon, label, isCenter }) => {
              const active = pathname.startsWith(href)
              
              if (isCenter) {
                return (
                  <Link 
                    key={href} 
                    href={href} 
                    className="relative -mt-6 group"
                  >
                    <div className={`
                      flex flex-col items-center justify-center w-16 h-16 rounded-2xl shadow-lg transition-all
                      ${active 
                        ? 'gradient-primary shadow-emerald-500/30 text-white' 
                        : 'bg-white text-gray-400 hover:text-emerald-600 hover:bg-gray-50'
                      }
                    `}>
                      <Icon className={`h-6 w-6 transition-all ${active ? 'animate-pulse-soft' : 'group-hover:scale-110'}`} />
                    </div>
                    <span className={`
                      absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium transition-all whitespace-nowrap
                      ${active ? 'text-emerald-600' : 'text-gray-500'}
                    `}>
                      {label}
                    </span>
                  </Link>
                )
              }
              
              return (
                <Link 
                  key={href} 
                  href={href} 
                  className="relative flex flex-col items-center py-2 group min-w-0 flex-1"
                >
                  <div className={`
                    relative p-2 rounded-xl transition-all
                    ${active 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50'
                    }
                  `}>
                    <Icon className={`h-5 w-5 transition-all ${active ? '' : 'group-hover:scale-110'}`} />
                    
                    {/* Active indicator pill */}
                    {active && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-scale-in"></div>
                    )}
                  </div>
                  
                  <span className={`
                    text-xs transition-all mt-1
                    ${active ? 'text-emerald-700 font-semibold' : 'text-gray-500 group-hover:text-emerald-600'}
                  `}>
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