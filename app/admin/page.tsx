'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types'
import { formatCVE } from '@/lib/utils'
import AdminGuard from '@/components/AdminGuard'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shopping', 'delivering', 'delivered'] as const
const STATUS_LABELS: Record<string, string> = { pending: 'Recebida', confirmed: 'Em preparacao', shopping: 'Compras em curso', delivering: 'Chauffeur em trajeto', delivered: 'Entregue' }
const STATUS_COLORS: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', shopping: 'bg-orange-100 text-orange-800', delivering: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800' }

// --- Hardcoded data ---

const ACTIVE_TRIPS = [
  { id: 'T-001', driver: 'Carlos Mendes', phone: '+238 987 6543', from: 'Supermercado Calú', to: 'Fazenda, Praia', customer: 'Ana Silva', items: 8, total: 4250, startedAt: '10:35', estimatedArrival: '11:05', status: 'delivering' as const },
  { id: 'T-002', driver: 'João Tavares', phone: '+238 912 3456', from: 'Minipreço Palmarejo', to: 'Achada Santo António', customer: 'Pedro Lopes', items: 5, total: 2800, startedAt: '10:50', estimatedArrival: '11:20', status: 'delivering' as const },
  { id: 'T-003', driver: 'Carlos Mendes', phone: '+238 987 6543', from: 'Supermercado Feijóo', to: 'Plateau', customer: 'Maria Fernandes', items: 12, total: 7600, startedAt: '11:10', estimatedArrival: '11:40', status: 'shopping' as const },
]

const SUPERMARKETS = [
  { name: 'Supermercado Calú', zone: 'Sucupira', orders: 34, revenue: 152000, logo: '🏪', active: true },
  { name: 'Minipreço Palmarejo', zone: 'Palmarejo', orders: 28, revenue: 98500, logo: '🛒', active: true },
  { name: 'Supermercado Feijóo', zone: 'Plateau', orders: 22, revenue: 87200, logo: '🏬', active: true },
  { name: 'Casa Felicidade', zone: 'Achada', orders: 15, revenue: 54000, logo: '🛍️', active: true },
  { name: 'Fragata Supermercado', zone: 'Fazenda', orders: 8, revenue: 32000, logo: '🏪', active: false },
]

const TOP_PRODUCTS = [
  { name: 'Água Trindade 1.5L', sold: 120, revenue: 18000 },
  { name: 'Cerveja Strela 33cl', sold: 95, revenue: 19000 },
  { name: 'Leite Mimosa 1L', sold: 78, revenue: 15600 },
  { name: 'Arroz Cigala 1kg', sold: 65, revenue: 11700 },
  { name: 'Óleo Fula 1L', sold: 52, revenue: 13000 },
]

const RECENT_ACTIVITY = [
  { time: '11:12', text: 'Nova encomenda #A3F2 — Ana Silva (Fazenda)', type: 'order' },
  { time: '11:05', text: 'Carlos Mendes iniciou entrega para Fazenda', type: 'delivery' },
  { time: '10:58', text: 'Encomenda #B1C4 entregue — Pedro Lopes', type: 'success' },
  { time: '10:45', text: 'Stock baixo: Água Trindade 1.5L (3 unidades)', type: 'warning' },
  { time: '10:30', text: 'Novo cliente registado: Maria Fernandes', type: 'info' },
  { time: '10:15', text: 'Encomenda #C7D8 confirmada — Supermercado Calú', type: 'order' },
]

