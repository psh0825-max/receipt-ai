import { NextResponse } from 'next/server'
import OpenAI from 'openai'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    if (!image) return NextResponse.json({ error: '이미지가 필요합니다' }, { status: 400 })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 영수증 분석 전문 AI입니다. 영수증 이미지에서 정보를 정확하게 추출하세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "store_name": "가게 이름",
  "receipt_date": "YYYY-MM-DD",
  "total_amount": 숫자(정수),
  "currency": "KRW",
  "items": [{"name": "항목명", "qty": 수량, "price": 가격}],
  "category": "food|transport|medical|shopping|living|culture|education|telecom|other",
  "payment_method": "card|cash|transfer|other",
  "tax_deductible": true/false,
  "confidence": 0.0~1.0
}

카테고리 기준:
- food: 음식점, 카페, 편의점, 마트 식품
- transport: 주유소, 택시, 대중교통, 주차
- medical: 병원, 약국, 건강검진
- shopping: 의류, 전자제품, 온라인쇼핑
- living: 관리비, 세탁, 인테리어
- culture: 영화, 공연, 도서, 여행
- education: 학원, 교재, 강의
- telecom: 통신비, 인터넷
- other: 기타

세금 공제 가능 항목: 의료비, 교육비, 대중교통, 도서/공연, 전통시장
날짜를 알 수 없으면 오늘 날짜를 사용하세요.`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: '이 영수증을 분석해주세요.' },
            { type: 'image_url', image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` } },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.1,
    })

    const text = response.choices[0]?.message?.content || ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'AI 분석 실패' }, { status: 500 })

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error('Receipt analysis error:', error)
    return NextResponse.json({ error: '분석 중 오류가 발생했습니다' }, { status: 500 })
  }
}
