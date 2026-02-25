'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Receipt, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('가입 완료! 이메일을 확인해주세요.')
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error((err as Error).message || '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex flex-col items-center justify-center px-6 relative overflow-hidden animate-gradient">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-8 w-32 h-32 gradient-primary rounded-full animate-pulse-soft"></div>
        <div className="absolute top-40 right-12 w-20 h-20 gradient-teal rounded-full animate-bounce-soft"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 gradient-emerald rounded-full animate-wiggle"></div>
        <div className="absolute bottom-20 right-8 w-16 h-16 gradient-primary rounded-full animate-pulse-soft"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 animate-fade-in-up">
        {/* Floating card container */}
        <div className="glass-card rounded-3xl p-8 shadow-glass hover-lift">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex rounded-2xl gradient-primary p-4 mb-4 shadow-glow animate-pulse-soft">
              <Receipt className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">영수증AI</h1>
            <p className="text-sm text-gray-600">AI 경비 자동 관리</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-8 relative">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-1/2 bg-white rounded-xl shadow-sm transition-all duration-300 ${
                isLogin ? 'left-1.5' : 'left-1/2 -ml-1.5'
              }`}
            />
            <button 
              onClick={() => setIsLogin(true)} 
              className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLogin ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              로그인
            </button>
            <button 
              onClick={() => setIsLogin(false)} 
              className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isLogin ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 transition-colors" />
              <input 
                type="email" 
                placeholder="이메일을 입력하세요" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="input-focus w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-sm placeholder-gray-400 hover:border-gray-300 transition-all"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 transition-colors" />
              <input 
                type={showPw ? 'text' : 'password'} 
                placeholder="비밀번호를 입력하세요" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="input-focus w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 bg-white text-sm placeholder-gray-400 hover:border-gray-300 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPw(!showPw)} 
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover-lift active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  처리 중...
                </div>
              ) : (
                isLogin ? '로그인' : '회원가입'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">또는</span>
            </div>
          </div>

          <button 
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold hover:border-gray-300 hover:bg-gray-50 transition-all hover-lift active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google로 계속하기
          </button>

          {/* Bottom hint */}
          <div className="text-center mt-6 text-xs text-gray-500">
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'} 
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}