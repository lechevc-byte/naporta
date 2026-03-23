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
          items: items.map((i) => ({
            product_id: i.product_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
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

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#1A2744] mb-6">O seu carrinho</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">O seu carrinho está vazio</p>
            <a
              href="/"
              className="inline-block bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#e55a25] transition-colors"
            >
              Ver produtos
            </a>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-3 mb-8">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#FF6B35] font-semibold">
                      {formatCVE(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-[#1A2744]">
                <span>Subtotal</span>
                <span>{formatCVE(totalPrice())}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Pagamento na entrega</p>
            </div>

            {/* Order form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-[#1A2744]">Dados de entrega</h2>

              <input
                required
                type="text"
                placeholder="O seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              />

              <input
                required
                type="tel"
                placeholder="Número de telefone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              />

              <input
                required
                type="text"
                placeholder="Morada de entrega"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              />

              <textarea
                placeholder="Notas (opcional) — ex: sem cebola, entregar ao vizinho..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm resize-none"
              />

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#FF6B35] hover:bg-[#e55a25] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-lg transition-colors"
              >
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
