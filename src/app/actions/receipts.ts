'use server'
import { createClient } from '@/lib/supabase/server'

export interface ReceiptItem { name: string; qty: number; price: number }

export interface Receipt {
  id: string
  user_id: string
  store_name: string
  receipt_date: string
  total_amount: number
  currency: string
  category: string
  payment_method: string
  items: ReceiptItem[]
  tax_deductible: boolean
  image_url: string | null
  ai_metadata: Record<string, unknown>
  created_at: string
}

export async function createReceipt(data: Omit<Receipt, 'id' | 'user_id' | 'created_at'>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  const { data: receipt, error } = await supabase
    .from('receipts')
    .insert({ ...data, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return receipt
}

export async function getReceipts(opts?: { category?: string; month?: string; search?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase.from('receipts').select('*').eq('user_id', user.id).order('receipt_date', { ascending: false })

  if (opts?.category) query = query.eq('category', opts.category)
  if (opts?.search) query = query.ilike('store_name', `%${opts.search}%`)
  if (opts?.month) {
    const start = `${opts.month}-01`
    const [y, m] = opts.month.split('-').map(Number)
    const end = `${y}-${String(m + 1).padStart(2, '0')}-01`
    query = query.gte('receipt_date', start).lt('receipt_date', end)
  }

  const { data } = await query
  return (data || []) as Receipt[]
}

export async function getReceipt(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('receipts').select('*').eq('id', id).single()
  return data as Receipt | null
}

export async function updateReceipt(id: string, updates: Partial<Receipt>) {
  const supabase = await createClient()
  const { error } = await supabase.from('receipts').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteReceipt(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('receipts').delete().eq('id', id)
  if (error) throw error
}

export async function getMonthlyStats(month: string) {
  const receipts = await getReceipts({ month })
  const total = receipts.reduce((sum, r) => sum + r.total_amount, 0)
  const byCategory: Record<string, number> = {}
  receipts.forEach(r => {
    byCategory[r.category] = (byCategory[r.category] || 0) + r.total_amount
  })
  const byDay: Record<string, number> = {}
  receipts.forEach(r => {
    byDay[r.receipt_date] = (byDay[r.receipt_date] || 0) + r.total_amount
  })
  return { total, count: receipts.length, byCategory, byDay }
}
