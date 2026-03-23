import { createClient } from '@/lib/supabase/server'
import HomePage from '@/components/HomePage'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  return <HomePage products={products || []} />
}
