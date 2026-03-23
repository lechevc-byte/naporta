import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface SearchConfig {
  query: string
  category: string
  priceRange: [number, number]
  unit: string
  take: number
}

const SEARCHES: SearchConfig[] = [
  // Bebidas
  { query: 'coca cola', category: 'Bebidas', priceRange: [100, 150], unit: 'unidade', take: 3 },
  { query: 'fanta orange', category: 'Bebidas', priceRange: [100, 140], unit: 'unidade', take: 2 },
  { query: 'sprite lemon', category: 'Bebidas', priceRange: [100, 140], unit: 'unidade', take: 1 },
  { query: 'pepsi cola', category: 'Bebidas', priceRange: [100, 140], unit: 'unidade', take: 2 },
  { query: 'red bull energy', category: 'Bebidas', priceRange: [300, 400], unit: 'unidade', take: 2 },
  { query: 'heineken beer', category: 'Bebidas', priceRange: [180, 250], unit: 'unidade', take: 2 },
  { query: 'evian water', category: 'Bebidas', priceRange: [70, 120], unit: 'unidade', take: 2 },
  { query: 'schweppes tonic', category: 'Bebidas', priceRange: [120, 160], unit: 'unidade', take: 1 },
  { query: 'ice tea lipton', category: 'Bebidas', priceRange: [130, 200], unit: 'unidade', take: 2 },

  // Alimentação
  { query: 'barilla pasta spaghetti', category: 'Alimentação', priceRange: [180, 250], unit: 'pacote', take: 2 },
  { query: 'panzani pasta', category: 'Alimentação', priceRange: [150, 220], unit: 'pacote', take: 2 },
  { query: 'uncle bens rice', category: 'Alimentação', priceRange: [350, 500], unit: 'pacote', take: 2 },
  { query: 'heinz ketchup', category: 'Alimentação', priceRange: [350, 450], unit: 'unidade', take: 2 },
  { query: 'hellmanns mayonnaise', category: 'Alimentação', priceRange: [400, 500], unit: 'unidade', take: 1 },
  { query: 'nescafe coffee', category: 'Alimentação', priceRange: [500, 700], unit: 'unidade', take: 2 },
  { query: 'olive oil extra virgin', category: 'Alimentação', priceRange: [550, 800], unit: 'unidade', take: 2 },
  { query: 'maille mustard', category: 'Alimentação', priceRange: [280, 380], unit: 'unidade', take: 1 },
  { query: 'tabasco sauce', category: 'Alimentação', priceRange: [280, 350], unit: 'unidade', take: 1 },
  { query: 'kikkoman soy sauce', category: 'Alimentação', priceRange: [300, 400], unit: 'unidade', take: 1 },

  // Conservas
  { query: 'bonduelle corn', category: 'Conservas', priceRange: [180, 250], unit: 'unidade', take: 2 },
  { query: 'bonduelle peas', category: 'Conservas', priceRange: [180, 230], unit: 'unidade', take: 1 },
  { query: 'mutti tomato', category: 'Conservas', priceRange: [200, 300], unit: 'unidade', take: 2 },
  { query: 'rio mare tuna', category: 'Conservas', priceRange: [250, 350], unit: 'unidade', take: 2 },
  { query: 'sardines olive oil', category: 'Conservas', priceRange: [200, 320], unit: 'unidade', take: 2 },

  // Laticínios
  { query: 'danone yogurt natural', category: 'Laticínios', priceRange: [80, 150], unit: 'unidade', take: 2 },
  { query: 'president cheese camembert', category: 'Laticínios', priceRange: [400, 550], unit: 'unidade', take: 1 },
  { query: 'philadelphia cream cheese', category: 'Laticínios', priceRange: [350, 450], unit: 'unidade', take: 1 },
  { query: 'laughing cow cheese', category: 'Laticínios', priceRange: [300, 400], unit: 'unidade', take: 2 },
  { query: 'kiri cheese', category: 'Laticínios', priceRange: [300, 400], unit: 'unidade', take: 1 },
  { query: 'nestle condensed milk', category: 'Laticínios', priceRange: [300, 400], unit: 'unidade', take: 1 },
  { query: 'butter president', category: 'Laticínios', priceRange: [350, 500], unit: 'unidade', take: 1 },

  // Snacks
  { query: 'nutella ferrero', category: 'Snacks', priceRange: [500, 700], unit: 'unidade', take: 2 },
  { query: 'pringles chips', category: 'Snacks', priceRange: [350, 450], unit: 'unidade', take: 2 },
  { query: 'oreo cookies', category: 'Snacks', priceRange: [200, 300], unit: 'pacote', take: 2 },
  { query: 'kinder bueno', category: 'Snacks', priceRange: [150, 220], unit: 'unidade', take: 2 },
  { query: 'kitkat chocolate', category: 'Snacks', priceRange: [130, 180], unit: 'unidade', take: 2 },
  { query: 'haribo candy', category: 'Snacks', priceRange: [250, 350], unit: 'pacote', take: 2 },
  { query: 'milka chocolate', category: 'Snacks', priceRange: [250, 350], unit: 'unidade', take: 2 },
  { query: 'snickers mars', category: 'Snacks', priceRange: [130, 180], unit: 'unidade', take: 2 },
  { query: 'lays chips', category: 'Snacks', priceRange: [280, 380], unit: 'pacote', take: 2 },

  // Higiene
  { query: 'dove soap', category: 'Higiene', priceRange: [180, 250], unit: 'unidade', take: 2 },
  { query: 'colgate toothpaste', category: 'Higiene', priceRange: [200, 300], unit: 'unidade', take: 2 },
  { query: 'nivea cream', category: 'Higiene', priceRange: [350, 500], unit: 'unidade', take: 1 },
  { query: 'head shoulders shampoo', category: 'Higiene', priceRange: [400, 550], unit: 'unidade', take: 2 },

  // Limpeza
  { query: 'fairy dish soap', category: 'Limpeza', priceRange: [300, 400], unit: 'unidade', take: 2 },
  { query: 'ajax cleaner', category: 'Limpeza', priceRange: [350, 450], unit: 'unidade', take: 1 },
  { query: 'cif cream cleaner', category: 'Limpeza', priceRange: [250, 350], unit: 'unidade', take: 1 },
  { query: 'finish dishwasher', category: 'Limpeza', priceRange: [700, 1000], unit: 'pacote', take: 1 },
]

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

