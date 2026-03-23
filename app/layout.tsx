import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'
import Toast from '@/components/Toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
    <html lang="pt" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased bg-white text-[#1A1A1A]">
        {children}
        <WhatsAppButton />
        <Toast />
      </body>
    </html>
  )
}
