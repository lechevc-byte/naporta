'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart'
import { useEffect, useState, useRef } from 'react'

export default function Header() {
  const totalItems = useCartStore((s) => s.totalItems)
  const [mounted, setMounted] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const prev = useRef(0)

  useEffect(() => setMounted(true), [])
  const count = mounted ? totalItems() : 0

  useEffect(() => {
    if (count > prev.current && prev.current > 0) {
      setBouncing(true)
      const t = setTimeout(() => setBouncing(false), 300)
      return () => clearTimeout(t)
    }
    prev.current = count
  }, [count])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-extrabold text-green-600 tracking-tight leading-none">
            NaPorta
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Praia, Cabo Verde
          </span>
        </Link>

        <Link href="/cart" className="relative p-2 -mr-2">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {count > 0 && (
            <span
              className={`absolute -top-0.5 -right-0.5 bg-green-600 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 ${
                bouncing ? 'animate-cart-bounce' : ''
              }`}
            >
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
