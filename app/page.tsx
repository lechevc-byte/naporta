import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CatalogClient from '@/components/CatalogClient'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  return (
    <>
      <Header />
      <Hero />
      <main id="catalogo" className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1A2744]">
            Catálogo de produtos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Preços em escudos cabo-verdianos (CVE)
          </p>
        </div>
        <CatalogClient products={products || []} />
      </main>
      <Footer />
    </>
  )
}
