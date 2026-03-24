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
  const hasPromo = product.original_price && product.original_price > product.price
  const discount = hasPromo ? Math.round((1 - product.price / product.original_price!) * 100) : 0

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
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      border: qty > 0 ? '2px solid #86efac' : '1px solid #f0f0f0',
      backgroundColor: '#fff',
      opacity: outOfStock ? 0.4 : 1,
      filter: outOfStock ? 'grayscale(1)' : 'none',
      pointerEvents: outOfStock ? 'none' as const : 'auto' as const,
    }}>
      {/* Image */}
      <div style={{
        width: '100%',
        height: '130px',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ maxHeight: '110px', maxWidth: '90%', objectFit: 'contain' }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb' }} />
        )}

        {/* Badge promo — top left */}
        {hasPromo && (
          <span style={{ position: 'absolute', top: 6, left: 6, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span style={{ position: 'absolute', top: 6, left: 6, background: '#525252', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
            Esgotado
          </span>
        )}
        {/* Badge popular — top right */}
        {product.is_popular && (
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>
            Popular
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, minHeight: '2rem', margin: 0, color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {product.name}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            {hasPromo && (
              <span style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through', display: 'block', lineHeight: 1 }}>
                {formatCVE(product.original_price!)}
              </span>
            )}
            <span style={{ fontSize: 14, fontWeight: 800, color: hasPromo ? '#dc2626' : '#111', lineHeight: 1 }}>
              {formatCVE(product.price)}
            </span>
          </div>

          {!outOfStock && (
            <>
              {qty === 0 ? (
                <button onClick={handleAdd} style={{ width: 28, height: 28, borderRadius: '50%', background: '#16a34a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M12 4v16m8-8H4" /></svg>
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', background: '#16a34a', borderRadius: 999, overflow: 'hidden', flexShrink: 0 }}>
                  <button onClick={() => updateQuantity(product.id, qty - 1)} style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 12H4" /></svg>
                  </button>
                  <span style={{ width: 20, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'white', userSelect: 'none' }}>{qty}</span>
                  <button onClick={handleAdd} style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M12 4v16m8-8H4" /></svg>
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
