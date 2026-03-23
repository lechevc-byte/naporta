'use client'

import { useState } from 'react'
import { Product } from '@/types'
import Header from './Header'
import Hero from './Hero'
import CatalogClient from './CatalogClient'
import Footer from './Footer'

export default function HomeClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('')

  return (
    <>
      <Header onSearch={setSearch} />
      <Hero products={products} />
      <main id="catalogo" className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Catalogo
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Precos em escudos cabo-verdianos (CVE)
          </p>
        </div>
        <CatalogClient products={products} initialSearch={search} />
      </main>
      <Footer />
    </>
  )
}
