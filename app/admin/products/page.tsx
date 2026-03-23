'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types'
import { formatCVE } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminProductsContent />
    </AdminGuard>
  )
}

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPrice, setEditingPrice] = useState<{ id: string; price: string } | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Alimentação',
    unit: 'unidade',
    image_url: '',
  })

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('name')
    setProducts(data || [])
    setLoading(false)
  }

  async function toggleStock(id: string, currentValue: boolean) {
    const supabase = createClient()
    await supabase.from('products').update({ in_stock: !currentValue }).eq('id', id)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, in_stock: !currentValue } : p))
    )
  }

  async function updatePrice(id: string, newPrice: string) {
    const price = parseFloat(newPrice)
    if (isNaN(price) || price <= 0) return
    const supabase = createClient()
    await supabase.from('products').update({ price }).eq('id', id)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price } : p))
    )
    setEditingPrice(null)
  }

  async function addProduct(e: React.FormEvent) {
    e.preventDefault()
    const price = parseFloat(newProduct.price)
    if (isNaN(price)) return

    const supabase = createClient()
    await supabase.from('products').insert({
      name: newProduct.name,
      price,
      category: newProduct.category,
      unit: newProduct.unit,
      image_url: newProduct.image_url || null,
      in_stock: true,
    })

    setNewProduct({ name: '', price: '', category: 'Alimentação', unit: 'unidade', image_url: '' })
    setShowForm(false)
    loadProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1A2744] text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-sm text-gray-300 hover:text-white">
              Encomendas
            </a>
            <h1 className="text-lg font-bold">
              <span className="text-[#FF6B35]">Produtos</span>
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#FF6B35] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#e55a25]"
          >
            + Adicionar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Add product form */}
        {showForm && (
          <form onSubmit={addProduct} className="bg-white rounded-xl p-4 shadow-sm mb-6 space-y-3">
            <h3 className="font-semibold text-[#1A2744]">Novo produto</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Nome do produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="col-span-2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <input
                required
                type="number"
                placeholder="Preço (CVE)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option>Alimentação</option>
                <option>Bebidas</option>
                <option>Limpeza</option>
                <option>Higiene</option>
                <option>Laticínios</option>
                <option>Snacks</option>
                <option>Conservas</option>
              </select>
              <select
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              >
                <option value="unidade">Unidade</option>
                <option value="kg">Kg</option>
                <option value="litro">Litro</option>
                <option value="pacote">Pacote</option>
              </select>
              <input
                placeholder="URL da imagem (opcional)"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6B35] text-white text-sm rounded-lg hover:bg-[#e55a25]"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Produto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Categoria</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Preço</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-500">Em stock</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className={!product.in_stock ? 'opacity-50' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-right">
                      {editingPrice?.id === product.id ? (
                        <input
                          autoFocus
                          type="number"
                          value={editingPrice.price}
                          onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                          onBlur={() => updatePrice(product.id, editingPrice.price)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updatePrice(product.id, editingPrice.price)
                            if (e.key === 'Escape') setEditingPrice(null)
                          }}
                          className="w-24 px-2 py-1 border rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                        />
                      ) : (
                        <button
                          onClick={() => setEditingPrice({ id: product.id, price: String(product.price) })}
                          className="font-medium text-[#1A2744] hover:text-[#FF6B35]"
                        >
                          {formatCVE(product.price)}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStock(product.id, product.in_stock)}
                        className={`relative w-10 h-6 rounded-full transition-colors ${
                          product.in_stock ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            product.in_stock ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {products.length} produto(s)
        </p>
      </main>
    </div>
  )
}
