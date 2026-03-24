'use client'

import { useState, useRef, useMemo } from 'react'
import { Product } from '@/types'
import Header from './Header'
import Footer from './Footer'
import ProductCard from './ProductCard'

const CATEGORIES = [
  { emoji: '\uD83D\uDED2', name: 'Todos', bg: '#E0E7FF', filter: 'Todos' },
  { emoji: '\uD83E\uDD64', name: 'Aguas, sumos', bg: '#DBEAFE', filter: 'Águas, sumos, refrigerantes' },
  { emoji: '\uD83C\uDF7A', name: 'Cervejas', bg: '#FEE2E2', filter: 'Cervejas e vinhos' },
  { emoji: '\uD83E\uDD6B', name: 'Mercearia salgada', bg: '#D1FAE5', filter: 'Mercearia salgada' },
  { emoji: '\uD83C\uDF6B', name: 'Mercearia doce', bg: '#FCE7F3', filter: 'Mercearia doce' },
  { emoji: '\uD83E\uDDC0', name: 'Lacticinios', bg: '#FEF9C3', filter: 'Lacticínios e queijos' },
  { emoji: '\uD83E\uDDF4', name: 'Higiene', bg: '#EDE9FE', filter: 'Higiene e beleza' },
  { emoji: '\uD83E\uDDF9', name: 'Limpeza', bg: '#FFEDD5', filter: 'Limpeza e casa' },
  { emoji: '\uD83D\uDC76', name: 'Bebe', bg: '#CCFBF1', filter: 'Bebé' },
]

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name' | 'promo'
type QuickFilter = 'none' | 'promo' | 'popular'

export default function HomePage({ products }: { products: Product[] }) {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('default')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('none')
  const catalogRef = useRef<HTMLDivElement>(null)

  const populares = useMemo(() => products.filter((p) => p.is_popular), [products])
  const promos = useMemo(() => products.filter((p) => p.original_price && p.original_price > p.price), [products])

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchCat = category === 'Todos' || p.category === category
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchQuick = quickFilter === 'none'
        || (quickFilter === 'promo' && p.original_price && p.original_price > p.price)
        || (quickFilter === 'popular' && p.is_popular)
      return matchCat && matchSearch && matchQuick
    })

    switch (sort) {
      case 'price-asc': result = [...result].sort((a, b) => a.price - b.price); break
      case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break
      case 'name': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break
      case 'promo': result = [...result].sort((a, b) => {
        const aPromo = a.original_price ? 1 : 0
        const bPromo = b.original_price ? 1 : 0
        return bPromo - aPromo
      }); break
    }

    return result
  }, [products, category, search, sort, quickFilter])

  function selectCategory(filter: string) {
    setCategory(filter)
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
              Entrega em Praia
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-5">
              O seu supermercado,<br />
              <span className="text-green-600">na sua porta.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Fazemos as compras no Calu & Angela e entregamos em sua casa. Rapido e simples.
            </p>
            <button onClick={() => selectCategory('Todos')} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full text-base transition-colors shadow-lg shadow-green-600/25">
              Ver produtos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-sm text-gray-500">
              {['Pagamento na entrega', 'Seg-Sab 8h-20h', 'Sem taxas de entrega'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Category cards 3x3 */}
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {CATEGORIES.map((cat) => (
              <button key={cat.name} onClick={() => selectCategory(cat.filter)} style={{ background: cat.bg }}
                className={`w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-2xl shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:scale-105 transition-all cursor-pointer border-2 ${
                  category === cat.filter ? 'border-green-600 shadow-md scale-105' : 'border-transparent'
                }`}>
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{cat.emoji}</span>
                <span className="text-[10px] font-bold text-gray-700 mt-1.5 text-center leading-tight px-1">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promos banner ── */}
      {promos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">PROMO</span>
            <h2 className="text-lg font-bold text-gray-900">Ofertas da semana</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {promos.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[160px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Populares ── */}
      {populares.length > 0 && category === 'Todos' && !search && (
        <section className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔥</span>
            <h2 className="text-lg font-bold text-gray-900">Mais populares</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {populares.map((p) => (
              <div key={p.id} className="flex-shrink-0 w-[160px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Como funciona ── */}
      <section className="bg-green-50/60 border-y border-green-100/50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-center text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-10">Como funciona</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { n: '1', title: 'Escolha', desc: 'Selecione os produtos que precisa no nosso catalogo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { n: '2', title: 'Nos compramos', desc: 'A nossa equipa faz as compras no Calu & Angela', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
              { n: '3', title: 'Entregamos', desc: 'Receba tudo na sua porta. Pagamento na entrega.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' },
            ].map((s) => (
              <div key={s.n} className="relative text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[72px] font-black text-green-600/[0.06] leading-none select-none pointer-events-none">{s.n}</span>
                <div className="relative w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-600/20">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalogue ── */}
      <main ref={catalogRef} id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-1">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {category === 'Todos' ? 'Catalogo' : CATEGORIES.find(c => c.filter === category)?.name || category}
          </h2>
          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-sm text-gray-500 bg-transparent border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30">
            <option value="default">Ordenar</option>
            <option value="price-asc">Preco: menor</option>
            <option value="price-desc">Preco: maior</option>
            <option value="name">A → Z</option>
            <option value="promo">Promocoes primeiro</option>
          </select>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
          {category !== 'Todos' && (
            <> — <button onClick={() => setCategory('Todos')} className="text-green-600 hover:underline">Ver todos</button></>
          )}
        </p>

        {/* Quick filters */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'none' as QuickFilter, label: 'Todos' },
            { key: 'promo' as QuickFilter, label: 'Em promo' },
            { key: 'popular' as QuickFilter, label: 'Populares' },
          ].map((f) => (
            <button key={f.key} onClick={() => setQuickFilter(quickFilter === f.key ? 'none' : f.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                border: quickFilter === f.key ? '2px solid #16a34a' : '1px solid #e5e7eb',
                background: quickFilter === f.key ? '#f0fdf4' : '#fff',
                color: quickFilter === f.key ? '#16a34a' : '#374151',
                cursor: 'pointer',
              }}>
              {f.key === 'promo' && '🏷 '}{f.key === 'popular' && '🔥 '}{f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Procurar produtos..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-full text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all" />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const count = cat.filter === 'Todos' ? products.length : products.filter(p => p.category === cat.filter).length
            if (cat.filter !== 'Todos' && count === 0) return null
            return (
              <button key={cat.filter} onClick={() => setCategory(cat.filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat.filter ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                {cat.name}
                <span className={`ml-1.5 text-xs ${category === cat.filter ? 'text-green-200' : 'text-gray-400'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className="text-gray-500 font-medium">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
