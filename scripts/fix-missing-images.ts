import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY!

// Generic queries for products that failed with brand-specific queries
const FALLBACK_QUERIES: Record<string, string> = {
  'Fanta Laranja 33cl': 'orange soda can',
  'Red Bull 25cl': 'energy drink can',
  'Schweppes Tónica 33cl': 'tonic water glass bottle',
  'Sprite 33cl': 'lemon lime soda',
  'Leite Guigoz Crescimento 1L': 'baby milk bottle',
  '1664 Kronenbourg 33cl': 'lager beer glass',
  'Babybel Mini 6 unid.': 'mini cheese round red',
  'Iogurte Danone Natural 125g': 'plain yogurt container',
  'Leite Condensado Nestlé 397g': 'condensed milk tin',
  'Queijo Kiri 8 porções': 'cream cheese spread',
  'BN Chocolate 295g': 'chocolate sandwich cookies',
  'Kinder Bueno 43g': 'chocolate wafer bar',
  'Nutella 350g': 'chocolate hazelnut spread jar',
  'Nutella 750g': 'chocolate spread large jar',
  'Pringles Original 165g': 'stacked potato chips',
  'Snickers 50g': 'peanut chocolate candy bar',
  'Twix 50g': 'caramel cookie chocolate',
  'Doritos Nacho Cheese 170g': 'tortilla chips nacho',
  'Maionese Amora 470g': 'mayonnaise bottle white',
  'Mostarda Maille Dijon 215g': 'dijon mustard glass jar',
  'Óleo de Girassol Lesieur 1L': 'cooking oil bottle',
  'Penne Panzani 500g': 'penne pasta dry',
}

async function searchUnsplash(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    if (!res.ok) { console.log(`    API ${res.status}`); return null }
    const data = await res.json()
    return data.results?.[0]?.urls?.small || null
  } catch { return null }
}

async function main() {
  // Get products that still have OFF URLs (not supabase storage)
  const { data: products } = await supabase
    .from('products')
    .select('id, name, image_url')
    .order('name')

  const toFix = products?.filter(p =>
    !p.image_url?.includes('supabase') || FALLBACK_QUERIES[p.name]
  ).filter(p => FALLBACK_QUERIES[p.name]) || []

  console.log(`Fixing ${toFix.length} products with missing images...\n`)

  let ok = 0
  for (const product of toFix) {
    const query = FALLBACK_QUERIES[product.name]
    if (!query) continue

    const imageUrl = await searchUnsplash(query)
    if (!imageUrl) { console.log(`  ✗ ${product.name}`); continue }

    // Download
    const res = await fetch(imageUrl)
    if (!res.ok) { console.log(`  ✗ ${product.name} — download failed`); continue }
    const buffer = Buffer.from(await res.arrayBuffer())

    // Upload
    const { error: upErr } = await supabase.storage
      .from('products')
      .upload(`${product.id}.jpg`, buffer, { contentType: 'image/jpeg', upsert: true })
    if (upErr) { console.log(`  ✗ ${product.name} — upload: ${upErr.message}`); continue }

    // Get URL & update
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(`${product.id}.jpg`)
    await supabase.from('products').update({ image_url: urlData.publicUrl }).eq('id', product.id)

    console.log(`  ✓ ${product.name}`)
    ok++
    await new Promise(r => setTimeout(r, 1500)) // rate limit
  }

  console.log(`\nDone! ${ok}/${toFix.length} fixed.`)
}

main()
