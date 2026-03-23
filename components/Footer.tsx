export default function Footer() {
  return (
    <footer className="bg-[#1A2744] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-extrabold mb-2">
              Na<span className="text-[#FF6B35]">Porta</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fazemos as suas compras no supermercado e entregamos na sua porta. Praia, Cabo Verde.
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">
              Informações
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Zona de entrega: Praia</li>
              <li>Horário: Seg-Sáb, 8h-20h</li>
              <li>Pagamento na entrega</li>
              <li>Supermercado: Calu & Angela</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-400">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="https://wa.me/2389000000" className="hover:text-[#FF6B35] transition-colors">
                  WhatsApp: +238 900 0000
                </a>
              </li>
              <li>
                <a href="mailto:info@naporta.cv" className="hover:text-[#FF6B35] transition-colors">
                  info@naporta.cv
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} NaPorta. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
