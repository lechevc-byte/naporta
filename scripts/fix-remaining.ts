import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// For the 22 remaining products, use Open Food Facts front images by barcode
// These are the "clean" front photos, not the amateur ones
const BARCODE_MAP: Record<string, string> = {
  'Fanta Laranja 33cl': '5449000011527',
  'Red Bull 25cl': '9002490100070',
  'Schweppes Tónica 33cl': '5449000004840',
  'Sprite 33cl': '5449000014535',
  '1664 Kronenbourg 33cl': '3080210001025',
  'Babybel Mini 6 unid.': '3073780528696',
  'Iogurte Danone Natural 125g': '3033490594015',
  'Leite Condensado Nestlé 397g': '7613032620998',
  'Queijo Kiri 8 porções': '3073780528696',
  'BN Chocolate 295g': '7622210449283',
  'Kinder Bueno 43g': '8000500066027',
  'Nutella 350g': '3017620422003',
  'Nutella 750g': '3017620425035',
  'Pringles Original 165g': '5053990101573',
  'Snickers 50g': '5000159461245',
  'Twix 50g': '5000159459228',
  'Doritos Nacho Cheese 170g': '5000112646979',
  'Maionese Amora 470g': '8712100863127',
  'Mostarda Maille Dijon 215g': '3036810201013',
  'Óleo de Girassol Lesieur 1L': '3021762500013',
  'Penne Panzani 500g': '3038350012500',
  'Leite Guigoz Crescimento 1L': '3033710065332',
}

async function getOFFImage(barcode: string): Promise<string | null> {
  try {
    // Use the direct image URL pattern — more reliable than the API
    const url = `https://images.openfoodfacts.org/images/products/${formatBarcode(barcode)}/front_fr.400.jpg`
    const res = await fetch(url, { method: 'HEAD' })
    if (res.ok) return url

    // Try without language
    const url2 = `https://images.openfoodfacts.org/images/products/${formatBarcode(barcode)}/front.400.jpg`
    const res2 = await fetch(url2, { method: 'HEAD' })
    if (res2.ok) return url2

    // Fallback to API
    const apiRes = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=image_front_small_url,image_front_url`)
    if (!apiRes.ok) return null
    const data = await apiRes.json()
    if (data.status !== 1) return null
    return data.product?.image_front_small_url || data.product?.image_front_url || null
  } catch { return null }
}

function formatBarcode(code: string): string {
  // OFF stores images with path like 327/016/042/2003 for 3270160422003
  if (code.length === 13) {
    return `${code.slice(0,3)}/${code.slice(3,6)}/${code.slice(6,9)}/${code.slice(9)}`
  }
  return code
}

async function main() {
  const { data: products } = await supabase.from('products').select('id, name, image_url').order('name')
  const toFix = products?.filter(p => BARCODE_MAP[p.name]) || []

  console.log(`Fixing ${toFix.length} products via OFF direct images...\n`)
  let ok = 0

  for (const product of toFix) {
    const barcode = BARCODE_MAP[product.name]
    if (!barcode) continue

    // Try OFF
    const imageUrl = await getOFFImage(barcode)
    if (!imageUrl) {
      console.log(`  ✗ ${product.name} — no OFF image`)
      continue
    }

    // Download
    const res = await fetch(imageUrl)
    if (!res.ok) {
      console.log(`  ✗ ${product.name} — download failed (${res.status})`)
      continue
    }
    const buffer = Buffer.from(await res.arrayBuffer())

    if (buffer.length < 1000) {
      console.log(`  ✗ ${product.name} — image too small (${buffer.length}b)`)
      continue
    }

    // Upload to Supabase Storage
    const { error: upErr } = await supabase.storage
      .from('products')
      .upload(`${product.id}.jpg`, buffer, { contentType: 'image/jpeg', upsert: true })
    if (upErr) {
      console.log(`  ✗ ${product.name} — upload: ${upErr.message}`)
      continue
    }

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(`${product.id}.jpg`)
    await supabase.from('products').update({ image_url: urlData.publicUrl }).eq('id', product.id)

    console.log(`  ✓ ${product.name}`)
    ok++
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nDone! ${ok}/${toFix.length} fixed.`)
}

main()
