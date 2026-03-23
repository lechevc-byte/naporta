import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Pexels API — free, 200 req/h
const PEXELS_KEY = 'PtbqeKJb8wfJnlHn4Y8PvXiVMPmxl5jvr1aCa3eKnFFr6FyG6iL6b5e5'

const QUERIES: Record<string, string> = {
  'Fanta Laranja 33cl': 'orange soda drink',
  'Red Bull 25cl': 'energy drink can',
  'Schweppes Tónica 33cl': 'tonic water bottle',
  'Sprite 33cl': 'green soda drink',
  'Leite Guigoz Crescimento 1L': 'baby milk formula',
  '1664 Kronenbourg 33cl': 'beer bottle cold',
  'Babybel Mini 6 unid.': 'mini cheese',
  'Iogurte Danone Natural 125g': 'yogurt cup',
  'Leite Condensado Nestlé 397g': 'condensed milk',
  'Queijo Kiri 8 porções': 'cream cheese',
  'BN Chocolate 295g': 'chocolate biscuits',
  'Kinder Bueno 43g': 'chocolate wafer',
  'Nutella 350g': 'chocolate spread jar',
  'Nutella 750g': 'hazelnut spread',
  'Pringles Original 165g': 'potato chips tube',
  'Snickers 50g': 'chocolate bar peanut',
  'Twix 50g': 'chocolate caramel bar',
  'Doritos Nacho Cheese 170g': 'tortilla chips',
  'Maionese Amora 470g': 'mayonnaise jar',
  'Mostarda Maille Dijon 215g': 'mustard jar',
  'Óleo de Girassol Lesieur 1L': 'cooking oil bottle',
  'Penne Panzani 500g': 'penne pasta',
}

async function searchPexels(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&size=small`,
      { headers: { Authorization: PEXELS_KEY } }
    )
    if (!res.ok) { console.log(`    Pexels ${res.status}`); return null }
    const data = await res.json()
    return data.photos?.[0]?.src?.medium || null
  } catch { return null }
}

async function main() {
  const { data: products } = await supabase.from('products').select('id, name, image_url').order('name')
  const toFix = products?.filter(p => QUERIES[p.name]) || []

  console.log(`Fixing ${toFix.length} products via Pexels...\n`)
  let ok = 0

  for (const product of toFix) {
    const query = QUERIES[product.name]
    const imageUrl = await searchPexels(query)
    if (!imageUrl) { console.log(`  ✗ ${product.name}`); continue }

    const res = await fetch(imageUrl)
    if (!res.ok) { console.log(`  ✗ ${product.name} — download fail`); continue }
    const buffer = Buffer.from(await res.arrayBuffer())

    const { error: upErr } = await supabase.storage
      .from('products')
      .upload(`${product.id}.jpg`, buffer, { contentType: 'image/jpeg', upsert: true })
    if (upErr) { console.log(`  ✗ ${product.name} — ${upErr.message}`); continue }

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(`${product.id}.jpg`)
    await supabase.from('products').update({ image_url: urlData.publicUrl }).eq('id', product.id)

    console.log(`  ✓ ${product.name}`)
    ok++
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\nDone! ${ok}/${toFix.length} fixed.`)
}

main()
