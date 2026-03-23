import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-[#FF6B35] mb-4">404</h1>
        <p className="text-lg text-[#1A2744] font-semibold mb-2">Página não encontrada</p>
        <p className="text-sm text-gray-500 mb-8">A página que procura não existe.</p>
        <Link
          href="/"
          className="inline-block bg-[#FF6B35] hover:bg-[#e55a25] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
