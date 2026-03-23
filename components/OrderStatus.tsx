'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: '✓' },
  shopping: { label: 'A fazer compras', color: 'bg-orange-100 text-orange-800', icon: '🛒' },
  delivering: { label: 'A caminho', color: 'bg-purple-100 text-purple-800', icon: '🚗' },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: '✓✓' },
}

export default function OrderStatus({ order: initialOrder }: { order: Order }) {
  const [order, setOrder] = useState(initialOrder)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new } as Order))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order.id])

  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${config.color}`}>
          <span>{config.icon}</span>
          {config.label}
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-between max-w-md mx-auto">
        {Object.entries(STATUS_CONFIG).map(([key, val], idx) => {
          const statusOrder = Object.keys(STATUS_CONFIG)
          const currentIdx = statusOrder.indexOf(order.status)
          const isActive = idx <= currentIdx

          return (
            <div key={key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 text-center leading-tight">
                {val.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Order details */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <h3 className="font-semibold text-[#1A2744]">Resumo da encomenda</h3>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">
                {(item.price * item.quantity).toLocaleString('pt-CV')} CVE
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-2 flex justify-between font-bold text-[#1A2744]">
          <span>Total</span>
          <span>{order.total.toLocaleString('pt-CV')} CVE</span>
        </div>
      </div>

      {order.notes && (
        <div className="bg-yellow-50 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Notas:</span> {order.notes}
          </p>
        </div>
      )}
    </div>
  )
}
