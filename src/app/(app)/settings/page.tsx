'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut, Download, Trash2, Receipt, Moon, Bell, User, Mail, Shield, Info, ExternalLink, Heart } from 'lucide-react'

export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await createClient().auth.signOut()
    router.push('/')
  }

  async function handleDelete() {
    if (!confirm('정말 계정을 삭제하시겠습니까?\n모든 데이터가 영구적으로 삭제됩니다.')) return
    setDeleting(true)
    // TODO: Implement actual account deletion
    toast.error('계정 삭제 기능은 준비 중입니다')
    setDeleting(false)
  }

  const handleExport = () => {
    toast.success('데이터 내보내기 기능은 곧 추가될 예정입니다')
  }

  // Get user initials for avatar
  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-2xl font-bold gradient-text">설정</h1>
        <p className="text-sm text-gray-600">계정 및 앱 설정</p>
      </div>

      {/* User Profile Section */}
      <div className="glass-card rounded-3xl p-6 text-center animate-fade-in animate-stagger-1">
        <div className="relative inline-flex mb-4">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getUserInitial()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {user?.user_metadata?.full_name || '사용자'}
          </h3>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            {user?.email || 'user@example.com'}
          </div>
        </div>
        
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <div className="text-center">
            <div className="font-semibold text-emerald-600">Premium</div>
            <div>플랜</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">2주</div>
            <div>사용 기간</div>
          </div>
        </div>
      </div>

      {/* App Settings Group */}
      <div className="animate-fade-in animate-stagger-2">
        <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">앱 설정</h2>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-100">
          
          {/* Notifications Toggle */}
          <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">푸시 알림</p>
              <p className="text-xs text-gray-500">월간 리포트 및 중요 알림</p>
            </div>
            <div 
              className={`
                relative w-12 h-7 rounded-full cursor-pointer transition-colors
                ${notifications ? 'bg-emerald-500' : 'bg-gray-300'}
              `}
              onClick={() => setNotifications(!notifications)}
            >
              <div className={`
                absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform
                ${notifications ? 'left-6' : 'left-1'}
              `} />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Moon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">다크 모드</p>
              <p className="text-xs text-gray-500">어두운 테마 (준비 중)</p>
            </div>
            <div 
              className={`
                relative w-12 h-7 rounded-full cursor-pointer transition-colors opacity-50
                ${darkMode ? 'bg-emerald-500' : 'bg-gray-300'}
              `}
              onClick={() => toast.info('다크 모드는 곧 추가될 예정입니다')}
            >
              <div className={`
                absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform
                ${darkMode ? 'left-6' : 'left-1'}
              `} />
            </div>
          </div>

          {/* Export Data */}
          <button 
            onClick={handleExport}
            className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">데이터 내보내기</p>
              <p className="text-xs text-gray-500">모든 영수증을 CSV/JSON으로 내보내기</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Account Group */}
      <div className="animate-fade-in animate-stagger-3">
        <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">계정</h2>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-100">
          
          {/* Privacy */}
          <button className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">개인정보 보호</p>
              <p className="text-xs text-gray-500">데이터 처리 및 보안 설정</p>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </button>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <LogOut className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">로그아웃</p>
              <p className="text-xs text-gray-500">현재 계정에서 로그아웃</p>
            </div>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="glass-card rounded-3xl p-6 text-center animate-fade-in animate-stagger-4">
        <div className="inline-flex rounded-2xl gradient-primary p-3 mb-4 shadow-glow">
          <Receipt className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-bold text-lg gradient-text mb-2">영수증AI</h3>
        <p className="text-sm text-gray-600 mb-4">AI 경비 자동 관리</p>
        
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>버전 1.0.0</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-400" />
            <span>Made by LightOn+ Lab</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-400">© 2026 LightOn+ Lab. All rights reserved.</p>
      </div>

      {/* Danger Zone */}
      <div className="animate-fade-in animate-stagger-5">
        <h2 className="text-sm font-bold text-red-600 mb-3 px-1">위험 구역</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-1">
          <button 
            onClick={handleDelete} 
            disabled={deleting}
            className="w-full p-4 flex items-center gap-4 text-left hover:bg-red-100 transition-colors rounded-xl"
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-700">계정 삭제</p>
              <p className="text-xs text-red-500">
                {deleting ? '처리 중...' : '모든 데이터가 영구적으로 삭제됩니다'}
              </p>
            </div>
            {deleting && (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom padding for safe area */}
      <div className="h-6" />
    </div>
  )
}