import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CatalogClient from '@/components/CatalogClient'
import Footer from '@/components/Footer'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  return <HomeClient products={products || []} />
}
