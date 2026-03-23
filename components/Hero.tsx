import { Product } from '@/types'

export default function Hero({ products }: { products: Product[] }) {
  const featured = products.filter((p) => p.image_url).slice(0, 4)

  return (
    <section className="bg-gradient-to-b from-[#F0FDF4] to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-brand/10 text-brand text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Entrega em Praia
            </span>

            <h1 className="text-4xl sm:text-[56px] font-extrabold leading-[1.08] tracking-tight text-[#1A1A1A] mb-5">
              O seu supermercado,<br />
              <span className="text-brand">na sua porta.</span>
            </h1>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Fazemos as compras no Calu & Angela e entregamos em casa. Rapido e simples.
            </p>

            <a
              href="#catalogo"
              className="inline-flex items-center gap-2 bg-brand hover:bg-[#18a34a] text-white font-semibold px-7 py-3.5 rounded-full text-base transition-colors shadow-lg shadow-brand/20"
            >
              Ver produtos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                Pagamento na entrega
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                Seg-Sab 8h-20h
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                Sem taxas de entrega*
              </span>
            </div>
          </div>

          {/* Right — featured product grid (desktop) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 flex-shrink-0 w-[380px]">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col items-center ${
                  i === 1 ? '-rotate-2' : i === 2 ? 'rotate-1' : ''
                }`}
              >
                <div className="w-full aspect-square bg-[#F9FAFB] rounded-xl flex items-center justify-center p-3 mb-3">
                  <img src={p.image_url!} alt={p.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center line-clamp-1">{p.name}</p>
                <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">{p.price.toLocaleString('pt-PT')} CVE</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="bg-[#F0FDF4]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-center text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-10">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
            {[
              { step: '1', title: 'Escolha', desc: 'Selecione os produtos que precisa no nosso catalogo', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
              { step: '2', title: 'Nos compramos', desc: 'A nossa equipa faz as compras no Calu & Angela', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z' },
              { step: '3', title: 'Entregamos', desc: 'Receba tudo na sua porta. Pagamento na entrega.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' },
            ].map((s) => (
              <div key={s.step} className="relative text-center px-4">
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[64px] font-black text-brand/[0.06] leading-none select-none">
                  {s.step}
                </span>
                <div className="relative w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-brand/20">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
