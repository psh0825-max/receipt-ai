'use client'
import Link from 'next/link'
import { Camera, BarChart3, Shield, Sparkles, Receipt, ArrowRight, Users, TrendingUp, Star, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    const target = 2400000
    const inc = target / 80
    let current = 0
    const timer = setInterval(() => {
      current += inc
      if (current >= target) { setSavings(target); clearInterval(timer) }
      else setSavings(Math.floor(current))
    }, 30)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-dvh bg-white">
      {/* Hero */}
      <div className="max-w-md mx-auto px-6 pt-16 pb-12">
        <div className="text-center animate-fade-in">
          <div className="inline-flex rounded-2xl bg-emerald-50 p-4 mb-6">
            <Receipt className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            영수증AI
          </h1>
          <p className="text-base text-gray-500 leading-relaxed mb-2">
            사진 한 장이면 끝
          </p>
          <p className="text-sm text-gray-400 mb-8">
            AI가 알아서 정리하고 분석해요
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all group"
          >
            시작하기
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <div className="text-center py-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-lg font-bold text-gray-900">10K+</span>
            </div>
            <div className="text-[11px] text-gray-400">사용자</div>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-lg font-bold text-gray-900">98%</span>
            </div>
            <div className="text-[11px] text-gray-400">정확도</div>
          </div>
          <div className="text-center py-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-lg font-bold text-gray-900">4.9</span>
            </div>
            <div className="text-[11px] text-gray-400">평점</div>
          </div>
        </div>

        {/* Savings banner */}
        <div className="mt-6 bg-emerald-50 rounded-xl p-4 text-center animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <p className="text-xs text-emerald-600 font-medium mb-1">사용자 총 절약 금액</p>
          <p className="text-2xl font-extrabold text-emerald-700">₩{savings.toLocaleString('ko-KR')}+</p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-6 space-y-3">
          {[
            { icon: Camera, title: '찍기만 하세요', desc: '영수증 사진을 찍으면 AI가 가게명, 금액, 항목을 자동 인식', emoji: '📸', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
            { icon: BarChart3, title: '지출을 한눈에', desc: '카테고리별 지출 분석, 월별 리포트 자동 생성', emoji: '📊', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-500' },
            { icon: Sparkles, title: '자동 분류', desc: '식비, 교통, 의료 등 9개 카테고리 자동 분류', emoji: '🏷️', bg: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
            { icon: Shield, title: '세금 공제', desc: '공제 가능 항목 자동 표시, 연말정산 도우미', emoji: '💰', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500' },
          ].map(({ icon: Icon, title, desc, bg, iconBg, iconColor }, i) => (
            <div key={title} className={`${bg} rounded-xl p-4 flex items-start gap-4 animate-fade-in`} style={{ animationDelay: `${0.1 * (i + 3)}s` }}>
              <div className={`${iconBg} rounded-lg p-2.5 shrink-0`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-md mx-auto px-6 py-12">
        <h2 className="text-lg font-bold text-gray-900 text-center mb-6">이렇게 사용해요</h2>
        <div className="space-y-4">
          {[
            { step: '1', text: '영수증 사진을 찍어요', sub: '카메라 또는 갤러리' },
            { step: '2', text: 'AI가 자동으로 분석해요', sub: '가게명, 금액, 항목 인식' },
            { step: '3', text: '지출 리포트를 확인해요', sub: '카테고리별 분석 자동 생성' },
          ].map(({ step, text, sub }) => (
            <div key={step} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {step}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{text}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-md mx-auto px-6 pb-12">
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-2">지금 바로 시작하세요</p>
          <p className="text-gray-400 text-xs mb-5">무료로 영수증을 관리해보세요</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-600 transition"
          >
            무료 시작 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-300 pb-8">
        © 2026 LightOn+ Lab
      </div>
    </div>
  )
}
