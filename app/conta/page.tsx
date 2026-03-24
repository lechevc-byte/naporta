'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { useCustomerStore } from '@/lib/store/customer'
import { formatCVE } from '@/lib/utils'
import { Order } from '@/types'

const PRAIA_ZONES = [
  'Achada Santo Antonio', 'Palmarejo', 'Plateau', 'Fazenda', 'Terra Branca',
  'Prainha', 'Achada Grande', 'Tira Chapeu', 'Varzea', 'Calabaceira',
  'Achada Sao Filipe', 'Cidadela', 'Gamboa', 'Cha de Areia', 'Quebra Canela',
]

export default function ContaPage() {
  const router = useRouter()
  const { customer, setCustomer, logout } = useCustomerStore()
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [zone, setZone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => setMounted(true), [])

  // Load orders when logged in
  useEffect(() => {
    if (!customer) return
    const supabase = createClient()
    supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customer.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setOrders(data || []))
  }, [customer])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone.trim())
      .single()

    if (err || !data) {
      setError('Numero nao encontrado. Crie uma conta.')
      setMode('register')
      setLoading(false)
      return
    }
    setCustomer(data)
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    setError('')
    const supabase = createClient()

    // Check if phone already exists
    const { data: existing } = await supabase.from('customers').select('*').eq('phone', phone.trim()).single()
    if (existing) {
      setCustomer(existing)
      setLoading(false)
      return
    }

    const { data, error: err } = await supabase
      .from('customers')
      .insert({ phone: phone.trim(), name: name.trim(), address: address.trim() || null, zone: zone || null })
      .select()
      .single()

    if (err) {
      setError('Erro ao criar conta. Tente novamente.')
      setLoading(false)
      return
    }
    setCustomer(data)
    setLoading(false)
  }

  const handleUpdateProfile = async () => {
    if (!customer) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('customers')
      .update({ name: name.trim(), address: address.trim() || null, zone: zone || null })
      .eq('id', customer.id)
      .select()
      .single()
    if (data) setCustomer(data)
    setEditingProfile(false)
    setLoading(false)
  }

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800' },
    shopping: { label: 'A comprar', color: 'bg-orange-100 text-orange-800' },
    delivering: { label: 'A entregar', color: 'bg-purple-100 text-purple-800' },
    delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
  }

  if (!mounted) return null

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 text-sm transition-all"

  // === LOGGED IN ===
  if (customer) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          {/* Profile */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setName(customer.name); setAddress(customer.address || ''); setZone(customer.zone || ''); setEditingProfile(true) }}
                  className="text-sm text-green-600 hover:underline">Editar</button>
                <button onClick={() => { logout(); router.refresh() }}
                  className="text-sm text-gray-400 hover:text-red-500">Sair</button>
              </div>
            </div>
            {customer.address && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {customer.address}{customer.zone ? `, ${customer.zone}` : ''}
              </p>
            )}
          </div>

          {/* Edit profile modal */}
          {editingProfile && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingProfile(false)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-lg">Editar perfil</h3>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className={inputClass} />
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Morada" className={inputClass} />
                <select value={zone} onChange={(e) => setZone(e.target.value)} className={inputClass}>
                  <option value="">Zona (opcional)</option>
                  {PRAIA_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
                <div className="flex gap-2 justify-end pt-2">
                  <button onClick={() => setEditingProfile(false)} className="px-4 py-2 text-sm text-gray-500">Cancelar</button>
                  <button onClick={handleUpdateProfile} disabled={loading} className="px-4 py-2 bg-green-600 text-white text-sm rounded-full font-medium">Guardar</button>
                </div>
              </div>
            </div>
          )}

          {/* Order history */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">As minhas encomendas</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Ainda nao fez nenhuma encomenda</p>
              <a href="/" className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-700">Ver produtos</a>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending
                return (
                  <a key={order.id} href={`/order/${order.id}`}
                    className="block bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{order.items.length} produto(s)</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-bold text-sm">{formatCVE(order.total)}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </main>
        <Footer />
      </>
    )
  }

  // === NOT LOGGED IN ===
  return (
    <>
      <Header />
      <main className="max-w-sm mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === 'login' ? 'Use o seu numero de telefone' : 'Rapido e simples'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input required type="tel" placeholder="Numero de telefone" value={phone}
              onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            {error && <p className="text-sm text-orange-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors">
              {loading ? 'A verificar...' : 'Entrar'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Nao tem conta?{' '}
              <button type="button" onClick={() => { setMode('register'); setError('') }} className="text-green-600 font-semibold hover:underline">
                Criar conta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input required type="text" placeholder="O seu nome" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass} />
            <input required type="tel" placeholder="Numero de telefone" value={phone}
              onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            <select value={zone} onChange={(e) => setZone(e.target.value)} className={inputClass}>
              <option value="">Zona de entrega (opcional)</option>
              {PRAIA_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
            <input type="text" placeholder="Morada completa (opcional)" value={address}
              onChange={(e) => setAddress(e.target.value)} className={inputClass} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-full transition-colors">
              {loading ? 'A criar...' : 'Criar conta'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Ja tem conta?{' '}
              <button type="button" onClick={() => { setMode('login'); setError('') }} className="text-green-600 font-semibold hover:underline">
                Entrar
              </button>
            </p>
          </form>
        )}
      </main>
      <Footer />
    </>
  )
}
