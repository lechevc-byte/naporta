import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-brand mb-4">404</h1>
        <p className="text-lg text-[#1A1A1A] font-semibold mb-2">Pagina nao encontrada</p>
        <p className="text-sm text-gray-400 mb-8">A pagina que procura nao existe.</p>
        <Link href="/" className="inline-block bg-brand hover:bg-[#18a34a] text-white font-semibold px-6 py-3 rounded-full transition-colors">
          Voltar ao inicio
        </Link>
      </div>
    </div>
  )
}
