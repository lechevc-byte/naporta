'use client'

import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { formatCVE } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  const outOfStock = !product.in_stock
  const cartItem = items.find((i) => i.product_id === product.id)
  const qty = cartItem?.quantity || 0

  return (
    <div
      className={`group relative rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow overflow-hidden flex flex-col h-full ${
        outOfStock ? 'opacity-50 grayscale' : ''
      } ${qty > 0 ? 'ring-2 ring-brand/20' : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F9FAFB] flex items-center justify-center p-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Esgotado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 min-h-[2.5rem] leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5 mb-2">{product.unit}</p>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">
              {formatCVE(product.price)}
            </span>
          </div>

          {/* Add / quantity control */}
          {!outOfStock && (
            <>
              {qty === 0 ? (
                <button
                  onClick={() =>
                    addItem({
                      product_id: product.id,
                      name: product.name,
                      price: product.price,
                      image_url: product.image_url,
                      unit: product.unit,
                    })
                  }
                  className="w-9 h-9 bg-brand hover:bg-[#18a34a] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-brand rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    className="w-8 h-9 text-white hover:bg-[#18a34a] flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">{qty}</span>
                  <button
                    onClick={() =>
                      addItem({
                        product_id: product.id,
                        name: product.name,
                        price: product.price,
                        image_url: product.image_url,
                        unit: product.unit,
                      })
                    }
                    className="w-8 h-9 text-white hover:bg-[#18a34a] flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
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
