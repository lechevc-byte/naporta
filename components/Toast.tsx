'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'

export default function Toast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const items = useCartStore((s) => s.items)

  useEffect(() => {
    if (items.length === 0) return

    const lastItem = items[items.length - 1]
    setMessage(`${lastItem.name} adicionado`)
    setVisible(true)

    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [items.length])

  if (!visible) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A2744] text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-medium animate-toast">
      {message}
    </div>
  )
}
