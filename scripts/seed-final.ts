import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function getImage(barcode: string): Promise<string | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=image_front_url,image_front_small_url,image_url`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.status !== 1) return null
    return data.product?.image_front_url || data.product?.image_url || null
  } catch { return null }
}

// Products with internationally known barcodes that HAVE images on OFF
const PRODUCTS = [
  // === BEBIDAS ===
  { name: 'Coca-Cola 33cl', barcode: '5449000000996', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Coca-Cola 1.5L', barcode: '5449000214812', category: 'Bebidas', price: 250, unit: 'unidade' },
  { name: 'Coca-Cola Zero 33cl', barcode: '5449000131805', category: 'Bebidas', price: 130, unit: 'unidade' },
  { name: 'Fanta Laranja 33cl', barcode: '5449000011527', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Sprite 33cl', barcode: '5449000014535', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Pepsi 33cl', barcode: '4060800100078', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: '7UP 33cl', barcode: '5449000004154', category: 'Bebidas', price: 120, unit: 'unidade' },
  { name: 'Red Bull 25cl', barcode: '9002490100070', category: 'Bebidas', price: 350, unit: 'unidade' },
  { name: 'Evian Água Natural 1.5L', barcode: '3068320053004', category: 'Bebidas', price: 100, unit: 'unidade' },
  { name: 'Volvic Água Natural 1.5L', barcode: '3057640117008', category: 'Bebidas', price: 90, unit: 'unidade' },
  { name: 'Perrier Água com Gás 50cl', barcode: '7613035848382', category: 'Bebidas', price: 150, unit: 'unidade' },
  { name: 'San Pellegrino 50cl', barcode: '8002270018305', category: 'Bebidas', price: 160, unit: 'unidade' },
  { name: 'Lipton Ice Tea Pêssego 1.5L', barcode: '5449000040770', category: 'Bebidas', price: 250, unit: 'unidade' },
  { name: 'Schweppes Tónica 33cl', barcode: '5449000004840', category: 'Bebidas', price: 130, unit: 'unidade' },
  { name: 'Heineken Cerveja 33cl', barcode: '8714800011426', category: 'Bebidas', price: 200, unit: 'unidade' },
  { name: 'Corona Extra 35.5cl', barcode: '7501064191077', category: 'Bebidas', price: 250, unit: 'unidade' },
  { name: 'Desperados 33cl', barcode: '3155930001218', category: 'Bebidas', price: 220, unit: 'unidade' },

  // === ALIMENTAÇÃO ===
  { name: 'Barilla Spaghetti n.5 500g', barcode: '8076800195057', category: 'Alimentação', price: 200, unit: 'pacote' },
  { name: 'Barilla Penne Rigate 500g', barcode: '8076800315035', category: 'Alimentação', price: 200, unit: 'pacote' },
  { name: 'Barilla Fusilli 500g', barcode: '8076800085075', category: 'Alimentação', price: 200, unit: 'pacote' },
  { name: 'Riz Uncle Ben\'s Basmati 500g', barcode: '5410673006004', category: 'Alimentação', price: 400, unit: 'pacote' },
  { name: 'Arroz SOS Clássico 1kg', barcode: '8410128330019', category: 'Alimentação', price: 350, unit: 'kg' },
  { name: 'Azeite Bertolli Extra Virgem 500ml', barcode: '8000936600160', category: 'Alimentação', price: 650, unit: 'unidade' },
  { name: 'Ketchup Heinz 570g', barcode: '50457348', category: 'Alimentação', price: 400, unit: 'unidade' },
  { name: 'Maionese Hellmann\'s 430ml', barcode: '8714100708637', category: 'Alimentação', price: 450, unit: 'unidade' },
  { name: 'Mostarda Maille Dijon 215g', barcode: '3036810201013', category: 'Alimentação', price: 350, unit: 'unidade' },
  { name: 'Nescafé Gold 100g', barcode: '7613036716161', category: 'Alimentação', price: 650, unit: 'unidade' },
  { name: 'Nescafé Classic 200g', barcode: '7613034626844', category: 'Alimentação', price: 550, unit: 'unidade' },
  { name: 'Açúcar Daddy 1kg', barcode: '3229820100005', category: 'Alimentação', price: 180, unit: 'kg' },
  { name: 'Tabasco 60ml', barcode: '0011210000506', category: 'Alimentação', price: 300, unit: 'unidade' },
  { name: 'Molho de Soja Kikkoman 250ml', barcode: '8715035110106', category: 'Alimentação', price: 350, unit: 'unidade' },

  // === CONSERVAS ===
  { name: 'Atum Rio Mare em Azeite 80g', barcode: '8004030345669', category: 'Conservas', price: 280, unit: 'unidade' },
  { name: 'Milho Doce Bonduelle 300g', barcode: '3083680002486', category: 'Conservas', price: 200, unit: 'unidade' },
  { name: 'Ervilhas Bonduelle 400g', barcode: '3083680002288', category: 'Conservas', price: 200, unit: 'unidade' },
  { name: 'Feijão Vermelho Bonduelle 400g', barcode: '3083680002639', category: 'Conservas', price: 200, unit: 'unidade' },
  { name: 'Tomate Pelado Mutti 400g', barcode: '8005110070044', category: 'Conservas', price: 220, unit: 'unidade' },
  { name: 'Passata Mutti 700g', barcode: '8005110631108', category: 'Conservas', price: 280, unit: 'unidade' },
  { name: 'Azeitonas Verdes La Española 240g', barcode: '8410022000839', category: 'Conservas', price: 250, unit: 'unidade' },
  { name: 'Grão-de-bico Cidacos 400g', barcode: '8410022089834', category: 'Conservas', price: 180, unit: 'unidade' },

  // === LATICÍNIOS ===
  { name: 'Leite Candia Meio-gordo 1L', barcode: '3533631121014', category: 'Laticínios', price: 180, unit: 'litro' },
  { name: 'Danone Iogurte Natural 125g', barcode: '3033490594015', category: 'Laticínios', price: 100, unit: 'unidade' },
  { name: 'Activia Natural 4x125g', barcode: '3033490594107', category: 'Laticínios', price: 380, unit: 'pacote' },
  { name: 'Président Camembert 250g', barcode: '3228020481068', category: 'Laticínios', price: 500, unit: 'unidade' },
  { name: 'Laughing Cow 8 porções', barcode: '3073780969345', category: 'Laticínios', price: 350, unit: 'unidade' },
  { name: 'Leite Condensado Nestlé 397g', barcode: '7613032620998', category: 'Laticínios', price: 350, unit: 'unidade' },
  { name: 'Philadelphia Original 150g', barcode: '7622300315733', category: 'Laticínios', price: 400, unit: 'unidade' },
  { name: 'Kiri Queijo 8 porções', barcode: '3073780528696', category: 'Laticínios', price: 380, unit: 'unidade' },

  // === SNACKS ===
  { name: 'Lay\'s Classic 170g', barcode: '5000112637922', category: 'Snacks', price: 300, unit: 'pacote' },
  { name: 'Doritos Nacho Cheese 170g', barcode: '5000112646979', category: 'Snacks', price: 350, unit: 'pacote' },
  { name: 'Pringles Original 165g', barcode: '5053990101573', category: 'Snacks', price: 400, unit: 'unidade' },
  { name: 'Nutella 350g', barcode: '3017620422003', category: 'Snacks', price: 600, unit: 'unidade' },
  { name: 'Oreo Original 154g', barcode: '7622210078100', category: 'Snacks', price: 250, unit: 'pacote' },
  { name: 'Milka Chocolat au Lait 100g', barcode: '7622210007803', category: 'Snacks', price: 280, unit: 'unidade' },
  { name: 'Kinder Bueno 43g', barcode: '8000500066027', category: 'Snacks', price: 180, unit: 'unidade' },
  { name: 'KitKat 41.5g', barcode: '3800020422557', category: 'Snacks', price: 150, unit: 'unidade' },
  { name: 'M&M\'s Cacahuètes 200g', barcode: '5000159461122', category: 'Snacks', price: 400, unit: 'pacote' },
  { name: 'Haribo Goldbären 200g', barcode: '4001686301104', category: 'Snacks', price: 300, unit: 'pacote' },
  { name: 'Twix 50g', barcode: '5000159459228', category: 'Snacks', price: 150, unit: 'unidade' },
  { name: 'Snickers 50g', barcode: '5000159461245', category: 'Snacks', price: 150, unit: 'unidade' },
  { name: 'Belvita Petit-Déjeuner 400g', barcode: '7622210601650', category: 'Snacks', price: 350, unit: 'pacote' },

  // === HIGIENE ===
  { name: 'Dove Sabonete Original 100g', barcode: '8711600800137', category: 'Higiene', price: 200, unit: 'unidade' },
  { name: 'Colgate Total 75ml', barcode: '8714789710013', category: 'Higiene', price: 250, unit: 'unidade' },
  { name: 'Head & Shoulders Classic 250ml', barcode: '8001090197252', category: 'Higiene', price: 450, unit: 'unidade' },
  { name: 'Nivea Creme 150ml', barcode: '4005808001095', category: 'Higiene', price: 400, unit: 'unidade' },
  { name: 'Gillette Blue 3 (pack 6)', barcode: '7702018490653', category: 'Higiene', price: 500, unit: 'pacote' },

  // === LIMPEZA ===
  { name: 'Fairy Detergente Loiça 500ml', barcode: '8001090310231', category: 'Limpeza', price: 350, unit: 'unidade' },
  { name: 'CIF Creme 500ml', barcode: '8717644167342', category: 'Limpeza', price: 300, unit: 'unidade' },
  { name: 'Ajax Nettoyant Sol 1.25L', barcode: '8718951190955', category: 'Limpeza', price: 400, unit: 'unidade' },
  { name: 'Finish Pastilhas Máquina 30 un.', barcode: '5999109560025', category: 'Limpeza', price: 900, unit: 'pacote' },
  { name: 'Swiffer Lingettes 18 un.', barcode: '5413149462465', category: 'Limpeza', price: 500, unit: 'pacote' },
]

async function main() {
  console.log(`Testing ${PRODUCTS.length} products for images...\n`)

  const toInsert: any[] = []

  for (const p of PRODUCTS) {
    const img = await getImage(p.barcode)
    if (img) {
      console.log(`  OK  ${p.name}`)
      toInsert.push({
        name: p.name,
        image_url: img,
        barcode: p.barcode,
        category: p.category,
        price: p.price,
        unit: p.unit,
        in_stock: true,
      })
    } else {
      console.log(`  --  ${p.name} (skipped)`)
    }
    await new Promise(r => setTimeout(r, 150))
  }

  console.log(`\n${toInsert.length}/${PRODUCTS.length} products with images`)

  if (toInsert.length > 0) {
    const { error } = await supabase.from('products').insert(toInsert)
    if (error) console.error('Error:', error.message)
    else console.log('Inserted successfully!')
  }
}

main()
