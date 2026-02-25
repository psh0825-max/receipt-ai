import { Camera, BarChart3, Shield, Sparkles, Receipt, ArrowLeft, CheckCircle2, Smartphone, Upload, Tag, FileText } from 'lucide-react'
import Link from 'next/link'

export default function GuidePage() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 rounded-xl hover:bg-gray-100 transition">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">사용 안내서</h1>
            <p className="text-xs text-gray-400">영수증AI 완벽 가이드</p>
          </div>
        </div>

        {/* Getting Started */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            시작하기
          </h2>
          <div className="space-y-3">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">회원가입 / 로그인</p>
                  <p className="text-xs text-gray-500 mt-1">이메일 또는 Google 계정으로 간편하게 시작하세요.</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">영수증 촬영</p>
                  <p className="text-xs text-gray-500 mt-1">하단의 스캔 버튼을 눌러 영수증을 촬영하거나 갤러리에서 선택하세요.</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">AI 자동 분석</p>
                  <p className="text-xs text-gray-500 mt-1">AI가 가게명, 금액, 항목, 카테고리를 자동으로 인식합니다.</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">확인 후 저장</p>
                  <p className="text-xs text-gray-500 mt-1">분석 결과를 확인하고, 필요하면 카테고리를 변경한 뒤 저장하세요.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            주요 기능
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg shrink-0">
                  <Camera className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">📸 영수증 스캔</h3>
                  <p className="text-xs text-gray-500 mt-1">카메라로 촬영하거나 갤러리에서 선택하세요. GPT-4o Vision이 영수증의 모든 정보를 자동으로 인식합니다.</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                  <Tag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">🏷️ 자동 카테고리 분류</h3>
                  <p className="text-xs text-gray-500 mt-1">9개 카테고리로 자동 분류됩니다:</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['🍔 식비', '🚗 교통', '🏥 의료', '🛍️ 쇼핑', '🏠 생활', '🎭 문화', '📚 교육', '📱 통신', '📋 기타'].map(cat => (
                      <span key={cat} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-50 p-2 rounded-lg shrink-0">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">📊 지출 리포트</h3>
                  <p className="text-xs text-gray-500 mt-1">월별 총 지출, 카테고리별 비중, 일별 지출 추이를 한눈에 확인하세요. 전월 대비 증감도 자동으로 계산됩니다.</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg shrink-0">
                  <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">💰 세금 공제 표시</h3>
                  <p className="text-xs text-gray-500 mt-1">의료비, 교육비, 대중교통, 도서/공연비, 전통시장 사용분 등 세금 공제 가능 항목을 자동으로 표시합니다.</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-pink-50 p-2 rounded-lg shrink-0">
                  <FileText className="h-5 w-5 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">🗂️ 영수증 관리</h3>
                  <p className="text-xs text-gray-500 mt-1">저장된 영수증을 카테고리별로 필터링하고, 가게명으로 검색할 수 있습니다. 날짜별로 자동 정렬됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            촬영 팁
          </h2>
          <div className="bg-gray-50 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">영수증 전체가 화면에 들어오게 촬영하세요</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">밝은 곳에서 그림자 없이 촬영하면 인식률이 높아요</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">구겨지지 않게 펴서 촬영하세요</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">카테고리가 맞지 않으면 저장 전에 변경할 수 있어요</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">✗</span>
              <p className="text-sm text-gray-700">너무 흐리거나 잘린 영수증은 인식이 어려워요</p>
            </div>
          </div>
        </section>

        {/* PWA Install */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-emerald-600" />
            앱처럼 사용하기
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-2">📱 Android (Chrome)</h3>
              <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
                <li>Chrome에서 receipt.lightonpluslab.com 접속</li>
                <li>우측 상단 ⋮ 메뉴 → &quot;홈 화면에 추가&quot;</li>
                <li>홈 화면에 추가된 아이콘으로 실행</li>
              </ol>
            </div>
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-2">🍎 iPhone (Safari)</h3>
              <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside">
                <li>Safari에서 receipt.lightonpluslab.com 접속</li>
                <li>하단 공유 버튼 (□↑) 탭</li>
                <li>&quot;홈 화면에 추가&quot; 선택</li>
                <li>홈 화면에 추가된 아이콘으로 실행</li>
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">❓ 자주 묻는 질문</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-1">영수증 인식이 안 돼요</h3>
              <p className="text-xs text-gray-500">밝은 환경에서 영수증 전체가 보이도록 다시 촬영해보세요. 열감지 영수증은 시간이 지나면 글씨가 희미해질 수 있어요.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-1">카테고리가 잘못 분류됐어요</h3>
              <p className="text-xs text-gray-500">저장 전 카테고리 변경 버튼으로 수정할 수 있어요. AI는 98%의 정확도를 보이지만, 가끔 틀릴 수 있습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-1">데이터는 안전한가요?</h3>
              <p className="text-xs text-gray-500">모든 데이터는 Supabase 보안 서버에 암호화되어 저장됩니다. 본인만 접근할 수 있으며, 다른 사용자에게 공유되지 않습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-1">무료인가요?</h3>
              <p className="text-xs text-gray-500">네, 현재 모든 기능을 무료로 이용할 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-gray-300 pb-8">
          <p>© 2026 LightOn+ Lab</p>
          <p className="mt-1">문의: psh0825@gmail.com</p>
        </div>
      </div>
    </div>
  )
}
