import type { Metadata } from 'next'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import Toast from '@/components/Toast'

export const metadata: Metadata = {
  title: 'NaPorta — Compras ao domicílio em Praia, Cabo Verde',
  description: 'Fazemos as suas compras no supermercado Calu & Angela e entregamos na sua porta. Praia, Cabo Verde.',
  openGraph: {
    title: 'NaPorta — Compras ao domicílio',
    description: 'O seu supermercado online em Praia. Entrega ao domicílio.',
    locale: 'pt_CV',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
        <WhatsAppButton />
        <Toast />
      </body>
    </html>
  )
}
