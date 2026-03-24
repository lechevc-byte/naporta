'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/store/cart'
import { createClient } from '@/lib/supabase/client'
import { formatCVE } from '@/lib/utils'

const PRAIA_ZONES = [
  'Achada Santo Antonio', 'Palmarejo', 'Plateau', 'Fazenda', 'Terra Branca',
  'Prainha', 'Achada Grande', 'Tira Chapeu', 'Varzea', 'Calabaceira',
  'Achada Sao Filipe', 'Cidadela', 'Gamboa', 'Chã de Areia', 'Quebra Canela',
]

const MIN_ORDER = 500
const FREE_DELIVERY_ABOVE = 2000
const DELIVERY_FEE = 200

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore()
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [deliverySlot, setDeliverySlot] = useState('manha')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showZones, setShowZones] = useState(false)

  const subtotal = totalPrice()
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = subtotal + deliveryFee
  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0 || belowMinimum) return
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
          total,
          delivery_slot: deliverySlot,
          delivery_fee: deliveryFee,
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm transition-all"

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">O seu carrinho</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">O seu carrinho esta vazio</p>
            <p className="text-sm text-gray-400 mb-6">Adicione produtos do catalogo</p>
            <a href="/" className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700 transition-colors">Ver produtos</a>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-2 mb-6">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center p-1">
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" /> : <div className="w-full h-full bg-gray-100 rounded-lg" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-gray-900">{formatCVE(item.price)}</p>
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

            {/* Minimum order warning */}
            {belowMinimum && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <p className="text-sm text-orange-800">Encomenda minima: <strong>{formatCVE(MIN_ORDER)}</strong>. Faltam {formatCVE(MIN_ORDER - subtotal)}.</p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatCVE(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxa de entrega</span>
                {deliveryFee === 0 ? (
                  <span className="font-medium text-green-600">Gratis</span>
                ) : (
                  <span className="font-medium text-gray-900">{formatCVE(deliveryFee)}</span>
                )}
              </div>
              {subtotal > 0 && subtotal < FREE_DELIVERY_ABOVE && (
                <p className="text-xs text-gray-400">Entrega gratuita a partir de {formatCVE(FREE_DELIVERY_ABOVE)}</p>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-gray-900">{formatCVE(total)}</span>
              </div>
            </div>

            {/* Delivery slot */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Horario de entrega</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeliverySlot('manha')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${deliverySlot === 'manha' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="text-sm font-semibold text-gray-900">Manha</p>
                  <p className="text-xs text-gray-500">8h - 13h</p>
                </button>
                <button onClick={() => setDeliverySlot('tarde')}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${deliverySlot === 'tarde' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <p className="text-sm font-semibold text-gray-900">Tarde</p>
                  <p className="text-xs text-gray-500">13h - 20h</p>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Estimativa de entrega: ~45 minutos
              </p>
            </div>

            {/* Order form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Dados de entrega</h3>
              <input required type="text" placeholder="O seu nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input required type="tel" placeholder="Numero de telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              {/* Address with neighborhood suggestions */}
              <div className="relative">
                <input required type="text" placeholder="Morada de entrega (ex: Palmarejo, Rua 1)" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  onFocus={() => setShowZones(true)}
                  className={inputClass} />
                {showZones && !form.address && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                    {PRAIA_ZONES.map((z) => (
                      <button key={z} type="button"
                        onClick={() => { setForm({ ...form, address: z + ', ' }); setShowZones(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                        {z}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <textarea placeholder="Notas (opcional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className={`${inputClass} resize-none`} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" disabled={submitting || belowMinimum}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full text-base transition-colors shadow-lg shadow-green-600/20">
                {submitting ? 'A enviar...' : `Confirmar Encomenda — ${formatCVE(total)}`}
              </button>
            </form>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