const FAKE_ORDERS: Order[] = [
  { id: 'a3f2b1c4-1111-4aaa-bbbb-000000000001', customer_name: 'Ana Silva', customer_phone: '+238 991 2345', customer_address: 'Fazenda, Rua 5 de Julho, nº 12', customer_id: null, items: [{ product_id: '1', name: 'Água Trindade 1.5L', price: 150, quantity: 3 }, { product_id: '2', name: 'Cerveja Strela 33cl', price: 200, quantity: 6 }, { product_id: '3', name: 'Arroz Cigala 1kg', price: 180, quantity: 2 }], total: 2010, status: 'delivering', notes: 'Tocar à campainha 2x', delivery_slot: 'manha', delivery_fee: 200, created_at: new Date().toISOString() },
  { id: 'b1c4d7e8-2222-4bbb-cccc-000000000002', customer_name: 'Pedro Lopes', customer_phone: '+238 987 1122', customer_address: 'Achada Santo António, perto da farmácia', customer_id: null, items: [{ product_id: '4', name: 'Leite Mimosa 1L', price: 200, quantity: 2 }, { product_id: '5', name: 'Pão de forma', price: 280, quantity: 1 }, { product_id: '6', name: 'Manteiga Mimosa', price: 350, quantity: 1 }], total: 1030, status: 'shopping', notes: null, delivery_slot: 'manha', delivery_fee: 200, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 'c7d8e9f0-3333-4ccc-dddd-000000000003', customer_name: 'Maria Fernandes', customer_phone: '+238 955 6789', customer_address: 'Plateau, Av. Amílcar Cabral, 3º andar', customer_id: null, items: [{ product_id: '7', name: 'Óleo Fula 1L', price: 250, quantity: 1 }, { product_id: '8', name: 'Massa Esparguete 500g', price: 120, quantity: 3 }, { product_id: '9', name: 'Atum em lata', price: 180, quantity: 4 }, { product_id: '10', name: 'Tomate pelado', price: 150, quantity: 2 }], total: 1610, status: 'confirmed', notes: 'Ligar antes de entregar', delivery_slot: 'tarde', delivery_fee: 200, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'd8e9f0a1-4444-4ddd-eeee-000000000004', customer_name: 'José Tavares', customer_phone: '+238 976 4321', customer_address: 'Palmarejo, condomínio Sol e Mar, bloco B', customer_id: null, items: [{ product_id: '11', name: 'Fraldas Dodot T3', price: 1200, quantity: 1 }, { product_id: '12', name: 'Toalhitas Dodot', price: 450, quantity: 2 }, { product_id: '13', name: 'Leite Nan 1', price: 980, quantity: 1 }], total: 3080, status: 'pending', notes: null, delivery_slot: 'tarde', delivery_fee: 0, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 'e9f0a1b2-5555-4eee-ffff-000000000005', customer_name: 'Carla Monteiro', customer_phone: '+238 912 8765', customer_address: 'Terra Branca, Rua da Escola', customer_id: null, items: [{ product_id: '14', name: 'Detergente Fairy', price: 320, quantity: 1 }, { product_id: '15', name: 'Lixívia 2L', price: 180, quantity: 1 }, { product_id: '16', name: 'Papel higiénico 12 rolos', price: 650, quantity: 1 }], total: 1350, status: 'delivered', notes: 'Deixar com o porteiro', delivery_slot: 'manha', delivery_fee: 200, created_at: new Date(Date.now() - 7200000).toISOString() },
]

const MONTHLY_STATS = {
  totalRevenue: 485000,
  totalOrders: 107,
  avgOrderValue: 4533,
  margin: 0.07,
  deliveredOrders: 89,
  cancelledOrders: 3,
  newCustomers: 24,
  returningCustomers: 45,
}

export default function AdminPage() {
  return <AdminGuard><AdminContent /></AdminGuard>
}

