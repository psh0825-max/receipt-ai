'use client'
import Link from 'next/link'
import { Camera, BarChart3, Shield, Sparkles, Receipt, ArrowRight, Users, TrendingUp, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [savings, setSavings] = useState(0)
  const [users, setUsers] = useState(0)

  // Animated counters
  useEffect(() => {
    const savingsTarget = 2400000
    const usersTarget = 10000
    
    const savingsIncrement = savingsTarget / 100
    const usersIncrement = usersTarget / 100
    
    let currentSavings = 0
    let currentUsers = 0
    
    const timer = setInterval(() => {
      if (currentSavings < savingsTarget) {
        currentSavings += savingsIncrement
        setSavings(Math.floor(currentSavings))
      }
      if (currentUsers < usersTarget) {
        currentUsers += usersIncrement
        setUsers(Math.floor(currentUsers))
      }
      
      if (currentSavings >= savingsTarget && currentUsers >= usersTarget) {
        clearInterval(timer)
        setSavings(savingsTarget)
        setUsers(usersTarget)
      }
    }, 50)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 animate-gradient relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-4 w-20 h-20 bg-white rounded-full animate-bounce-soft"></div>
        <div className="absolute top-32 right-8 w-12 h-12 bg-white rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-40 left-12 w-16 h-16 bg-white rounded-full animate-wiggle"></div>
        <div className="absolute bottom-20 right-4 w-8 h-8 bg-white rounded-full animate-bounce-soft animation-delay-1000"></div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8 text-white relative z-10">
        {/* Hero */}
        <div className="text-center pt-12 pb-8 animate-fade-in-up">
          {/* Floating receipt card mockup */}
          <div className="relative mb-8">
            <div className="inline-flex rounded-3xl bg-white/20 backdrop-blur-sm p-6 mb-4 glass animate-pulse-soft">
              <Receipt className="h-16 w-16" />
            </div>
            
            {/* Floating mini receipt card */}
            <div className="absolute -top-2 -right-4 bg-white rounded-xl p-3 shadow-2xl animate-bounce-soft text-gray-800 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="font-semibold">₩15,000</span>
              </div>
              <div className="text-gray-500">카페 ☕</div>
            </div>
            
            {/* Another floating mini card */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-xl p-3 shadow-2xl animate-pulse-soft text-gray-800 text-xs animate-stagger-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-semibold">₩3,500</span>
              </div>
              <div className="text-gray-500">지하철 🚇</div>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold mb-6 leading-tight gradient-text animate-fade-in">
            영수증AI
          </h1>
          <p className="text-xl text-emerald-100 leading-relaxed mb-8 animate-fade-in animate-stagger-1">
            사진 한 장이면 끝<br />
            <span className="font-semibold">AI가 알아서</span> 정리하고 분석해요
          </p>

          {/* Stats Counter */}
          <div className="bg-white/15 glass rounded-2xl p-4 mb-8 animate-fade-in animate-stagger-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300 mb-1">
                총 절약 금액
              </div>
              <div className="text-3xl font-extrabold">
                ₩{savings.toLocaleString('ko-KR')}+
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-3 bg-white text-emerald-700 font-bold px-10 py-5 rounded-2xl text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-50 transition-all hover-lift group animate-fade-in animate-stagger-3"
          >
            시작하기
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Social Proof */}
        <div className="text-center pb-8 animate-fade-in animate-stagger-4">
          <div className="bg-white/10 glass rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-5 w-5 text-emerald-300" />
                  <span className="text-2xl font-bold">{users.toLocaleString('ko-KR')}+</span>
                </div>
                <div className="text-sm text-emerald-200">사용자</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-5 w-5 text-teal-300" />
                  <span className="text-2xl font-bold">98%</span>
                </div>
                <div className="text-sm text-emerald-200">정확도</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <div className="text-sm text-emerald-200">평점</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 pb-8">
          {[
            { 
              icon: Camera, 
              title: '📸 찍기만 하세요', 
              desc: '영수증 사진을 찍으면 AI가 가게명, 금액, 항목을 자동 인식합니다',
              color: 'bg-orange-500'
            },
            { 
              icon: BarChart3, 
              title: '📊 지출을 한눈에', 
              desc: '카테고리별 지출 분석, 월별 리포트를 자동으로 만들어줍니다',
              color: 'bg-blue-500'
            },
            { 
              icon: Sparkles, 
              title: '🏷️ 자동 분류', 
              desc: '식비, 교통, 의료, 쇼핑 등 9개 카테고리로 자동 분류합니다',
              color: 'bg-purple-500'
            },
            { 
              icon: Shield, 
              title: '💰 세금 공제', 
              desc: '공제 가능한 항목을 자동 표시해 연말정산을 도와줍니다',
              color: 'bg-green-500'
            },
          ].map(({ icon: Icon, title, desc, color }, index) => (
            <div key={title} className={`glass rounded-2xl p-6 border border-white/20 hover-lift animate-fade-in`} style={{ animationDelay: `${0.1 * (index + 5)}s` }}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{title}</h3>
                  <p className="text-emerald-100 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-emerald-200 pb-8 animate-fade-in animate-stagger-5">
          <div className="text-xs opacity-80 mb-2">
            "가계부 작성이 이렇게 쉬울 줄 몰랐어요!" - 김○○님
          </div>
          <p className="text-sm">© 2026 LightOn+ Lab</p>
        </div>
      </div>
    </div>
  )
}