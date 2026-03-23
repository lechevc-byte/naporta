'use client'

import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { formatCVE } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const items = useCartStore((s) => s.items)

  const outOfStock = !product.in_stock
  const cartItem = items.find((i) => i.product_id === product.id)
  const qty = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      unit: product.unit,
    })
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      className={`rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
        outOfStock ? 'opacity-40 grayscale pointer-events-none' : ''
      } ${qty > 0 ? 'ring-2 ring-green-200' : ''}`}
    >
      {/* Image — top, fixed height, NEVER side-by-side */}
      <div
        style={{ width: '100%', height: '120px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb' }} />
        )}
        {outOfStock && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            Esgotado
          </span>
        )}
      </div>

      {/* Content — below image, NEVER beside it */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          className="text-gray-900 line-clamp-2"
          style={{ fontSize: '12px', fontWeight: 500, lineHeight: 1.3, minHeight: '2rem', margin: 0 }}
        >
          {product.name}
        </h3>

        <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#111', lineHeight: 1 }}>
            {formatCVE(product.price)}
          </span>

          {!outOfStock && (
            <>
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: '#16a34a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', background: '#16a34a', borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <path d="M20 12H4" />
                    </svg>
                  </button>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'white', userSelect: 'none' }}>
                    {qty}
                  </span>
                  <button
                    onClick={handleAdd}
                    style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
