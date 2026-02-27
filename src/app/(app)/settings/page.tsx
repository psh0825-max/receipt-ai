'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut, Download, Trash2, Receipt, Moon, Bell, Mail, Shield, Info, ExternalLink, Heart } from 'lucide-react'

export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(true)
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
    toast.error('계정 삭제 기능은 준비 중입니다')
    setDeleting(false)
  }

  const initial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="space-y-5 animate-in">
      {/* Profile */}
      <div className="card-elevated p-6 text-center">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
          {initial}
        </div>
        <h3 className="font-bold text-gray-900">
          {user?.user_metadata?.full_name || '사용자'}
        </h3>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
          <Mail className="h-3.5 w-3.5" /> {user?.email || ''}
        </p>
      </div>

      {/* App Settings */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">앱 설정</h2>
        <div className="card overflow-hidden divide-y divide-gray-100">
          
          {/* Notifications */}
          <div className="p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
              <Bell className="h-4 w-4 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">푸시 알림</p>
              <p className="text-[11px] text-gray-400">월간 리포트 및 중요 알림</p>
            </div>
            <div className={`toggle ${notifications ? 'on' : 'off'}`}
              onClick={() => setNotifications(!notifications)} />
          </div>

          {/* Dark Mode */}
          <div className="p-4 flex items-center gap-3.5 opacity-50">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Moon className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">다크 모드</p>
              <p className="text-[11px] text-gray-400">준비 중</p>
            </div>
            <div className="toggle off" onClick={() => toast.info('다크 모드는 곧 추가됩니다')} />
          </div>

          {/* Export */}
          <button onClick={() => toast.success('곧 추가될 예정입니다')}
            className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Download className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">데이터 내보내기</p>
              <p className="text-[11px] text-gray-400">CSV/JSON으로 내보내기</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-gray-300" />
          </button>

          {/* Guide */}
          <a href="/guide" target="_blank"
            className="p-4 flex items-center gap-3.5 hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Info className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">사용 안내서</p>
              <p className="text-[11px] text-gray-400">앱 사용법 및 촬영 팁</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-gray-300" />
          </a>
        </div>
      </div>

      {/* Account */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">계정</h2>
        <div className="card overflow-hidden divide-y divide-gray-100">
          <button className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">개인정보 보호</p>
              <p className="text-[11px] text-gray-400">데이터 처리 및 보안</p>
            </div>
          </button>

          <button onClick={handleLogout}
            className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              <LogOut className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">로그아웃</p>
            </div>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center py-4">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2">
          <Receipt className="h-5 w-5 text-white" />
        </div>
        <p className="text-sm font-bold text-gray-900">영수증AI</p>
        <p className="text-[11px] text-gray-400 mt-1 flex items-center justify-center gap-1">
          v1.0.0 · <Heart className="h-2.5 w-2.5 text-red-400" /> LightOn+ Lab
        </p>
      </div>

      {/* Danger */}
      <div>
        <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 px-1">위험 구역</h2>
        <div className="card border-red-100 overflow-hidden">
          <button onClick={handleDelete} disabled={deleting}
            className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-red-50 transition-colors">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600">계정 삭제</p>
              <p className="text-[11px] text-red-400">{deleting ? '처리 중...' : '모든 데이터가 영구 삭제됩니다'}</p>
            </div>
          </button>
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
