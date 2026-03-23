'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

export default function CatalogClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

  // Build categories dynamically from actual products
  const categories = useMemo(() => {
    const cats = new Map<string, number>()
    products.forEach((p) => cats.set(p.category, (cats.get(p.category) || 0) + 1))
    return [
      { name: 'Todos', count: products.length },
      ...Array.from(cats.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ]
  }, [products])

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'Todos' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Procurar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] text-sm shadow-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {categories.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setCategory(name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === name
                ? 'bg-[#FF6B35] text-white shadow-sm shadow-orange-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {name}
            <span className={`ml-1 text-xs ${category === name ? 'text-orange-100' : 'text-gray-400'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-base">Nenhum produto encontrado</p>
          <p className="text-sm mt-1">Tente outra pesquisa</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
