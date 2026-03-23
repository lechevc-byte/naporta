'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { useEffect, useState } from 'react'

export default function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const count = mounted ? totalItems() : 0

  return (
    <Link href="/cart" className="relative p-2">
      <svg className="w-6 h-6 text-[#1A2744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B35] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
