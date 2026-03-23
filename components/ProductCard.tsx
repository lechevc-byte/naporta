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
      className={`relative rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full ${
        outOfStock ? 'opacity-40 grayscale pointer-events-none' : ''
      } ${qty > 0 ? 'ring-2 ring-green-200' : ''}`}
    >
      {/* Image — square */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-5">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100" />
        )}
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Esgotado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[13px] font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-snug">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{product.unit}</p>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            {formatCVE(product.price)}
          </span>

          {/* Button / Counter */}
          {!outOfStock && (
            <>
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  className="w-10 h-10 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center bg-green-600 rounded-full overflow-hidden shadow-sm">
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    className="w-9 h-9 text-white hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-7 text-center text-sm font-bold text-white select-none">
                    {qty}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="w-9 h-9 text-white hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
