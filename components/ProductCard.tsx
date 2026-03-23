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
      className={`relative rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full ${
        outOfStock ? 'opacity-40 grayscale pointer-events-none' : ''
      } ${qty > 0 ? 'ring-1.5 ring-green-300' : ''}`}
    >
      {/* Image — fixed 120px height */}
      <div className="h-[120px] w-full bg-gray-50 flex items-center justify-center overflow-hidden p-2">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-100" />
        )}
        {outOfStock && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            Esgotado
          </span>
        )}
      </div>

      {/* Content — compact padding */}
      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 min-h-[2rem] leading-tight">
          {product.name}
        </h3>

        <div className="mt-auto pt-1.5 flex items-end justify-between">
          <span className="text-sm font-extrabold text-gray-900 leading-none">
            {formatCVE(product.price)}
          </span>

          {!outOfStock && (
            <>
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  className="w-7 h-7 bg-green-600 hover:bg-green-700 active:scale-90 text-white rounded-full flex items-center justify-center transition-all flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center bg-green-600 rounded-full overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    className="w-7 h-7 text-white hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-white select-none">
                    {qty}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="w-7 h-7 text-white hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
