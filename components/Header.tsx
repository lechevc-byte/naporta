'use client'

import { useState } from 'react'
import CartBadge from './CartBadge'

export default function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const [mobileSearch, setMobileSearch] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <span className="text-[22px] font-bold text-brand tracking-tight">NaPorta</span>
          <span className="hidden sm:block text-[10px] text-gray-400 -mt-1 leading-none">Praia, Cabo Verde</span>
        </a>

        {/* Desktop search */}
        {onSearch && (
          <div className="hidden sm:flex flex-1 max-w-md mx-auto relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Procurar produtos..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:bg-white focus:border-brand border border-transparent transition-all"
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          {onSearch && (
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className="sm:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          <CartBadge />
        </div>
      </div>

      {/* Mobile search bar */}
      {onSearch && mobileSearch && (
        <div className="sm:hidden px-4 pb-3">
          <input
            autoFocus
            type="text"
            placeholder="Procurar produtos..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      )}
    </header>
  )
}
