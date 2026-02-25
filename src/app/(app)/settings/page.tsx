'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LogOut, Download, Trash2, Receipt, Moon, Bell } from 'lucide-react'

export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleDelete() {
    if (!confirm('정말 계정을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.')) return
    setDeleting(true)
    toast.error('계정 삭제 기능은 준비 중입니다')
    setDeleting(false)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold">설정</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 divide-y divide-gray-50">
        <div className="p-4 flex items-center gap-3">
          <Bell className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium">푸시 알림</p>
            <p className="text-xs text-gray-400">월간 리포트 알림</p>
          </div>
          <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <Moon className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium">다크 모드</p>
            <p className="text-xs text-gray-400">어두운 테마</p>
          </div>
          <div className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
          </div>
        </div>

        <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition">
          <Download className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium">데이터 내보내기</p>
            <p className="text-xs text-gray-400">모든 영수증을 JSON으로 내보내기</p>
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 text-center">
        <div className="inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 mb-3">
          <Receipt className="h-6 w-6 text-white" />
        </div>
        <p className="font-bold">영수증AI</p>
        <p className="text-xs text-gray-400">AI 경비 자동 관리</p>
        <p className="text-xs text-gray-300 mt-1">버전 1.0.0 · © 2026 LightOn+ Lab</p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button onClick={handleLogout}
          className="w-full p-4 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center gap-3 text-sm font-medium hover:bg-gray-50 transition">
          <LogOut className="h-5 w-5 text-gray-400" />
          로그아웃
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="w-full p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-100 transition">
          <Trash2 className="h-5 w-5" />
          {deleting ? '처리 중...' : '계정 삭제'}
        </button>
      </div>
    </div>
  )
}
