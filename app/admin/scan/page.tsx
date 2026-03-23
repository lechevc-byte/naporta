'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminGuard from '@/components/AdminGuard'
import BarcodeScanner from '@/components/BarcodeScanner'

const CATEGORY_MAP: Record<string, string> = {
  beverages: 'Águas, sumos, refrigerantes',
  waters: 'Águas, sumos, refrigerantes',
  sodas: 'Águas, sumos, refrigerantes',
  'fruit-juices': 'Águas, sumos, refrigerantes',
  beers: 'Cervejas e vinhos',
  wines: 'Cervejas e vinhos',
  dairies: 'Lacticínios e queijos',
  cheeses: 'Lacticínios e queijos',
  milks: 'Lacticínios e queijos',
  yogurts: 'Lacticínios e queijos',
  cereals: 'Mercearia doce',
  biscuits: 'Mercearia doce',
  chocolates: 'Mercearia doce',
  snacks: 'Mercearia doce',
  sweets: 'Mercearia doce',
  'baby-foods': 'Bebé',
  'baby-milks': 'Bebé',
  hygiene: 'Higiene e beleza',
  'body-care': 'Higiene e beleza',
  cleaning: 'Limpeza e casa',
  'dishwashing': 'Limpeza e casa',
}

const OUR_CATEGORIES = [
  'Águas, sumos, refrigerantes',
  'Cervejas e vinhos',
  'Mercearia salgada',
  'Mercearia doce',
  'Lacticínios e queijos',
  'Higiene e beleza',
  'Limpeza e casa',
  'Bebé',
]

function mapCategory(offTags: string[] | undefined): string {
  if (!offTags) return 'Mercearia salgada'
  for (const tag of offTags) {
    const key = tag.replace('en:', '').replace('fr:', '')
    for (const [pattern, cat] of Object.entries(CATEGORY_MAP)) {
      if (key.includes(pattern)) return cat
    }
  }
  return 'Mercearia salgada'
}

type FormState = {
  name: string
  image_url: string
  category: string
  price: string
  unit: string
  barcode: string
}

export default function ScanPage() {
  return <AdminGuard><ScanContent /></AdminGuard>
}

function ScanContent() {
  const [scanning, setScanning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState<FormState>({ name: '', image_url: '', category: 'Mercearia salgada', price: '', unit: 'unidade', barcode: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDetected = useCallback(async (barcode: string) => {
    setScanning(false)
    setLoading(true)
    setNotFound(false)
    setForm({ name: '', image_url: '', category: 'Mercearia salgada', price: '', unit: 'unidade', barcode })

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)

      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=product_name,product_name_fr,product_name_pt,image_front_url,categories_tags`,
        { signal: controller.signal }
      )
      clearTimeout(timeout)

      if (!res.ok) throw new Error('not found')

      const data = await res.json()
      if (data.status !== 1 || !data.product) throw new Error('not found')

      const p = data.product
      const name = p.product_name_pt || p.product_name_fr || p.product_name || ''
      const image = p.image_front_url || ''
      const cat = mapCategory(p.categories_tags)

      if (!name) throw new Error('not found')

      setForm({ name, image_url: image, category: cat, price: '', unit: 'unidade', barcode })
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const supabase = createClient()
    const fileName = `scan-${Date.now()}.jpg`
    const { error } = await supabase.storage.from('products').upload(fileName, file, { contentType: file.type, upsert: true })
    if (error) { alert('Erro ao enviar foto: ' + error.message); return }

    const { data } = supabase.storage.from('products').getPublicUrl(fileName)
    setForm((f) => ({ ...f, image_url: data.publicUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(form.price)
    if (!form.name || isNaN(price) || price <= 0) return

    setLoading(true)
    const supabase = createClient()

    // If image is from OFF (external), download and store in Supabase
    let imageUrl = form.image_url
    if (imageUrl && !imageUrl.includes('supabase')) {
      try {
        const res = await fetch(imageUrl)
        if (res.ok) {
          const buf = await res.arrayBuffer()
          const fileName = `${form.barcode || Date.now()}.jpg`
          await supabase.storage.from('products').upload(fileName, new Uint8Array(buf), { contentType: 'image/jpeg', upsert: true })
          const { data } = supabase.storage.from('products').getPublicUrl(fileName)
          imageUrl = data.publicUrl
        }
      } catch {}
    }

    const { error } = await supabase.from('products').insert({
      name: form.name,
      price,
      category: form.category,
      unit: form.unit,
      barcode: form.barcode || null,
      image_url: imageUrl || null,
      in_stock: true,
    })

    setLoading(false)

    if (error) {
      if (error.message.includes('duplicate')) {
        setToast('Produto ja existe!')
      } else {
        alert('Erro: ' + error.message)
        return
      }
    } else {
      setToast('Produto adicionado!')
    }

    // Save to localStorage for offline sync
    try {
      const pending = JSON.parse(localStorage.getItem('naporta-pending-scans') || '[]')
      localStorage.setItem('naporta-pending-scans', JSON.stringify([...pending.slice(-50)]))
    } catch {}

    setTimeout(() => {
      setToast('')
      setForm({ name: '', image_url: '', category: 'Mercearia salgada', price: '', unit: 'unidade', barcode: '' })
      setNotFound(false)
      setScanning(true)
    }, 1500)
  }

  const resetToScan = () => {
    setScanning(true)
    setNotFound(false)
    setForm({ name: '', image_url: '', category: 'Mercearia salgada', price: '', unit: 'unidade', barcode: '' })
  }

  const inputClass = "w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 placeholder-gray-500"

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/admin" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Admin
          </a>
          <h1 className="text-base font-bold">
            <span className="text-green-500">NaPorta</span> Scan
          </h1>
          <button onClick={resetToScan} className="text-sm text-green-500 hover:text-green-400">
            Novo scan
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Scanner */}
        {scanning && <BarcodeScanner onDetected={handleDetected} active={scanning} />}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Manual entry button when scanning */}
        {scanning && (
          <button onClick={() => { setScanning(false); setNotFound(true) }}
            className="w-full mt-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 text-sm hover:bg-gray-700 transition-colors">
            Inserir manualmente
          </button>
        )}

        {/* Form */}
        {!scanning && !loading && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {notFound && (
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-3 text-center">
                <p className="text-yellow-400 text-sm font-medium">Produto nao encontrado</p>
                <p className="text-yellow-600 text-xs mt-0.5">Preencha manualmente</p>
              </div>
            )}

            {form.barcode && (
              <p className="text-gray-500 text-xs font-mono text-center">Barcode: {form.barcode}</p>
            )}

            {/* Image preview or capture */}
            <div className="flex items-center gap-3">
              {form.image_url ? (
                <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                  <img src={form.image_url} alt="" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              )}
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                  {form.image_url ? 'Alterar foto' : 'Tirar foto'}
                </button>
              </div>
            </div>

            {/* Name */}
            <input required placeholder="Nome do produto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />

            {/* Price + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Preco (CVE)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={inputClass}>
                <option value="unidade">Unidade</option>
                <option value="kg">Kg</option>
                <option value="litro">Litro</option>
                <option value="pacote">Pacote</option>
              </select>
            </div>

            {/* Category */}
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {OUR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetToScan}
                className="flex-1 py-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 font-medium text-base hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-xl text-white font-bold text-base transition-colors shadow-lg shadow-green-600/20">
                Adicionar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium animate-toast flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          {toast}
        </div>
      )}
    </div>
  )
}
