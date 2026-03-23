import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import OrderStatus from '@/components/OrderStatus'

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
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1A2744]">Encomenda confirmada!</h1>
          <p className="text-sm text-gray-500 mt-1">
            A nossa equipa vai fazer as suas compras em breve!
          </p>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <OrderStatus order={order} />

        <div className="mt-8 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-[#1A2744] mb-2">Entrega para</h3>
          <p className="text-sm text-gray-600">{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.customer_phone}</p>
          <p className="text-sm text-gray-600">{order.customer_address}</p>
        </div>

        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block text-[#FF6B35] font-semibold hover:underline"
          >
            Voltar ao catálogo
          </a>
        </div>
      </main>
    </>
  )
}
