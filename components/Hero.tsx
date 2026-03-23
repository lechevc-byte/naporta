export default function Hero() {
  return (
    <section className="bg-[#1A2744] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
            As suas compras do supermercado,{' '}
            <span className="text-[#FF6B35]">entregues na porta</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
            Escolha os produtos, nós vamos ao Calu & Angela fazer as suas compras e entregamos em sua casa. Simples assim.
          </p>
          <a
            href="#catalogo"
            className="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Ver produtos
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#1f3055] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-8">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold mb-1">1. Escolha</h3>
              <p className="text-sm text-gray-400">Selecione os produtos que precisa no nosso catálogo</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <h3 className="font-bold mb-1">2. Nós compramos</h3>
              <p className="text-sm text-gray-400">A nossa equipa faz as compras no Calu & Angela</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-1">3. Entregamos</h3>
              <p className="text-sm text-gray-400">Receba tudo na sua porta. Pagamento na entrega.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
