'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { formatCVE } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

export default function AdminProductsPage() {
  return <AdminGuard><AdminProductsContent /></AdminGuard>
}

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: string } | null>(null)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Mercearia salgada', unit: 'unidade', image_url: '' })

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

  async function updatePrice(id: string, val: string) {
    const price = parseFloat(val); if (isNaN(price) || price <= 0) return
    const supabase = createClient()
    await supabase.from('products').update({ price }).eq('id', id)
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, price } : x))); setEditingPrice(null)
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(newProduct.price); if (isNaN(price)) return
    const supabase = createClient()
    await supabase.from('products').insert({ name: newProduct.name, price, category: newProduct.category, unit: newProduct.unit, image_url: newProduct.image_url || null, in_stock: true })
    setNewProduct({ name: '', price: '', category: 'Mercearia salgada', unit: 'unidade', image_url: '' }); setShowForm(false); loadProducts()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" /></div>

  const inputClass = "px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"

  return (
    <div className="min-h-screen bg-[#F7F8F3]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-gray-500 hover:text-brand transition-colors">Encomendas</a>
            <h1 className="text-lg font-bold text-[#1A1A1A]">Produtos</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-brand text-white text-sm px-4 py-2 rounded-full hover:bg-[#18a34a] font-medium transition-colors">+ Adicionar</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {showForm && (
          <form onSubmit={addProduct} className="bg-white rounded-2xl p-5 border border-gray-100 mb-6 space-y-3">
            <h3 className="font-semibold text-[#1A1A1A]">Novo produto</h3>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="Nome do produto" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`col-span-2 ${inputClass}`} />
              <input required type="number" placeholder="Preco (CVE)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className={inputClass} />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className={inputClass}>
                <option>Mercearia salgada</option><option>Mercearia doce</option><option>Aguas, sumos, refrigerantes</option>
                <option>Cervejas e vinhos</option><option>Lacticinios e queijos</option><option>Higiene e beleza</option>
                <option>Limpeza e casa</option><option>Bebe</option>
              </select>
              <select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} className={inputClass}>
                <option value="unidade">Unidade</option><option value="kg">Kg</option><option value="litro">Litro</option><option value="pacote">Pacote</option>
              </select>
              <input placeholder="URL da imagem (opcional)" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} className={inputClass} />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-brand text-white text-sm rounded-full hover:bg-[#18a34a] font-medium">Guardar</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F8F3] border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Categoria</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Preco</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className={!p.in_stock ? 'opacity-40' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gray-100" />}
                        </div>
                        <div><p className="font-medium text-[#1A1A1A]">{p.name}</p><p className="text-xs text-gray-400">{p.unit}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3 text-right">
                      {editingPrice?.id === p.id ? (
                        <input autoFocus type="number" value={editingPrice.price} onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                          onBlur={() => updatePrice(p.id, editingPrice.price)} onKeyDown={(e) => { if (e.key === 'Enter') updatePrice(p.id, editingPrice.price); if (e.key === 'Escape') setEditingPrice(null) }}
                          className="w-24 px-2 py-1 border rounded-lg text-right text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" />
                      ) : (
                        <button onClick={() => setEditingPrice({ id: p.id, price: String(p.price) })} className="font-medium text-[#1A1A1A] hover:text-brand">{formatCVE(p.price)}</button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleStock(p.id, p.in_stock)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${p.in_stock ? 'bg-brand' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${p.in_stock ? 'translate-x-4' : ''}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">{products.length} produto(s)</p>
      </main>
    </div>
  )
}
