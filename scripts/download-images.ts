import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase env vars'); process.exit(1)
}
if (!UNSPLASH_KEY) {
  console.error('Missing UNSPLASH_ACCESS_KEY in .env.local'); process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Map product names/categories to good Unsplash search queries
function getSearchQuery(name: string, category: string): string {
  const n = name.toLowerCase()

  // Specific brands/products
  if (n.includes('coca-cola') || n.includes('coca cola')) return 'coca cola can product'
  if (n.includes('fanta')) return 'fanta orange soda'
  if (n.includes('sprite')) return 'sprite soda green'
  if (n.includes('pepsi')) return 'pepsi can blue'
  if (n.includes('red bull')) return 'red bull energy drink can'
  if (n.includes('schweppes')) return 'schweppes tonic water'
  if (n.includes('tropicana')) return 'orange juice bottle'
  if (n.includes('lipton')) return 'ice tea bottle'
  if (n.includes('oasis')) return 'tropical fruit juice'
  if (n.includes('perrier')) return 'sparkling water bottle'
  if (n.includes('cristaline') || n.includes('água') || n.includes('agua')) return 'water bottle clear'
  if (n.includes('heineken')) return 'heineken beer bottle green'
  if (n.includes('corona')) return 'corona beer bottle'
  if (n.includes('desperados')) return 'beer bottle'
  if (n.includes('1664') || n.includes('kronenbourg')) return 'beer bottle blonde'
  if (n.includes('leffe')) return 'belgian beer glass'

  if (n.includes('nutella')) return 'nutella jar chocolate'
  if (n.includes('nescaf')) return 'instant coffee jar'
  if (n.includes('nesquik')) return 'chocolate milk powder'
  if (n.includes('barilla') || n.includes('panzani') || n.includes('esparguete') || n.includes('penne') || n.includes('fusilli')) return 'pasta package spaghetti'
  if (n.includes('arroz') || n.includes('rice') || n.includes('riz')) return 'rice bag product'
  if (n.includes('ketchup') || n.includes('heinz')) return 'ketchup bottle red'
  if (n.includes('maionese') || n.includes('mayonnaise')) return 'mayonnaise jar'
  if (n.includes('mostarda') || n.includes('maille')) return 'mustard jar dijon'
  if (n.includes('tabasco')) return 'hot sauce bottle red'
  if (n.includes('kikkoman') || n.includes('soja')) return 'soy sauce bottle'
  if (n.includes('azeite') || n.includes('olive') || n.includes('puget')) return 'olive oil bottle'
  if (n.includes('óleo') || n.includes('girassol') || n.includes('lesieur')) return 'sunflower oil bottle'
  if (n.includes('passata') || n.includes('mutti') || n.includes('tomate')) return 'tomato sauce jar'
  if (n.includes('milho') || n.includes('bonduelle') && n.includes('mais')) return 'sweet corn can'
  if (n.includes('ervilha') || n.includes('pois')) return 'green peas can'
  if (n.includes('atum') || n.includes('tuna') || n.includes('rio mare')) return 'tuna can product'
  if (n.includes('doritos')) return 'doritos chips bag'
  if (n.includes('lay')) return 'potato chips bag'
  if (n.includes('compota') || n.includes('bonne maman')) return 'jam jar fruit'
  if (n.includes('açúcar') || n.includes('sucre') || n.includes('sugar')) return 'sugar bag white'
  if (n.includes('chá') || n.includes('lipton') || n.includes('twinings')) return 'tea box bags'
  if (n.includes('kitkat')) return 'kitkat chocolate bar'
  if (n.includes('milka')) return 'milka chocolate bar purple'
  if (n.includes('kinder') || n.includes('bueno')) return 'kinder bueno chocolate'
  if (n.includes('oreo')) return 'oreo cookies package'
  if (n.includes('pringles')) return 'pringles chips can'
  if (n.includes('haribo')) return 'gummy bears candy'
  if (n.includes('m&m')) return 'mms chocolate candy'
  if (n.includes('snickers')) return 'snickers chocolate bar'
  if (n.includes('twix')) return 'twix chocolate bar'
  if (n.includes('bn') || n.includes('biscuit')) return 'chocolate biscuits package'
  if (n.includes('belvita')) return 'breakfast biscuits'

  if (n.includes('danone') || n.includes('iogurte') || n.includes('yogurt')) return 'yogurt cup white'
  if (n.includes('camembert') || n.includes('président') && n.includes('queijo')) return 'camembert cheese round'
  if (n.includes('philadelphia')) return 'cream cheese package'
  if (n.includes('vaca que ri') || n.includes('laughing cow')) return 'laughing cow cheese'
  if (n.includes('kiri')) return 'cheese portions kids'
  if (n.includes('babybel')) return 'babybel cheese red'
  if (n.includes('manteiga') || n.includes('butter')) return 'butter block package'
  if (n.includes('condensado') || n.includes('condensed')) return 'condensed milk can'
  if (n.includes('natas') || n.includes('cream') || n.includes('elle')) return 'cooking cream carton'

  if (n.includes('dove') || n.includes('sabonete') || n.includes('soap')) return 'soap bar white'
  if (n.includes('colgate') || n.includes('pasta dental') || n.includes('toothpaste')) return 'toothpaste tube'
  if (n.includes('nivea')) return 'nivea cream blue tin'
  if (n.includes('head') || n.includes('shoulders') || n.includes('champô') || n.includes('shampoo')) return 'shampoo bottle'
  if (n.includes('palmolive') || n.includes('gel duche') || n.includes('shower')) return 'shower gel bottle'
  if (n.includes('rexona') || n.includes('desodorizante') || n.includes('deodorant')) return 'deodorant spray'

  if (n.includes('fairy') || n.includes('detergente')) return 'dish soap bottle'
  if (n.includes('finish') || n.includes('pastilha')) return 'dishwasher tablets box'
  if (n.includes('skip') || n.includes('laundry')) return 'laundry detergent bottle'
  if (n.includes('mr. proper') || n.includes('propre')) return 'cleaning spray bottle'
  if (n.includes('harpic') || n.includes('wc')) return 'toilet cleaner bottle'
  if (n.includes('scotch') || n.includes('esponja') || n.includes('sponge')) return 'kitchen sponge'

  if (n.includes('pampers') || n.includes('fraldas') || n.includes('diaper')) return 'baby diapers package'
  if (n.includes('blédina') || n.includes('compota') && n.includes('bebe')) return 'baby food jar'
  if (n.includes('guigoz') || n.includes('leite') && n.includes('crescimento')) return 'baby formula milk'

  // Fallback by category
  const catMap: Record<string, string> = {
    'Águas, sumos, refrigerantes': 'beverage drink bottle',
    'Cervejas e vinhos': 'beer bottle cold',
    'Mercearia salgada': 'grocery food product',
    'Mercearia doce': 'sweet snack food',
    'Lacticínios e queijos': 'dairy cheese product',
    'Higiene e beleza': 'hygiene product bathroom',
    'Limpeza e casa': 'cleaning product household',
    'Bebé': 'baby product care',
  }
  return catMap[category] || 'food product grocery'
}

async function searchUnsplash(query: string): Promise<string | null> {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=squarish&content_filter=high`
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    })
    if (!res.ok) {
      console.error(`  Unsplash API error: ${res.status}`)
      return null
    }
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      // Use "small" size (~400px)
      return data.results[0].urls?.small || data.results[0].urls?.regular || null
    }
  } catch (err) {
    console.error(`  Unsplash fetch error:`, err)
  }
  return null
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const ab = await res.arrayBuffer()
    return Buffer.from(ab)
  } catch {
    return null
  }
}

async function main() {
  // 1. Create bucket if not exists
  console.log('Creating storage bucket "products"...')
  const { error: bucketError } = await supabase.storage.createBucket('products', {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
  })
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Bucket error:', bucketError.message)
  } else {
    console.log('  Bucket ready.\n')
  }

  // 2. Get all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, category')
    .order('category')
    .order('name')

  if (error || !products) {
    console.error('Failed to fetch products:', error?.message)
    process.exit(1)
  }

  console.log(`Processing ${products.length} products...\n`)

  let ok = 0
  let fail = 0

  for (const product of products) {
    const query = getSearchQuery(product.name, product.category)

    // Search Unsplash
    const imageUrl = await searchUnsplash(query)
    if (!imageUrl) {
      console.log(`  ✗ ${product.name} — no Unsplash result for "${query}"`)
      fail++
      continue
    }

    // Download image
    const buffer = await downloadImage(imageUrl)
    if (!buffer) {
      console.log(`  ✗ ${product.name} — download failed`)
      fail++
      continue
    }

    // Upload to Supabase Storage
    const filePath = `${product.id}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      console.log(`  ✗ ${product.name} — upload failed: ${uploadError.message}`)
      fail++
      continue
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(filePath)
    const publicUrl = urlData.publicUrl

    // Update product
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: publicUrl })
      .eq('id', product.id)

    if (updateError) {
      console.log(`  ✗ ${product.name} — DB update failed: ${updateError.message}`)
      fail++
      continue
    }

    console.log(`  ✓ ${product.name}`)
    ok++

    // Rate limit: Unsplash free = 50 req/hour, be careful
    await new Promise((r) => setTimeout(r, 1200))
  }

  console.log(`\nDone! ${ok} uploaded, ${fail} failed.`)
}

main()