async function searchOFF(query: string, pageSize: number = 20) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}&fields=product_name,image_front_small_url,image_front_url,code,brands`
  const res = await fetch(url)
  if (!res.ok) return []
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return (data.products || []).filter((p: any) =>
      p.product_name &&
      p.product_name.length > 2 &&
      p.product_name.length < 80 &&
      (p.image_front_url || p.image_front_small_url) &&
      !/[\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(p.product_name) // No Arabic/Chinese/Japanese
    )
  } catch { return [] }
}

async function main() {
  console.log('Smart seeding — searching for products with verified images...\n')

  const allProducts: any[] = []
  const seenNames = new Set<string>()

  for (const s of SEARCHES) {
    const results = await searchOFF(s.query, 15)
    let taken = 0

    for (const r of results) {
      if (taken >= s.take) break
      const name = r.product_name.trim()
      const lowerName = name.toLowerCase()
      if (seenNames.has(lowerName)) continue

      const img = r.image_front_url || r.image_front_small_url
      seenNames.add(lowerName)
      taken++

      allProducts.push({
        name,
        image_url: img,
        barcode: r.code || null,
        category: s.category,
        price: randomPrice(s.priceRange[0], s.priceRange[1]),
        unit: s.unit,
        in_stock: true,
      })
    }

    console.log(`  ${s.query}: ${taken}/${s.take} found`)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nTotal: ${allProducts.length} products`)

  if (allProducts.length > 0) {
    // Insert in batches
    for (let i = 0; i < allProducts.length; i += 20) {
      const batch = allProducts.slice(i, i + 20)
      const { error } = await supabase.from('products').insert(batch)
      if (error) console.error('Batch error:', error.message)
      else console.log(`  Batch ${Math.floor(i/20)+1} inserted (${batch.length} products)`)
    }
    console.log('\nDone!')
  }
}

main()
