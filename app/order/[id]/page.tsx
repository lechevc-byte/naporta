import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import OrderStatus from '@/components/OrderStatus'
import WhatsAppShare from '@/components/WhatsAppShare'
import { formatCVE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!order) notFound()

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Encomenda confirmada!</h1>
          <p className="text-sm text-gray-500 mt-1">A nossa equipa vai fazer as suas compras em breve!</p>
          <p className="text-xs text-gray-400 mt-2 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
          {order.delivery_slot && (
            <p className="text-sm text-green-600 font-medium mt-2">
              Entrega: {order.delivery_slot === 'manha' ? 'Manha (8h-13h)' : 'Tarde (13h-20h)'} — ~45 min
            </p>
          )}
        </div>

        <OrderStatus order={order} />

        <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Entrega para</h3>
          <p className="text-sm text-gray-600">{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.customer_phone}</p>
          <p className="text-sm text-gray-600">{order.customer_address}</p>
        </div>

        {order.delivery_fee > 0 && (
          <div className="mt-3 bg-white rounded-2xl p-4 border border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Taxa de entrega</span>
            <span className="font-medium">{formatCVE(order.delivery_fee)}</span>
          </div>
        )}

        {/* WhatsApp share */}
        <WhatsAppShare order={order} />

        <div className="text-center mt-6">
          <a href="/" className="inline-block text-green-600 font-semibold hover:underline">Voltar ao catalogo</a>
        </div>
      </main>
    </>
  )
}
