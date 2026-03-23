'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types'
import { formatCVE } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shopping', 'delivering', 'delivered'] as const
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shopping: 'A comprar',
  delivering: 'A entregar',
  delivered: 'Entregue',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shopping: 'bg-orange-100 text-orange-800',
  delivering: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  )
}

function AdminContent() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    loadOrders(supabase)

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders(supabase)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadOrders(supabase?: ReturnType<typeof createClient>) {
    const sb = supabase || createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data } = await sb
      .from('orders')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    if (selected?.id === orderId) {
      setSelected((prev) => prev ? { ...prev, status: status as Order['status'] } : null)
    }
    loadOrders(supabase)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A2744] text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold">
            <span className="text-[#FF6B35]">NaPorta</span> Admin
          </h1>
          <div className="flex items-center gap-4">
            <a href="/admin/products" className="text-sm text-gray-300 hover:text-white">
              Produtos
            </a>
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
                router.push('/admin/login')
              }}
              className="text-sm text-gray-500 hover:text-gray-300"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-[#1A2744] mb-4">
          Encomendas de hoje ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Nenhuma encomenda hoje</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Orders list */}
            <div className="space-y-3">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className={`w-full text-left bg-white rounded-xl p-4 shadow-sm border-2 transition-colors ${
                    selected?.id === order.id ? 'border-[#FF6B35]' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{order.customer_name}</p>
                  <p className="text-xs text-gray-500">{order.customer_phone}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {order.items.length} item(s)
                    </span>
                    <span className="font-bold text-sm text-[#1A2744]">
                      {formatCVE(order.total)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Order detail */}
            {selected && (
              <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-20">
                <h3 className="font-bold text-[#1A2744] mb-4">
                  Detalhes #{selected.id.slice(0, 8).toUpperCase()}
                </h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-xs text-gray-400">Cliente</span>
                    <p className="text-sm font-medium">{selected.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Telefone</span>
                    <p className="text-sm">{selected.customer_phone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Morada</span>
                    <p className="text-sm">{selected.customer_address}</p>
                  </div>
                  {selected.notes && (
                    <div>
                      <span className="text-xs text-gray-400">Notas</span>
                      <p className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded-lg">
                        {selected.notes}
                      </p>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-semibold mb-2">Produtos</h4>
                <ul className="space-y-2 mb-4">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">{formatCVE(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-2 flex justify-between font-bold text-[#1A2744]">
                  <span>Total</span>
                  <span>{formatCVE(selected.total)}</span>
                </div>

                {/* Status buttons */}
                <div className="mt-6">
                  <p className="text-xs text-gray-400 mb-2">Alterar estado</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={selected.status === s}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                          selected.status === s
                            ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-gray-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
