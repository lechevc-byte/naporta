'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { useEffect, useState, useRef } from 'react'

export default function CartBadge() {
  const items = useCartStore((s) => s.items)
  const [mounted, setMounted] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const prevCount = useRef(0)

  useEffect(() => setMounted(true), [])

  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0

  useEffect(() => {
    if (count > prevCount.current && prevCount.current > 0) {
      setBouncing(true)
      const t = setTimeout(() => setBouncing(false), 300)
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  return (
    <Link href="/cart" className="relative p-2 group">
      <svg className="w-6 h-6 text-[#1A1A1A] group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count > 0 && (
        <span className={`absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 ${bouncing ? 'animate-cart-bounce' : ''}`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
