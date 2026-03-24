'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCVE } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Encomenda recebida', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Em preparacao', color: 'bg-blue-100 text-blue-800' },
  shopping: { label: 'Encomenda expedida', color: 'bg-orange-100 text-orange-800' },
  delivering: { label: 'Motorista a caminho', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Encomenda entregue', color: 'bg-green-100 text-green-800' },
}

export default function OrderStatus({ order: initialOrder }: { order: Order }) {
  const [order, setOrder] = useState(initialOrder)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`order-${order.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${order.id}` },
        (payload) => setOrder((prev) => ({ ...prev, ...payload.new } as Order))
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [order.id])

  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const statusOrder = Object.keys(STATUS_CONFIG)
  const currentIdx = statusOrder.indexOf(order.status)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {statusOrder.map((key, idx) => {
          const isActive = idx <= currentIdx
          return (
            <div key={key} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isActive ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {idx + 1}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 text-center leading-tight">
                {STATUS_CONFIG[key].label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Items */}
      <div className="bg-[#F7F8F3] rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-[#1A1A1A]">Resumo da encomenda</h3>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="font-medium">{formatCVE(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-[#1A1A1A]">
          <span>Total</span>
          <span>{formatCVE(order.total)}</span>
        </div>
      </div>

      {order.notes && (
        <div className="bg-yellow-50 rounded-2xl p-4">
          <p className="text-sm text-yellow-800"><span className="font-semibold">Notas:</span> {order.notes}</p>
        </div>
      )}
    </div>
  )
}
