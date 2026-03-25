'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { formatCVE } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

const CATEGORIES = [
  'Águas, sumos, refrigerantes', 'Cervejas e vinhos', 'Mercearia salgada',
  'Mercearia doce', 'Lacticínios e queijos', 'Higiene e beleza', 'Limpeza e casa', 'Bebé',
]

const SUPERMARKETS = [
  { id: 'all', name: 'Todos', logo: '🏪' },
  { id: 'calu', name: 'Supermercado Calú', logo: '🏪' },
  { id: 'minipreco', name: 'Minipreço Palmarejo', logo: '🛒' },
  { id: 'feijoo', name: 'Supermercado Feijóo', logo: '🏬' },
  { id: 'felicidade', name: 'Casa Felicidade', logo: '🛍️' },
  { id: 'fragata', name: 'Fragata Supermercado', logo: '🏪' },
]

// Simulated mapping: product index % supermarkets (excluding 'all') to assign each product a store
function getProductStore(productIndex: number): string {
  const stores = SUPERMARKETS.filter(s => s.id !== 'all')
  return stores[productIndex % stores.length].id
}

export default function AdminProductsPage() {
  return <AdminGuard><AdminProductsContent /></AdminGuard>
}

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [newProduct, setNewProduct] = useState({ name: '', price: '', original_price: '', category: 'Mercearia salgada', unit: 'unidade', image_url: '', is_popular: false })

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    const supabase = createClient()
    const { data } = await supabase.from('products').select('*').order('category').order('name')
    setProducts(data || []); setLoading(false)
  }

  async function toggleStock(id: string, v: boolean) {
    const supabase = createClient()
    await supabase.from('products').update({ in_stock: !v }).eq('id', id)
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, in_stock: !v } : x)))
  }

  async function togglePopular(id: string, v: boolean) {
    const supabase = createClient()
    await supabase.from('products').update({ is_popular: !v }).eq('id', id)
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, is_popular: !v } : x)))
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Eliminar "${name}"?`)) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    setProducts((p) => p.filter((x) => x.id !== id))
  }

  async function saveEdit() {
    if (!editing) return
    const supabase = createClient()
    await supabase.from('products').update({
      name: editing.name,
      price: editing.price,
      original_price: editing.original_price || null,
      category: editing.category,
      unit: editing.unit,
      is_popular: editing.is_popular,
      image_url: editing.image_url,
    }).eq('id', editing.id)
    setProducts((p) => p.map((x) => (x.id === editing.id ? editing : x)))
    setEditing(null)
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(newProduct.price); if (isNaN(price)) return
    const op = newProduct.original_price ? parseFloat(newProduct.original_price) : null
    const supabase = createClient()
    await supabase.from('products').insert({
      name: newProduct.name, price, original_price: op, category: newProduct.category,
      unit: newProduct.unit, image_url: newProduct.image_url || null, in_stock: true, is_popular: newProduct.is_popular,
    })
    setNewProduct({ name: '', price: '', original_price: '', category: 'Mercearia salgada', unit: 'unidade', image_url: '', is_popular: false })
    setShowForm(false); loadProducts()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>

  const filtered = products.filter((p, i) => {
    const matchSearch = p.name.toLowerCase().includes(searchQ.toLowerCase())
    const matchStore = selectedStore === 'all' || getProductStore(i) === selectedStore
    return matchSearch && matchStore
  })
  const inputClass = "px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"

  return (
    <div className="min-h-screen bg-[#F7F8F3]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Encomendas</a>
            <a href="/admin/scan" className="text-sm text-green-600 hover:text-green-700 font-medium">Scan</a>
            <h1 className="text-lg font-bold text-[#1A1A1A]">Produtos</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditing(null) }} className="bg-green-600 text-white text-sm px-4 py-2 rounded-full hover:bg-green-700 font-medium transition-colors">+ Adicionar</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search */}
        <input placeholder="Procurar produto..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
          className="w-full mb-4 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />

        {/* Supermarket filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {SUPERMARKETS.map((sm) => {
            const count = sm.id === 'all' ? products.length : products.filter((_, i) => getProductStore(i) === sm.id).length
            return (
              <button key={sm.id} onClick={() => setSelectedStore(sm.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedStore === sm.id ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'}`}>
                <span>{sm.logo}</span>
                <span>{sm.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedStore === sm.id ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Add form */}
        {showForm && (
          <form onSubmit={addProduct} className="bg-white rounded-2xl p-5 border border-gray-100 mb-6 space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Novo produto</h3>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Nome" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`col-span-2 ${inputClass}`} />
              <input required type="number" placeholder="Preco (CVE)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className={inputClass} />
              <input type="number" placeholder="Preco original (promo)" value={newProduct.original_price} onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })} className={inputClass} />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className={inputClass}>
                <option value="unidade">Unidade</option><option value="kg">Kg</option><option value="litro">Litro</option><option value="pacote">Pacote</option>
              </select>
              <input placeholder="URL imagem" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className={inputClass} />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={newProduct.is_popular} onChange={(e) => setNewProduct({ ...newProduct, is_popular: e.target.checked })} className="w-4 h-4 accent-green-600" />
                Popular
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 font-medium">Guardar</button>
            </div>
          </form>
        )}

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-bold text-lg">Editar produto</h3>
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={`w-full ${inputClass}`} placeholder="Nome" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} className={inputClass} placeholder="Preco" />
                <input type="number" value={editing.original_price || ''} onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? +e.target.value : null })} className={inputClass} placeholder="Preco original (promo)" />
              </div>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={`w-full ${inputClass}`}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} className={`w-full ${inputClass}`}>
                <option value="unidade">Unidade</option><option value="kg">Kg</option><option value="litro">Litro</option><option value="pacote">Pacote</option>
              </select>
              <input value={editing.image_url || ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className={`w-full ${inputClass}`} placeholder="URL imagem" />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.is_popular} onChange={(e) => setEditing({ ...editing, is_popular: e.target.checked })} className="w-4 h-4 accent-green-600" />
                Popular
              </label>
              <div className="flex gap-2 justify-end pt-2">
                <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500">Cancelar</button>
                <button onClick={saveEdit} className="px-4 py-2 bg-green-600 text-white text-sm rounded-full font-medium">Guardar</button>
              </div>
            </div>
          </div>
        )}

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F8F3] border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Supermercado</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Preco</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Stock</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500 w-20">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const pIndex = products.findIndex(x => x.id === p.id)
                  const storeName = SUPERMARKETS.find(s => s.id === getProductStore(pIndex))
                  return (
                  <tr key={p.id} className={!p.in_stock ? 'opacity-40' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gray-100" />}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{p.name}</p>
                          <div className="flex gap-1 mt-0.5">
                            {p.is_popular && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">Popular</span>}
                            {p.original_price && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Promo</span>}
                            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium sm:hidden">{storeName?.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{storeName?.logo} {storeName?.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div>
                        {p.original_price && <span className="text-xs text-gray-400 line-through block">{formatCVE(p.original_price)}</span>}
                        <span className="font-medium text-[#1A1A1A]">{formatCVE(p.price)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleStock(p.id, p.in_stock)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${p.in_stock ? 'bg-green-600' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${p.in_stock ? 'translate-x-4' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditing(p)} className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Editar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => deleteProduct(p.id, p.name)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">{filtered.length} produto(s)</p>
      </main>
    </div>
  )
}