function AdminContent() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'dashboard' | 'orders'>('dashboard')

  useEffect(() => {
    const supabase = createClient()
    loadOrders(supabase)
    const channel = supabase.channel('admin-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders(supabase)).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadOrders(supabase?: ReturnType<typeof createClient>) {
    const sb = supabase || createClient()
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const { data } = await sb.from('orders').select('*').gte('created_at', today.toISOString()).order('created_at', { ascending: false })
    setOrders(data || []); setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    if (selected?.id === orderId) setSelected((prev) => prev ? { ...prev, status: status as Order['status'] } : null)
    loadOrders(supabase)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-[#F7F8F3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold"><span className="text-brand">NaPorta</span> <span className="text-gray-400 font-normal">Admin</span></h1>
          <div className="flex items-center gap-4">
            <a href="/admin/scan" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">Scan</a>
            <a href="/admin/products" className="text-sm text-gray-500 hover:text-green-600 transition-colors">Produtos</a>
            <button onClick={async () => { const s = createClient(); await s.auth.signOut(); router.push('/admin/login') }} className="text-sm text-gray-400 hover:text-gray-600">Sair</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          <button onClick={() => setTab('dashboard')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'dashboard' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Dashboard
          </button>
          <button onClick={() => setTab('orders')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${tab === 'orders' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Encomendas
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="absolute -top-0.5 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {tab === 'dashboard' ? <DashboardTab orders={orders} /> : <OrdersTab orders={orders} selected={selected} setSelected={setSelected} updateStatus={updateStatus} />}
    </div>
  )
}

// ==================== DASHBOARD TAB ====================

function DashboardTab({ orders }: { orders: Order[] }) {
  const todayRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const todayDelivered = orders.filter(o => o.status === 'delivered').length
  const activeTrips = ACTIVE_TRIPS.filter(t => t.status === 'delivering').length
  const profit = MONTHLY_STATS.totalRevenue * MONTHLY_STATS.margin

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Receita do mês" value={formatCVE(MONTHLY_STATS.totalRevenue)} sub={`${MONTHLY_STATS.totalOrders} encomendas`} icon="💰" color="bg-green-50 border-green-200" />
        <KPICard label="Margem (7%)" value={formatCVE(profit)} sub={`Lucro líquido estimado`} icon="📈" color="bg-emerald-50 border-emerald-200" />
        <KPICard label="Hoje" value={formatCVE(todayRevenue)} sub={`${orders.length} encomendas · ${todayDelivered} entregues`} icon="📦" color="bg-blue-50 border-blue-200" />
        <KPICard label="Entregas ativas" value={String(activeTrips)} sub={`${ACTIVE_TRIPS.length} viagens no total`} icon="🚗" color="bg-purple-50 border-purple-200" />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Ticket médio" value={formatCVE(MONTHLY_STATS.avgOrderValue)} sub="Por encomenda" icon="🎯" color="bg-orange-50 border-orange-200" />
        <KPICard label="Novos clientes" value={String(MONTHLY_STATS.newCustomers)} sub={`${MONTHLY_STATS.returningCustomers} recorrentes`} icon="👥" color="bg-indigo-50 border-indigo-200" />
        <KPICard label="Taxa de entrega" value={`${Math.round((MONTHLY_STATS.deliveredOrders / MONTHLY_STATS.totalOrders) * 100)}%`} sub={`${MONTHLY_STATS.deliveredOrders}/${MONTHLY_STATS.totalOrders} entregues`} icon="✅" color="bg-teal-50 border-teal-200" />
        <KPICard label="Cancelamentos" value={String(MONTHLY_STATS.cancelledOrders)} sub={`${((MONTHLY_STATS.cancelledOrders / MONTHLY_STATS.totalOrders) * 100).toFixed(1)}% taxa`} icon="❌" color="bg-red-50 border-red-200" />
      </div>

      {/* Active Trips */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#1A1A1A]">Viagens em curso</h2>
          <span className="text-xs text-gray-400">{ACTIVE_TRIPS.length} viagem(ns)</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVE_TRIPS.map((trip) => (
            <div key={trip.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
              {/* Status pulse */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${trip.status === 'delivering' ? 'bg-green-400 animate-pulse' : 'bg-orange-400 animate-pulse'}`} />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{trip.status === 'delivering' ? '🚗' : '🛒'}</span>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{trip.driver}</p>
                  <p className="text-[11px] text-gray-400">{trip.phone}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">●</span>
                  <div>
                    <p className="text-xs text-gray-400">Origem</p>
                    <p className="font-medium text-xs">{trip.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">●</span>
                  <div>
                    <p className="text-xs text-gray-400">Destino</p>
                    <p className="font-medium text-xs">{trip.to} — {trip.customer}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{trip.items} itens</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatCVE(trip.total)}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400">Chegada est.</p>
                  <p className="text-xs font-bold text-brand">{trip.estimatedArrival}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${trip.status === 'delivering' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                  {trip.status === 'delivering' ? 'Em trajeto' : 'Compras em curso'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Supermarkets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1A1A1A]">Supermercados parceiros</h2>
            <span className="text-xs text-gray-400">{SUPERMARKETS.filter(s => s.active).length} ativos</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {SUPERMARKETS.map((sm) => (
              <div key={sm.name} className="p-4 flex items-center gap-3">
                <span className="text-2xl">{sm.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1A1A1A] truncate">{sm.name}</p>
                    {sm.active ? (
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{sm.zone}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#1A1A1A]">{formatCVE(sm.revenue)}</p>
                  <p className="text-[11px] text-gray-400">{sm.orders} encomendas</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[#1A1A1A]">Top produtos do mês</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="p-4 flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sold} vendas</p>
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]">{formatCVE(product.revenue)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Activity Feed + Revenue breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity */}
        <section>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-3">Atividade recente</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
            {RECENT_ACTIVITY.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${act.type === 'success' ? 'bg-green-400' : act.type === 'warning' ? 'bg-yellow-400' : act.type === 'delivery' ? 'bg-purple-400' : act.type === 'order' ? 'bg-blue-400' : 'bg-gray-300'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">{act.text}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section>
          <h2 className="text-base font-bold text-[#1A1A1A] mb-3">Detalhe financeiro do mês</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <FinanceRow label="Receita bruta" value={MONTHLY_STATS.totalRevenue} bold />
            <FinanceRow label="Custo mercadoria (93%)" value={MONTHLY_STATS.totalRevenue * 0.93} negative />
            <div className="border-t border-gray-100 pt-3">
              <FinanceRow label="Margem bruta (7%)" value={MONTHLY_STATS.totalRevenue * MONTHLY_STATS.margin} bold green />
            </div>
            <FinanceRow label="Taxas de entrega cobradas" value={MONTHLY_STATS.totalOrders * 150} />
            <FinanceRow label="Custo chauffeurs (est.)" value={MONTHLY_STATS.totalOrders * 100} negative />
            <div className="border-t border-gray-100 pt-3">
              <FinanceRow label="Resultado líquido est." value={(MONTHLY_STATS.totalRevenue * MONTHLY_STATS.margin) + (MONTHLY_STATS.totalOrders * 50)} bold green />
            </div>
            <div className="bg-green-50 rounded-xl p-3 mt-2">
              <p className="text-xs text-green-700 font-medium">
                Projeção mensal: se o ritmo se mantiver, fecharemos o mês com ~{formatCVE(Math.round(((MONTHLY_STATS.totalRevenue * MONTHLY_STATS.margin) + (MONTHLY_STATS.totalOrders * 50)) * (30 / 25)))} de resultado líquido.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function KPICard({ label, value, sub, icon, color }: { label: string; value: string; sub: string; icon: string; color: string }) {
  return (
    <div className={`rounded-2xl p-4 border ${color} transition-transform hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-xl font-bold text-[#1A1A1A] leading-tight">{value}</p>
      <p className="text-[11px] text-gray-500 mt-1">{sub}</p>
    </div>
  )
}

function FinanceRow({ label, value, bold, negative, green }: { label: string; value: number; bold?: boolean; negative?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? 'font-semibold text-[#1A1A1A]' : 'text-gray-600'}`}>{label}</span>
      <span className={`text-sm ${bold ? 'font-bold' : 'font-medium'} ${green ? 'text-green-600' : negative ? 'text-red-500' : 'text-[#1A1A1A]'}`}>
        {negative ? '-' : ''}{formatCVE(Math.round(value))}
      </span>
    </div>
  )
}

// ==================== ORDERS TAB ====================

function OrdersTab({ orders, selected, setSelected, updateStatus }: { orders: Order[]; selected: Order | null; setSelected: (o: Order | null) => void; updateStatus: (id: string, s: string) => void }) {
  const allOrders = [...orders, ...FAKE_ORDERS].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const isFake = (id: string) => FAKE_ORDERS.some(o => o.id === id)

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Encomendas de hoje ({allOrders.length})</h2>
      {allOrders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Nenhuma encomenda hoje</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {allOrders.map((order) => (
              <button key={order.id} onClick={() => setSelected(order)}
                className={`w-full text-left bg-white rounded-2xl p-4 border-2 transition-all ${selected?.id === order.id ? 'border-brand shadow-md' : 'border-transparent shadow-sm'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                </div>
                <p className="font-medium text-sm">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.customer_phone}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">{order.items.length} item(s)</span>
                  <span className="font-bold text-sm">{formatCVE(order.total)}</span>
                </div>
              </button>
            ))}
          </div>
          {selected && (
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-20 border border-gray-100">
              <h3 className="font-bold text-[#1A1A1A] mb-4">Detalhes #{selected.id.slice(0, 8).toUpperCase()}</h3>
              <div className="space-y-3 mb-6">
                <div><span className="text-xs text-gray-400">Cliente</span><p className="text-sm font-medium">{selected.customer_name}</p></div>
                <div><span className="text-xs text-gray-400">Telefone</span><p className="text-sm">{selected.customer_phone}</p></div>
                <div><span className="text-xs text-gray-400">Morada</span><p className="text-sm">{selected.customer_address}</p></div>
                {selected.notes && <div><span className="text-xs text-gray-400">Notas</span><p className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded-lg">{selected.notes}</p></div>}
              </div>
              <h4 className="text-sm font-semibold mb-2">Produtos</h4>
              <ul className="space-y-2 mb-4">
                {selected.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm"><span>{item.quantity}x {item.name}</span><span className="font-medium">{formatCVE(item.price * item.quantity)}</span></li>
                ))}
              </ul>
              <div className="border-t pt-3 flex justify-between font-bold"><span>Total</span><span>{formatCVE(selected.total)}</span></div>
              <div className="mt-6">
                <p className="text-xs text-gray-400 mb-2">Alterar estado</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${selected.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
