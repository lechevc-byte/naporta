import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Category mapping from Open Food Facts to our categories
const CATEGORY_MAP: Record<string, { query: string; category: string; priceRange: [number, number]; unit: string }[]> = {
  beverages: [
    { query: 'water', category: 'Bebidas', priceRange: [50, 100], unit: 'litro' },
    { query: 'coca-cola', category: 'Bebidas', priceRange: [100, 180], unit: 'unidade' },
    { query: 'fanta', category: 'Bebidas', priceRange: [100, 180], unit: 'unidade' },
    { query: 'juice', category: 'Bebidas', priceRange: [120, 250], unit: 'litro' },
    { query: 'beer', category: 'Bebidas', priceRange: [150, 250], unit: 'unidade' },
  ],
  staples: [
    { query: 'rice', category: 'Alimentação', priceRange: [200, 500], unit: 'kg' },
    { query: 'pasta', category: 'Alimentação', priceRange: [150, 350], unit: 'pacote' },
    { query: 'flour', category: 'Alimentação', priceRange: [200, 400], unit: 'kg' },
    { query: 'sugar', category: 'Alimentação', priceRange: [150, 300], unit: 'kg' },
    { query: 'olive oil', category: 'Alimentação', priceRange: [400, 800], unit: 'litro' },
    { query: 'sunflower oil', category: 'Alimentação', priceRange: [300, 600], unit: 'litro' },
  ],
  canned: [
    { query: 'tuna', category: 'Conservas', priceRange: [200, 400], unit: 'unidade' },
    { query: 'sardines', category: 'Conservas', priceRange: [150, 300], unit: 'unidade' },
    { query: 'tomato sauce', category: 'Conservas', priceRange: [100, 250], unit: 'unidade' },
    { query: 'beans', category: 'Conservas', priceRange: [100, 200], unit: 'unidade' },
    { query: 'corn', category: 'Conservas', priceRange: [120, 220], unit: 'unidade' },
  ],
  dairy: [
    { query: 'milk', category: 'Laticínios', priceRange: [100, 250], unit: 'litro' },
    { query: 'yogurt', category: 'Laticínios', priceRange: [80, 200], unit: 'unidade' },
    { query: 'cheese', category: 'Laticínios', priceRange: [300, 700], unit: 'unidade' },
    { query: 'butter', category: 'Laticínios', priceRange: [250, 500], unit: 'unidade' },
  ],
  snacks: [
    { query: 'chips', category: 'Snacks', priceRange: [150, 350], unit: 'pacote' },
    { query: 'chocolate', category: 'Snacks', priceRange: [100, 400], unit: 'unidade' },
    { query: 'cookies', category: 'Snacks', priceRange: [150, 300], unit: 'pacote' },
    { query: 'crackers', category: 'Snacks', priceRange: [100, 250], unit: 'pacote' },
  ],
  hygiene: [
    { query: 'soap', category: 'Higiene', priceRange: [100, 300], unit: 'unidade' },
    { query: 'shampoo', category: 'Higiene', priceRange: [300, 600], unit: 'unidade' },
    { query: 'toothpaste', category: 'Higiene', priceRange: [200, 400], unit: 'unidade' },
  ],
  cleaning: [
    { query: 'detergent', category: 'Limpeza', priceRange: [200, 500], unit: 'unidade' },
    { query: 'bleach', category: 'Limpeza', priceRange: [150, 350], unit: 'litro' },
  ],
}

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

interface OFFProduct {
  product_name?: string
  image_url?: string
  code?: string
  nutriscore_grade?: string
}

async function fetchProducts(query: string, count: number = 5): Promise<OFFProduct[]> {
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${count}&fields=product_name,image_url,code,nutriscore_grade`
    const res = await fetch(url)
    const data = await res.json()
    return (data.products || []).filter(
      (p: OFFProduct) => p.product_name && p.product_name.length > 2 && p.image_url
    )
  } catch (err) {
    console.error(`Failed to fetch "${query}":`, err)
    return []
  }
}

async function main() {
  console.log('Seeding NaPorta products from Open Food Facts...\n')

  const allProducts: {
    name: string
    image_url: string | null
    barcode: string | null
    category: string
    price: number
    unit: string
    in_stock: boolean
  }[] = []

  for (const [group, queries] of Object.entries(CATEGORY_MAP)) {
    console.log(`Fetching ${group}...`)
    for (const { query, category, priceRange, unit } of queries) {
      const products = await fetchProducts(query, 4)

      for (const p of products) {
        allProducts.push({
          name: p.product_name!,
          image_url: p.image_url || null,
          barcode: p.code || null,
          category,
          price: randomPrice(priceRange[0], priceRange[1]),
          unit,
          in_stock: Math.random() > 0.1, // 10% chance of out of stock
        })
      }

      // Small delay to be nice to the API
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  // Deduplicate by barcode
  const seen = new Set<string>()
  const unique = allProducts.filter((p) => {
    if (!p.barcode) return true
    if (seen.has(p.barcode)) return false
    seen.add(p.barcode)
    return true
  })

  console.log(`\nInserting ${unique.length} products into Supabase...`)

  // Insert in batches of 20
  for (let i = 0; i < unique.length; i += 20) {
    const batch = unique.slice(i, i + 20)
    const { error } = await supabase.from('products').upsert(batch, {
      onConflict: 'barcode',
      ignoreDuplicates: true,
    })
    if (error) {
      console.error('Insert error:', error.message)
    } else {
      console.log(`  Inserted batch ${Math.floor(i / 20) + 1}`)
    }
  }

  console.log('\nDone! Products seeded successfully.')
}

main()
