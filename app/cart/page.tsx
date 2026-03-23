'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/store/cart'
import { createClient } from '@/lib/supabase/client'
import { formatCVE } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore()
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          notes: form.notes || null,
          items: items.map((i) => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity })),
          total: totalPrice(),
          status: 'pending',
        })
        .select('id')
        .single()
      if (insertError) throw insertError
      clearCart()
      router.push(`/order/${data.id}`)
    } catch {
      setError('Erro ao enviar encomenda. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm transition-all"

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6">O seu carrinho</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">O seu carrinho esta vazio</p>
            <p className="text-sm text-gray-400 mb-6">Adicione produtos do catalogo</p>
            <a href="/" className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-full hover:bg-[#18a34a] transition-colors">
              Ver produtos
            </a>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-8">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-[#F9FAFB] flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-[#1A1A1A]">{formatCVE(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-medium">-</button>
                    <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-medium">+</button>
                  </div>
                  <button onClick={() => removeItem(item.product_id)} className="text-gray-300 hover:text-red-400 p-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="text-xl font-bold text-[#1A1A1A]">{formatCVE(totalPrice())}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Pagamento na entrega</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">Dados de entrega</h2>
              <input required type="text" placeholder="O seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input required type="tel" placeholder="Numero de telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              <input required type="text" placeholder="Morada de entrega" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
              <textarea placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full bg-brand hover:bg-[#18a34a] disabled:bg-gray-300 text-white font-bold py-4 rounded-full text-base transition-colors shadow-lg shadow-brand/20">
                {submitting ? 'A enviar...' : 'Confirmar Encomenda'}
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
