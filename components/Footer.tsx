export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-extrabold text-green-500 mb-2">NaPorta</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Fazemos as suas compras no supermercado e entregamos na sua porta. Praia, Cabo Verde.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Informacoes</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Zona de entrega: Praia</li>
              <li>Horario: Seg-Sab, 8h-20h</li>
              <li>Pagamento na entrega</li>
              <li>Supermercado: Calu & Angela</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://wa.me/2389000000" className="hover:text-green-400 transition-colors">WhatsApp: +238 900 0000</a></li>
              <li><a href="mailto:info@naporta.cv" className="hover:text-green-400 transition-colors">info@naporta.cv</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} NaPorta. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
