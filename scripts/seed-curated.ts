import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Fetch product image from Open Food Facts by barcode
async function getOFFImage(barcode: string): Promise<string | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=image_front_url,image_url`)
    const data = await res.json()
    if (data.status === 1) {
      const img = data.product?.image_front_url || data.product?.image_url
      if (img && !img.includes('placeholder')) return img
    }
  } catch {}
  return null
}

interface ProductDef {
  name: string
  barcode: string
  category: string
  price: number
  unit: string
}

// Curated products — typical Cape Verde supermarket (Calu & Angela style)
const PRODUCTS: ProductDef[] = [
  // === BEBIDAS ===
  { name: 'Coca-Cola 33cl', barcode: '5449000000996', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Coca-Cola 1.5L', barcode: '5449000214812', category: 'Bebidas', price: 250, unit: 'unidade' },
  { name: 'Fanta Laranja 33cl', barcode: '5449000011527', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Sprite 33cl', barcode: '5449000014535', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Água Luso 1.5L', barcode: '5601217121009', category: 'Bebidas', price: 80, unit: 'unidade' },
  { name: 'Água Luso 50cl', barcode: '5601217121108', category: 'Bebidas', price: 50, unit: 'unidade' },
  { name: 'Sagres Cerveja 33cl', barcode: '5601217122044', category: 'Bebidas', price: 180, unit: 'unidade' },
  { name: 'Super Bock 33cl', barcode: '5601843000117', category: 'Bebidas', price: 180, unit: 'unidade' },
  { name: 'Sumol Ananás 33cl', barcode: '5601217105009', category: 'Bebidas', price: 130, unit: 'unidade' },
  { name: 'Compal Manga 1L', barcode: '5601217131107', category: 'Bebidas', price: 280, unit: 'unidade' },
  { name: 'Lipton Ice Tea Pêssego 33cl', barcode: '5449000065360', category: 'Bebidas', price: 150, unit: 'unidade' },
  { name: 'Red Bull 25cl', barcode: '9002490100070', category: 'Bebidas', price: 350, unit: 'unidade' },

  // === ALIMENTAÇÃO ===
  { name: 'Arroz Cigala Agulha 1kg', barcode: '5601217000007', category: 'Alimentação', price: 350, unit: 'kg' },
  { name: 'Arroz Basmati Tio João 1kg', barcode: '7893500018520', category: 'Alimentação', price: 450, unit: 'kg' },
  { name: 'Massa Esparguete Barilla 500g', barcode: '8076800195057', category: 'Alimentação', price: 200, unit: 'pacote' },
  { name: 'Massa Penne Barilla 500g', barcode: '8076800315035', category: 'Alimentação', price: 200, unit: 'pacote' },
  { name: 'Azeite Gallo 75cl', barcode: '5601217111000', category: 'Alimentação', price: 750, unit: 'unidade' },
  { name: 'Óleo Fula Girassol 1L', barcode: '5601217120002', category: 'Alimentação', price: 350, unit: 'litro' },
  { name: 'Açúcar Sidul Branco 1kg', barcode: '5601217100004', category: 'Alimentação', price: 180, unit: 'kg' },
  { name: 'Farinha Branca Nacional 1kg', barcode: '5601217150009', category: 'Alimentação', price: 200, unit: 'kg' },
  { name: 'Sal Vatel Fino 1kg', barcode: '5601217160008', category: 'Alimentação', price: 80, unit: 'kg' },
  { name: 'Café Delta Lote Superior 250g', barcode: '5601082002309', category: 'Alimentação', price: 500, unit: 'pacote' },
  { name: 'Nescafé Classic 100g', barcode: '7613036932820', category: 'Alimentação', price: 600, unit: 'unidade' },
  { name: 'Ketchup Heinz 570g', barcode: '87157277', category: 'Alimentação', price: 400, unit: 'unidade' },
  { name: 'Maionese Hellmann\'s 430ml', barcode: '8714100708637', category: 'Alimentação', price: 450, unit: 'unidade' },
  { name: 'Mostarda Français 265g', barcode: '3250541920009', category: 'Alimentação', price: 300, unit: 'unidade' },

  // === CONSERVAS ===
  { name: 'Atum Bom Petisco em Óleo 120g', barcode: '5601010131002', category: 'Conservas', price: 250, unit: 'unidade' },
  { name: 'Sardinha Ramirez em Azeite 125g', barcode: '5601010110809', category: 'Conservas', price: 280, unit: 'unidade' },
  { name: 'Polpa de Tomate Cirio 400g', barcode: '8000320000000', category: 'Conservas', price: 150, unit: 'unidade' },
  { name: 'Milho Doce Bonduelle 300g', barcode: '3083680002486', category: 'Conservas', price: 200, unit: 'unidade' },
  { name: 'Ervilhas Bonduelle 400g', barcode: '3083680002288', category: 'Conservas', price: 200, unit: 'unidade' },
  { name: 'Feijão Vermelho Compal 845g', barcode: '5601217170007', category: 'Conservas', price: 220, unit: 'unidade' },
  { name: 'Grão-de-bico Compal 845g', barcode: '5601217170014', category: 'Conservas', price: 220, unit: 'unidade' },
  { name: 'Cogumelos Fatiados 400g', barcode: '8410205052001', category: 'Conservas', price: 250, unit: 'unidade' },

  // === LATICÍNIOS ===
  { name: 'Leite Mimosa Meio-gordo 1L', barcode: '5601217666004', category: 'Laticínios', price: 180, unit: 'litro' },
  { name: 'Leite Mimosa Gordo 1L', barcode: '5601217666011', category: 'Laticínios', price: 200, unit: 'litro' },
  { name: 'Iogurte Danone Natural 125g', barcode: '3033490594015', category: 'Laticínios', price: 100, unit: 'unidade' },
  { name: 'Queijo Flamengo Fatiado 200g', barcode: '5601217300007', category: 'Laticínios', price: 450, unit: 'unidade' },
  { name: 'Manteiga Mimosa 250g', barcode: '5601217800002', category: 'Laticínios', price: 400, unit: 'unidade' },
  { name: 'Leite Condensado Nestlé 397g', barcode: '7613031526543', category: 'Laticínios', price: 350, unit: 'unidade' },
  { name: 'Natas Mimosa 200ml', barcode: '5601217700005', category: 'Laticínios', price: 250, unit: 'unidade' },

  // === SNACKS ===
  { name: 'Batatas Fritas Lay\'s Original 170g', barcode: '5000112637922', category: 'Snacks', price: 300, unit: 'pacote' },
  { name: 'Doritos Queijo 150g', barcode: '5000112646979', category: 'Snacks', price: 350, unit: 'pacote' },
  { name: 'Oreo Original 154g', barcode: '7622210078100', category: 'Snacks', price: 250, unit: 'pacote' },
  { name: 'Nutella 350g', barcode: '3017620422003', category: 'Snacks', price: 600, unit: 'unidade' },
  { name: 'Chocolate Milka Leite 100g', barcode: '7622210007803', category: 'Snacks', price: 280, unit: 'unidade' },
  { name: 'Bolachas Maria Nacional 200g', barcode: '5601217400004', category: 'Snacks', price: 150, unit: 'pacote' },
  { name: 'Pringles Original 165g', barcode: '5053990101573', category: 'Snacks', price: 400, unit: 'unidade' },
  { name: 'M&M\'s Amendoim 200g', barcode: '5000159461122', category: 'Snacks', price: 350, unit: 'pacote' },

  // === HIGIENE ===
  { name: 'Sabonete Dove Original 100g', barcode: '8711600800137', category: 'Higiene', price: 200, unit: 'unidade' },
  { name: 'Shampoo Pantene 400ml', barcode: '8001090605696', category: 'Higiene', price: 500, unit: 'unidade' },
  { name: 'Pasta de Dentes Colgate 75ml', barcode: '8718951080829', category: 'Higiene', price: 250, unit: 'unidade' },
  { name: 'Desodorizante Rexona 200ml', barcode: '8717163712399', category: 'Higiene', price: 350, unit: 'unidade' },
  { name: 'Papel Higiénico Renova 12 rolos', barcode: '5601028013508', category: 'Higiene', price: 600, unit: 'pacote' },

  // === LIMPEZA ===
  { name: 'Lixívia Neoblanc 2L', barcode: '5601217900000', category: 'Limpeza', price: 250, unit: 'unidade' },
  { name: 'Detergente Fairy Loiça 500ml', barcode: '8001090310231', category: 'Limpeza', price: 350, unit: 'unidade' },
  { name: 'Skip Líquido Máquina 1.25L', barcode: '8710847907883', category: 'Limpeza', price: 800, unit: 'unidade' },
  { name: 'CIF Creme Limpeza 500ml', barcode: '8717644167342', category: 'Limpeza', price: 300, unit: 'unidade' },
  { name: 'Amaciador Comfort 1.5L', barcode: '8717163741481', category: 'Limpeza', price: 500, unit: 'unidade' },
]

async function main() {
  console.log(`Seeding ${PRODUCTS.length} curated products...\n`)

  const results: {
    name: string
    image_url: string | null
    barcode: string
    category: string
    price: number
    unit: string
    in_stock: boolean
  }[] = []

  let good = 0
  let noImage = 0

  for (const p of PRODUCTS) {
    const image = await getOFFImage(p.barcode)

    if (image) {
      console.log(`  ✓ ${p.name}`)
      good++
    } else {
      console.log(`  ✗ ${p.name} (no image — skipped)`)
      noImage++
      continue // Skip products without a good image
    }

    results.push({
      name: p.name,
      image_url: image,
      barcode: p.barcode,
      category: p.category,
      price: p.price,
      unit: p.unit,
      in_stock: true, // All in stock for demo
    })

    // Be nice to the API
    await new Promise((r) => setTimeout(r, 200))
  }

  console.log(`\n${good} with images, ${noImage} skipped`)
  console.log(`Inserting ${results.length} products...\n`)

  const { error } = await supabase.from('products').insert(results)
  if (error) {
    console.error('Insert error:', error.message)
  } else {
    console.log('Done! All products inserted.')
  }
}

main()
