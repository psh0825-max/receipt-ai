import Link from 'next/link'
import { Camera, BarChart3, Shield, Sparkles, Receipt, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700">
      <div className="max-w-md mx-auto px-6 py-12 text-white">
        {/* Hero */}
        <div className="text-center pt-12 pb-16">
          <div className="inline-flex rounded-2xl bg-white/20 backdrop-blur-sm p-4 mb-6">
            <Receipt className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            영수증AI
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed mb-8">
            사진 한 장이면 끝<br />
            AI가 알아서 정리하고 분석해요
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-50 transition"
          >
            시작하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="space-y-4 pb-16">
          {[
            { icon: Camera, title: '📸 찍기만 하세요', desc: '영수증 사진을 찍으면 AI가 가게명, 금액, 항목을 자동 인식합니다' },
            { icon: BarChart3, title: '📊 지출을 한눈에', desc: '카테고리별 지출 분석, 월별 리포트를 자동으로 만들어줍니다' },
            { icon: Sparkles, title: '🏷️ 자동 분류', desc: '식비, 교통, 의료, 쇼핑 등 9개 카테고리로 자동 분류합니다' },
            { icon: Shield, title: '💰 세금 공제', desc: '공제 가능한 항목을 자동 표시해 연말정산을 도와줍니다' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <h3 className="font-bold text-base mb-1">{title}</h3>
              <p className="text-sm text-emerald-100">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-emerald-200 pb-8">
          <p>© 2026 LightOn+ Lab</p>
        </div>
      </div>
    </div>
  )
}
