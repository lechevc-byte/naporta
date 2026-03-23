import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

interface SearchConfig {
  query: string
  category: string
  priceRange: [number, number]
  unit: string
  take: number
}

// Categories from Houra/user spec, adapted for Cape Verde
const SEARCHES: SearchConfig[] = [
  // === Eaux, jus, soda, thés glacés ===
  { query: 'coca cola can', category: 'Eaux, jus, soda', priceRange: [100, 150], unit: 'unidade', take: 2 },
  { query: 'coca cola bottle', category: 'Eaux, jus, soda', priceRange: [200, 280], unit: 'unidade', take: 1 },
  { query: 'fanta orange', category: 'Eaux, jus, soda', priceRange: [100, 140], unit: 'unidade', take: 2 },
  { query: 'sprite', category: 'Eaux, jus, soda', priceRange: [100, 140], unit: 'unidade', take: 1 },
  { query: 'pepsi can', category: 'Eaux, jus, soda', priceRange: [100, 140], unit: 'unidade', take: 1 },
  { query: 'orangina bottle', category: 'Eaux, jus, soda', priceRange: [120, 160], unit: 'unidade', take: 1 },
  { query: 'red bull energy drink', category: 'Eaux, jus, soda', priceRange: [300, 400], unit: 'unidade', take: 1 },
  { query: 'evian water bottle', category: 'Eaux, jus, soda', priceRange: [70, 120], unit: 'unidade', take: 2 },
  { query: 'cristaline eau', category: 'Eaux, jus, soda', priceRange: [50, 80], unit: 'unidade', take: 1 },
  { query: 'perrier sparkling', category: 'Eaux, jus, soda', priceRange: [120, 180], unit: 'unidade', take: 1 },
  { query: 'tropicana orange juice', category: 'Eaux, jus, soda', priceRange: [250, 400], unit: 'unidade', take: 2 },
  { query: 'lipton ice tea', category: 'Eaux, jus, soda', priceRange: [120, 200], unit: 'unidade', take: 2 },
  { query: 'schweppes tonic', category: 'Eaux, jus, soda', priceRange: [120, 170], unit: 'unidade', take: 1 },
  { query: 'oasis tropical', category: 'Eaux, jus, soda', priceRange: [120, 180], unit: 'unidade', take: 1 },

  // === Vins, bières, alcools ===
  { query: 'heineken beer bottle', category: 'Bières et alcools', priceRange: [180, 250], unit: 'unidade', take: 2 },
  { query: 'corona extra beer', category: 'Bières et alcools', priceRange: [200, 300], unit: 'unidade', take: 1 },
  { query: 'desperados beer', category: 'Bières et alcools', priceRange: [180, 250], unit: 'unidade', take: 1 },
  { query: 'leffe blonde beer', category: 'Bières et alcools', priceRange: [200, 300], unit: 'unidade', take: 1 },
  { query: '1664 kronenbourg', category: 'Bières et alcools', priceRange: [150, 220], unit: 'unidade', take: 1 },

  // === Epicerie salée ===
  { query: 'barilla spaghetti', category: 'Epicerie salée', priceRange: [180, 250], unit: 'pacote', take: 2 },
  { query: 'panzani penne', category: 'Epicerie salée', priceRange: [150, 220], unit: 'pacote', take: 1 },
  { query: 'uncle bens rice basmati', category: 'Epicerie salée', priceRange: [350, 500], unit: 'pacote', take: 1 },
  { query: 'taureau aile riz thai', category: 'Epicerie salée', priceRange: [400, 550], unit: 'kg', take: 1 },
  { query: 'heinz tomato ketchup', category: 'Epicerie salée', priceRange: [350, 450], unit: 'unidade', take: 1 },
  { query: 'amora mayonnaise', category: 'Epicerie salée', priceRange: [300, 420], unit: 'unidade', take: 1 },
  { query: 'maille moutarde dijon', category: 'Epicerie salée', priceRange: [250, 350], unit: 'unidade', take: 1 },
  { query: 'tabasco pepper sauce', category: 'Epicerie salée', priceRange: [280, 380], unit: 'unidade', take: 1 },
  { query: 'kikkoman soy sauce', category: 'Epicerie salée', priceRange: [300, 400], unit: 'unidade', take: 1 },
  { query: 'puget huile olive', category: 'Epicerie salée', priceRange: [500, 750], unit: 'unidade', take: 1 },
  { query: 'lesieur huile tournesol', category: 'Epicerie salée', priceRange: [300, 450], unit: 'litro', take: 1 },
  { query: 'mutti passata tomato', category: 'Epicerie salée', priceRange: [200, 300], unit: 'unidade', take: 1 },
  { query: 'bonduelle mais corn', category: 'Epicerie salée', priceRange: [150, 220], unit: 'unidade', take: 1 },
  { query: 'bonduelle petits pois', category: 'Epicerie salée', priceRange: [150, 220], unit: 'unidade', take: 1 },
  { query: 'rio mare tuna olive', category: 'Epicerie salée', priceRange: [250, 350], unit: 'unidade', take: 2 },

  // === Epicerie sucrée ===
  { query: 'nutella ferrero', category: 'Epicerie sucrée', priceRange: [500, 700], unit: 'unidade', take: 2 },
  { query: 'nescafe classic instant', category: 'Epicerie sucrée', priceRange: [500, 700], unit: 'unidade', take: 1 },
  { query: 'nesquik chocolate powder', category: 'Epicerie sucrée', priceRange: [400, 550], unit: 'unidade', take: 1 },
  { query: 'bonne maman confiture', category: 'Epicerie sucrée', priceRange: [350, 500], unit: 'unidade', take: 2 },
  { query: 'beghin say sucre', category: 'Epicerie sucrée', priceRange: [150, 220], unit: 'kg', take: 1 },
  { query: 'lipton yellow label tea', category: 'Epicerie sucrée', priceRange: [250, 380], unit: 'unidade', take: 1 },
  { query: 'twinings earl grey', category: 'Epicerie sucrée', priceRange: [300, 450], unit: 'unidade', take: 1 },

  // === Produits laitiers, oeufs, fromages ===
  { query: 'danone yogourt nature', category: 'Produits laitiers', priceRange: [80, 150], unit: 'unidade', take: 2 },
  { query: 'president camembert', category: 'Produits laitiers', priceRange: [400, 550], unit: 'unidade', take: 1 },
  { query: 'philadelphia cream cheese', category: 'Produits laitiers', priceRange: [350, 450], unit: 'unidade', take: 1 },
  { query: 'vache qui rit fromage', category: 'Produits laitiers', priceRange: [300, 420], unit: 'unidade', take: 2 },
  { query: 'kiri fromage enfant', category: 'Produits laitiers', priceRange: [300, 400], unit: 'unidade', take: 1 },
  { query: 'babybel cheese', category: 'Produits laitiers', priceRange: [350, 480], unit: 'unidade', take: 1 },
  { query: 'nestle lait concentre', category: 'Produits laitiers', priceRange: [280, 380], unit: 'unidade', take: 1 },
  { query: 'president butter', category: 'Produits laitiers', priceRange: [350, 500], unit: 'unidade', take: 1 },
  { query: 'elle vire cream', category: 'Produits laitiers', priceRange: [250, 380], unit: 'unidade', take: 1 },
  { query: 'activia danone', category: 'Produits laitiers', priceRange: [150, 250], unit: 'unidade', take: 1 },

  // === Snacks (merged into Epicerie sucrée too but separate for variety) ===
  { query: 'pringles original', category: 'Epicerie sucrée', priceRange: [350, 450], unit: 'unidade', take: 1 },
  { query: 'oreo original cookies', category: 'Epicerie sucrée', priceRange: [200, 300], unit: 'pacote', take: 1 },
  { query: 'kinder bueno chocolate', category: 'Epicerie sucrée', priceRange: [150, 220], unit: 'unidade', take: 1 },
  { query: 'kitkat nestle', category: 'Epicerie sucrée', priceRange: [130, 180], unit: 'unidade', take: 1 },
  { query: 'haribo goldbears', category: 'Epicerie sucrée', priceRange: [200, 320], unit: 'pacote', take: 1 },
  { query: 'milka chocolate tablet', category: 'Epicerie sucrée', priceRange: [250, 350], unit: 'unidade', take: 1 },
  { query: 'snickers chocolate bar', category: 'Epicerie sucrée', priceRange: [130, 180], unit: 'unidade', take: 1 },
  { query: 'twix chocolate', category: 'Epicerie sucrée', priceRange: [130, 180], unit: 'unidade', take: 1 },
  { query: 'lays chips nature', category: 'Epicerie salée', priceRange: [250, 380], unit: 'pacote', take: 2 },
  { query: 'doritos nacho cheese', category: 'Epicerie salée', priceRange: [280, 400], unit: 'pacote', take: 1 },
  { query: 'belvita petit dejeuner', category: 'Epicerie sucrée', priceRange: [280, 380], unit: 'pacote', take: 1 },
  { query: 'lu prince chocolate', category: 'Epicerie sucrée', priceRange: [200, 300], unit: 'pacote', take: 1 },
  { query: 'bn biscuit', category: 'Epicerie sucrée', priceRange: [200, 280], unit: 'pacote', take: 1 },

  // === Hygiène, beauté ===
  { query: 'dove soap bar', category: 'Hygiène, beauté', priceRange: [180, 280], unit: 'unidade', take: 1 },
  { query: 'colgate toothpaste total', category: 'Hygiène, beauté', priceRange: [200, 320], unit: 'unidade', take: 1 },
  { query: 'nivea creme skin', category: 'Hygiène, beauté', priceRange: [350, 500], unit: 'unidade', take: 1 },
  { query: 'head shoulders shampoo', category: 'Hygiène, beauté', priceRange: [400, 550], unit: 'unidade', take: 1 },
  { query: 'palmolive shower gel', category: 'Hygiène, beauté', priceRange: [250, 380], unit: 'unidade', take: 1 },
  { query: 'oral b toothbrush', category: 'Hygiène, beauté', priceRange: [200, 350], unit: 'unidade', take: 1 },
  { query: 'pampers diapers baby', category: 'Tout pour bébé', priceRange: [1200, 1800], unit: 'pacote', take: 2 },
  { query: 'bledina compote bebe', category: 'Tout pour bébé', priceRange: [200, 350], unit: 'unidade', take: 1 },

  // === Entretien, maison ===
  { query: 'fairy dish liquid', category: 'Entretien, maison', priceRange: [300, 420], unit: 'unidade', take: 1 },
  { query: 'finish powerball dishwasher', category: 'Entretien, maison', priceRange: [700, 1000], unit: 'pacote', take: 1 },
  { query: 'skip laundry detergent', category: 'Entretien, maison', priceRange: [600, 900], unit: 'unidade', take: 1 },
  { query: 'mr propre nettoyant', category: 'Entretien, maison', priceRange: [300, 450], unit: 'unidade', take: 1 },
  { query: 'harpic toilet cleaner', category: 'Entretien, maison', priceRange: [250, 380], unit: 'unidade', take: 1 },
]

function randomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

async function searchOFF(query: string, pageSize: number = 20) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}&fields=product_name,image_front_url,image_front_small_url,code,brands`
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
      !/[\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\u0E00-\u0E7F]/.test(p.product_name)
    )
  } catch { return [] }
}

async function main() {
  console.log('Seeding with Houra-style categories...\n')

  const allProducts: any[] = []
  const seenNames = new Set<string>()

  for (const s of SEARCHES) {
    const results = await searchOFF(s.query, 12)
    let taken = 0

    for (const r of results) {
      if (taken >= s.take) break
      const name = r.product_name.trim()
      if (seenNames.has(name.toLowerCase())) continue

      const img = r.image_front_url || r.image_front_small_url
      seenNames.add(name.toLowerCase())
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

    const status = taken >= s.take ? 'OK' : taken > 0 ? '~' : 'XX'
    console.log(`  [${status}] ${s.category} / ${s.query}: ${taken}/${s.take}`)
    await new Promise(r => setTimeout(r, 250))
  }

  console.log(`\nTotal: ${allProducts.length} products`)

  // Show by category
  const cats: Record<string, number> = {}
  allProducts.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1)
  console.log('\nBy category:')
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`)
  })

  if (allProducts.length > 0) {
    for (let i = 0; i < allProducts.length; i += 20) {
      const batch = allProducts.slice(i, i + 20)
      const { error } = await supabase.from('products').insert(batch)
      if (error) console.error('Error:', error.message)
      else console.log(`\n  Inserted batch ${Math.floor(i/20)+1} (${batch.length})`)
    }
    console.log('\nDone!')
  }
}

main()
