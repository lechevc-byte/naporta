'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'

const CATEGORY_EMOJIS: Record<string, string> = {
  'Todos': '',
  'Águas, sumos, refrigerantes': '',
  'Cervejas e vinhos': '',
  'Mercearia doce': '',
  'Mercearia salgada': '',
  'Lacticínios e queijos': '',
  'Higiene e beleza': '',
  'Limpeza e casa': '',
  'Bebé': '',
}

export default function CatalogClient({ products, initialSearch }: { products: Product[]; initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch || '')
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
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setCategory(name)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === name
                ? 'bg-brand text-white shadow-sm shadow-brand/20'
                : 'bg-[#F3F4F6] text-[#374151] hover:bg-gray-200'
            }`}
          >
            {CATEGORY_EMOJIS[name] !== undefined && (
              <span className="text-sm">{CATEGORY_EMOJIS[name]}</span>
            )}
            {name}
            <span className={`text-xs ${category === name ? 'text-white/70' : 'text-gray-400'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
