import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import CatalogSection from '@/components/CatalogSection'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  const p = products || []
  const featured = p.filter((x) => x.image_url).slice(0, 4)

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
              Entrega em Praia
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-5">
              O seu supermercado,
              <br />
              <span className="text-green-600">na sua porta.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Fazemos as compras no Calu & Angela e entregamos em sua casa. Rapido e simples.
            </p>
            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full text-base transition-colors shadow-lg shadow-green-600/25"
            >
              Ver produtos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mt-8 text-sm text-gray-500">
              {['Pagamento na entrega', 'Seg-Sab 8h-20h', 'Sem taxas de entrega'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Featured products grid — desktop only */}
          <div className="hidden lg:grid grid-cols-2 gap-4 w-[360px] flex-shrink-0">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-4 shadow-xl border border-gray-100 ${
                  i === 1 ? '-rotate-2' : i === 2 ? 'rotate-1' : ''
                }`}
              >
                <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-3 mb-2">
                  <img src={p.image_url!} alt={p.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-xs font-medium text-gray-700 line-clamp-1">{p.name}</p>
                <p className="text-sm font-extrabold text-gray-900">{p.price.toLocaleString('pt-PT')} CVE</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ── */}
      <section className="bg-green-50/60 border-y border-green-100/50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-center text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-10">
            Como funciona
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { n: '1', title: 'Escolha', desc: 'Selecione os produtos que precisa no nosso catalogo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { n: '2', title: 'Nos compramos', desc: 'A nossa equipa faz as compras no Calu & Angela', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
              { n: '3', title: 'Entregamos', desc: 'Receba tudo na sua porta. Pagamento na entrega.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' },
            ].map((s) => (
              <div key={s.n} className="relative text-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[72px] font-black text-green-600/[0.06] leading-none select-none pointer-events-none">
                  {s.n}
                </span>
                <div className="relative w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-600/20">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalogue ── */}
      <main id="catalogo" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
          Catalogo
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Precos em escudos cabo-verdianos (CVE)
        </p>
        <CatalogSection products={p} />
      </main>

      <Footer />
    </>
  )
}
