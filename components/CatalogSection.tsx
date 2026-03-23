'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

export default function CatalogSection({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')

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
      <div className="relative mb-5">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Procurar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
        {categories.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setCategory(name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === name
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {name}
            <span className={`ml-1.5 text-xs ${category === name ? 'text-green-200' : 'text-gray-400'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente outra pesquisa</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
