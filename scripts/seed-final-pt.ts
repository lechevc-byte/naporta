import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Try barcode first, then keyword search
async function findImage(barcode: string | null, searchQuery: string): Promise<string | null> {
  // Try barcode
  if (barcode) {
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=image_front_url`)
      const data = await res.json()
      if (data.status === 1 && data.product?.image_front_url) return data.product.image_front_url
    } catch {}
  }
  // Try search
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&json=1&page_size=5&fields=image_front_url`
    const res = await fetch(url)
    const data = await res.json()
    const found = data.products?.find((p: any) => p.image_front_url)
    if (found) return found.image_front_url
  } catch {}
  return null
}

function rp(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

// All products with Portuguese names, Houra-style categories
const PRODUCTS = [
  // === Águas, sumos, refrigerantes ===
  { name: 'Coca-Cola Lata 33cl', search: 'coca cola 330ml', barcode: '5449000000996', category: 'Águas, sumos, refrigerantes', price: [100, 140], unit: 'unidade' },
  { name: 'Coca-Cola Garrafa 1.5L', search: 'coca cola 1.5L', barcode: '5449000214812', category: 'Águas, sumos, refrigerantes', price: [220, 280], unit: 'unidade' },
  { name: 'Coca-Cola Zero 33cl', search: 'coca cola zero 330', barcode: '5449000131805', category: 'Águas, sumos, refrigerantes', price: [110, 150], unit: 'unidade' },
  { name: 'Fanta Laranja 33cl', search: 'fanta orange 330ml', barcode: '5449000011527', category: 'Águas, sumos, refrigerantes', price: [100, 140], unit: 'unidade' },
  { name: 'Sprite 33cl', search: 'sprite 330ml', barcode: '5449000014535', category: 'Águas, sumos, refrigerantes', price: [100, 140], unit: 'unidade' },
  { name: 'Pepsi Lata 33cl', search: 'pepsi 330ml can', barcode: '4060800100078', category: 'Águas, sumos, refrigerantes', price: [100, 140], unit: 'unidade' },
  { name: 'Red Bull 25cl', search: 'red bull 250ml', barcode: '9002490100070', category: 'Águas, sumos, refrigerantes', price: [300, 400], unit: 'unidade' },
  { name: 'Água Cristaline 1.5L', search: 'cristaline eau 1.5', barcode: '3274080005003', category: 'Águas, sumos, refrigerantes', price: [50, 80], unit: 'unidade' },
  { name: 'Perrier Água com Gás 50cl', search: 'perrier sparkling 500ml', barcode: '7613035848382', category: 'Águas, sumos, refrigerantes', price: [130, 180], unit: 'unidade' },
  { name: 'Tropicana Sumo Laranja 1L', search: 'tropicana orange 1L', barcode: '5410188031072', category: 'Águas, sumos, refrigerantes', price: [300, 400], unit: 'unidade' },
  { name: 'Lipton Ice Tea Pêssego 1.5L', search: 'lipton ice tea peach', barcode: '5449000040770', category: 'Águas, sumos, refrigerantes', price: [200, 280], unit: 'unidade' },
  { name: 'Schweppes Tónica 33cl', search: 'schweppes tonic 330', barcode: '5449000004840', category: 'Águas, sumos, refrigerantes', price: [120, 160], unit: 'unidade' },
  { name: 'Oasis Tropical 1L', search: 'oasis tropical 1L', barcode: '3124480186805', category: 'Águas, sumos, refrigerantes', price: [180, 250], unit: 'unidade' },

  // === Cervejas e vinhos ===
  { name: 'Heineken Cerveja 33cl', search: 'heineken 330ml', barcode: '8714800011426', category: 'Cervejas e vinhos', price: [180, 250], unit: 'unidade' },
  { name: 'Corona Extra 35.5cl', search: 'corona extra beer', barcode: '7501064191077', category: 'Cervejas e vinhos', price: [220, 300], unit: 'unidade' },
  { name: 'Desperados 33cl', search: 'desperados tequila beer', barcode: '3155930001218', category: 'Cervejas e vinhos', price: [200, 260], unit: 'unidade' },
  { name: 'Leffe Blonde 33cl', search: 'leffe blonde 330', barcode: '5410228142133', category: 'Cervejas e vinhos', price: [220, 300], unit: 'unidade' },
  { name: '1664 Kronenbourg 33cl', search: '1664 kronenbourg 330ml', barcode: '3080210001025', category: 'Cervejas e vinhos', price: [160, 220], unit: 'unidade' },

  // === Mercearia salgada ===
  { name: 'Esparguete Barilla nº5 500g', search: 'barilla spaghetti n5', barcode: '8076800195057', category: 'Mercearia salgada', price: [180, 240], unit: 'pacote' },
  { name: 'Penne Panzani 500g', search: 'panzani penne 500g', barcode: '3038350012500', category: 'Mercearia salgada', price: [160, 220], unit: 'pacote' },
  { name: 'Fusilli Barilla 500g', search: 'barilla fusilli 500', barcode: '8076800085075', category: 'Mercearia salgada', price: [180, 240], unit: 'pacote' },
  { name: 'Arroz Basmati Uncle Ben\'s 500g', search: 'uncle bens basmati 500', barcode: '5410673006004', category: 'Mercearia salgada', price: [380, 480], unit: 'pacote' },
  { name: 'Arroz Thai Taureau Ailé 1kg', search: 'taureau aile riz thai', barcode: '3021762500044', category: 'Mercearia salgada', price: [450, 550], unit: 'kg' },
  { name: 'Ketchup Heinz 570g', search: 'heinz tomato ketchup', barcode: '50457348', category: 'Mercearia salgada', price: [350, 430], unit: 'unidade' },
  { name: 'Maionese Amora 470g', search: 'amora mayonnaise', barcode: '8712100863127', category: 'Mercearia salgada', price: [320, 420], unit: 'unidade' },
  { name: 'Mostarda Maille Dijon 215g', search: 'maille moutarde dijon', barcode: '3036810201013', category: 'Mercearia salgada', price: [260, 350], unit: 'unidade' },
  { name: 'Molho Tabasco 60ml', search: 'tabasco pepper sauce', barcode: '0011210000506', category: 'Mercearia salgada', price: [280, 360], unit: 'unidade' },
  { name: 'Molho de Soja Kikkoman 250ml', search: 'kikkoman soy sauce 250', barcode: '8715035110106', category: 'Mercearia salgada', price: [300, 400], unit: 'unidade' },
  { name: 'Azeite Puget Extra Virgem 75cl', search: 'puget huile olive extra vierge', barcode: '3116430060037', category: 'Mercearia salgada', price: [550, 750], unit: 'unidade' },
  { name: 'Óleo de Girassol Lesieur 1L', search: 'lesieur huile tournesol', barcode: '3021762500013', category: 'Mercearia salgada', price: [300, 420], unit: 'litro' },
  { name: 'Passata de Tomate Mutti 700g', search: 'mutti passata 700', barcode: '8005110631108', category: 'Mercearia salgada', price: [250, 330], unit: 'unidade' },
  { name: 'Milho Doce Bonduelle 300g', search: 'bonduelle mais doux', barcode: '3083680002486', category: 'Mercearia salgada', price: [160, 220], unit: 'unidade' },
  { name: 'Ervilhas Bonduelle 400g', search: 'bonduelle petits pois', barcode: '3083680002288', category: 'Mercearia salgada', price: [160, 220], unit: 'unidade' },
  { name: 'Atum Rio Mare em Azeite 80g', search: 'rio mare tuna', barcode: '8004030345669', category: 'Mercearia salgada', price: [250, 330], unit: 'unidade' },
  { name: 'Atum Rio Mare Natural 80g', search: 'rio mare tonno naturale', barcode: '8004030345676', category: 'Mercearia salgada', price: [240, 320], unit: 'unidade' },
  { name: 'Doritos Nacho Cheese 170g', search: 'doritos nacho cheese', barcode: '5000112646979', category: 'Mercearia salgada', price: [300, 400], unit: 'pacote' },
  { name: 'Batatas Lay\'s Clássicas 145g', search: 'lays classic chips', barcode: '5000112637922', category: 'Mercearia salgada', price: [280, 370], unit: 'pacote' },

  // === Mercearia doce ===
  { name: 'Nutella 350g', search: 'nutella 350g', barcode: '3017620422003', category: 'Mercearia doce', price: [500, 650], unit: 'unidade' },
  { name: 'Nutella 750g', search: 'nutella 750g', barcode: '3017620425035', category: 'Mercearia doce', price: [800, 1000], unit: 'unidade' },
  { name: 'Nescafé Classic 200g', search: 'nescafe classic 200', barcode: '7613034626844', category: 'Mercearia doce', price: [500, 650], unit: 'unidade' },
  { name: 'Nesquik Chocolate 400g', search: 'nesquik 400g', barcode: '3033710074624', category: 'Mercearia doce', price: [400, 520], unit: 'unidade' },
  { name: 'Compota Bonne Maman Morango 370g', search: 'bonne maman fraise', barcode: '3045320001631', category: 'Mercearia doce', price: [380, 480], unit: 'unidade' },
  { name: 'Compota Bonne Maman Alperce 370g', search: 'bonne maman abricot', barcode: '3045320001624', category: 'Mercearia doce', price: [380, 480], unit: 'unidade' },
  { name: 'Açúcar Béghin Say 1kg', search: 'beghin say sucre 1kg', barcode: '3700290300104', category: 'Mercearia doce', price: [160, 220], unit: 'kg' },
  { name: 'Chá Lipton Yellow Label 25 saq.', search: 'lipton yellow label 25', barcode: '8722700055525', category: 'Mercearia doce', price: [250, 350], unit: 'unidade' },
  { name: 'Chá Twinings Earl Grey 25 saq.', search: 'twinings earl grey 25', barcode: '70177010621', category: 'Mercearia doce', price: [350, 450], unit: 'unidade' },
  { name: 'KitKat 41.5g', search: 'kitkat 41.5', barcode: '3800020422557', category: 'Mercearia doce', price: [130, 180], unit: 'unidade' },
  { name: 'Chocolate Milka Leite 100g', search: 'milka alpine milk 100g', barcode: '7622210007803', category: 'Mercearia doce', price: [250, 340], unit: 'unidade' },
  { name: 'Kinder Bueno 43g', search: 'kinder bueno', barcode: '8000500066027', category: 'Mercearia doce', price: [150, 210], unit: 'unidade' },
  { name: 'Oreo Original 154g', search: 'oreo original 154', barcode: '7622210078100', category: 'Mercearia doce', price: [200, 290], unit: 'pacote' },
  { name: 'Pringles Original 165g', search: 'pringles original 165', barcode: '5053990101573', category: 'Mercearia doce', price: [350, 440], unit: 'unidade' },
  { name: 'Haribo Ursinhos de Ouro 200g', search: 'haribo goldbaren 200', barcode: '4001686301104', category: 'Mercearia doce', price: [220, 310], unit: 'pacote' },
  { name: 'M&M\'s Amendoim 200g', search: 'mms peanut 200g', barcode: '5000159461122', category: 'Mercearia doce', price: [320, 400], unit: 'pacote' },
  { name: 'Snickers 50g', search: 'snickers 50g', barcode: '5000159461245', category: 'Mercearia doce', price: [130, 170], unit: 'unidade' },
  { name: 'Twix 50g', search: 'twix 50g', barcode: '5000159459228', category: 'Mercearia doce', price: [130, 170], unit: 'unidade' },
  { name: 'BN Chocolate 295g', search: 'bn biscuit chocolat', barcode: '7622210449283', category: 'Mercearia doce', price: [220, 300], unit: 'pacote' },
  { name: 'Bolachas Belvita Pequeno-almoço 400g', search: 'belvita breakfast', barcode: '7622210601650', category: 'Mercearia doce', price: [300, 380], unit: 'pacote' },

  // === Lacticínios e queijos ===
  { name: 'Iogurte Danone Natural 125g', search: 'danone nature 125', barcode: '3033490594015', category: 'Lacticínios e queijos', price: [80, 130], unit: 'unidade' },
  { name: 'Queijo Camembert Président 250g', search: 'president camembert 250', barcode: '3228020481068', category: 'Lacticínios e queijos', price: [420, 540], unit: 'unidade' },
  { name: 'Queijo Creme Philadelphia 150g', search: 'philadelphia original 150', barcode: '7622300315733', category: 'Lacticínios e queijos', price: [350, 440], unit: 'unidade' },
  { name: 'A Vaca que Ri 16 porções', search: 'vache qui rit 16', barcode: '3073780969345', category: 'Lacticínios e queijos', price: [350, 450], unit: 'unidade' },
  { name: 'Queijo Kiri 8 porções', search: 'kiri 8 portions', barcode: '3073780528696', category: 'Lacticínios e queijos', price: [300, 400], unit: 'unidade' },
  { name: 'Babybel Mini 6 unid.', search: 'babybel mini 6', barcode: '3073780526074', category: 'Lacticínios e queijos', price: [380, 480], unit: 'unidade' },
  { name: 'Manteiga Président 250g', search: 'president beurre 250g', barcode: '3228021170039', category: 'Lacticínios e queijos', price: [380, 480], unit: 'unidade' },
  { name: 'Leite Condensado Nestlé 397g', search: 'nestle lait concentre sucre', barcode: '7613032620998', category: 'Lacticínios e queijos', price: [300, 380], unit: 'unidade' },
  { name: 'Natas Elle & Vire 20cl', search: 'elle vire creme', barcode: '3451790013416', category: 'Lacticínios e queijos', price: [250, 350], unit: 'unidade' },

  // === Higiene e beleza ===
  { name: 'Sabonete Dove Original 100g', search: 'dove beauty bar 100', barcode: '8711600800137', category: 'Higiene e beleza', price: [180, 260], unit: 'unidade' },
  { name: 'Pasta Dental Colgate Total 75ml', search: 'colgate total 75ml', barcode: '8714789710013', category: 'Higiene e beleza', price: [220, 310], unit: 'unidade' },
  { name: 'Creme Nivea 150ml', search: 'nivea creme 150ml', barcode: '4005808001095', category: 'Higiene e beleza', price: [380, 480], unit: 'unidade' },
  { name: 'Champô Head & Shoulders 250ml', search: 'head shoulders classic 250', barcode: '8001090197252', category: 'Higiene e beleza', price: [400, 530], unit: 'unidade' },
  { name: 'Gel Duche Palmolive 250ml', search: 'palmolive shower gel', barcode: '8714789613956', category: 'Higiene e beleza', price: [250, 350], unit: 'unidade' },
  { name: 'Desodorizante Rexona 200ml', search: 'rexona deodorant 200ml', barcode: '8717163712399', category: 'Higiene e beleza', price: [300, 400], unit: 'unidade' },

  // === Limpeza e casa ===
  { name: 'Detergente Fairy Loiça 500ml', search: 'fairy original 500ml dish', barcode: '8001090310231', category: 'Limpeza e casa', price: [300, 400], unit: 'unidade' },
  { name: 'Pastilhas Finish Tudo-em-1 30un.', search: 'finish all in 1 30', barcode: '5999109560025', category: 'Limpeza e casa', price: [750, 950], unit: 'pacote' },
  { name: 'Detergente Skip Líquido 1.25L', search: 'skip liquid detergent', barcode: '8710847907883', category: 'Limpeza e casa', price: [650, 850], unit: 'unidade' },
  { name: 'Spray Mr. Proper Multiusos', search: 'mr propre spray', barcode: '8001090757395', category: 'Limpeza e casa', price: [300, 420], unit: 'unidade' },
  { name: 'Limpeza WC Harpic 750ml', search: 'harpic wc 750ml', barcode: '3059940006969', category: 'Limpeza e casa', price: [280, 380], unit: 'unidade' },
  { name: 'Esponjas Scotch-Brite 3un.', search: 'scotch brite sponge', barcode: '3134726068204', category: 'Limpeza e casa', price: [200, 280], unit: 'pacote' },

  // === Bebé ===
  { name: 'Fraldas Pampers Baby-Dry T4 46un.', search: 'pampers baby dry taille 4', barcode: '8001841747484', category: 'Bebé', price: [1400, 1800], unit: 'pacote' },
  { name: 'Compota Blédina Maçã 4x130g', search: 'bledina compote pomme', barcode: '3041090028830', category: 'Bebé', price: [280, 380], unit: 'pacote' },
  { name: 'Leite Guigoz Crescimento 1L', search: 'guigoz croissance', barcode: '3033710065332', category: 'Bebé', price: [450, 600], unit: 'unidade' },
]

async function main() {
  console.log(`Seeding ${PRODUCTS.length} products (PT names, verified images)...\n`)

  const toInsert: any[] = []
  let ok = 0, skip = 0

  for (const p of PRODUCTS) {
    const img = await findImage(p.barcode, p.search)
    if (img) {
      ok++
      process.stdout.write(`  ✓ ${p.name}\n`)
      toInsert.push({
        name: p.name,
        image_url: img,
        barcode: p.barcode,
        category: p.category,
        price: rp(p.price[0], p.price[1]),
        unit: p.unit,
        in_stock: true,
      })
    } else {
      skip++
      process.stdout.write(`  ✗ ${p.name}\n`)
    }
    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n${ok} OK, ${skip} skipped`)

  // Show by category
  const cats: Record<string, number> = {}
  toInsert.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1)
  console.log('\nPar catégorie:')
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`))

  // Deduplicate barcodes
  const seen = new Set<string>()
  const unique = toInsert.filter(p => {
    if (!p.barcode) return true
    if (seen.has(p.barcode)) return false
    seen.add(p.barcode)
    return true
  })

  console.log(`\nInserting ${unique.length} unique products...`)
  for (let i = 0; i < unique.length; i += 25) {
    const batch = unique.slice(i, i + 25)
    const { error } = await supabase.from('products').insert(batch)
    if (error) console.error(`  Batch ${Math.floor(i/25)+1} error:`, error.message)
    else console.log(`  Batch ${Math.floor(i/25)+1}: ${batch.length} inserted`)
  }
  console.log('\nTerminé!')
}

main()
