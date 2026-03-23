'use client'

import { Product } from '@/types'
import { useCartStore } from '@/lib/store/cart'
import { formatCVE } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)

  const outOfStock = !product.in_stock

  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col h-full ${
        outOfStock ? 'opacity-50 grayscale' : ''
      }`}
    >
      {/* Fixed-height image zone */}
      <div className="relative h-36 sm:h-40 bg-gray-50 flex items-center justify-center p-3">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
        {outOfStock && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Esgotado
          </span>
        )}
      </div>

      {/* Fixed-height info zone */}
      <div className="p-3 flex flex-col flex-1">
        {/* Product name — always 2 lines height */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          {product.unit}
        </p>

        {/* Price + button — always at bottom */}
        <div className="mt-auto">
          <span className="block text-base font-bold text-[#1A2744] mb-2">
            {formatCVE(product.price)}
          </span>
          <button
            disabled={outOfStock}
            onClick={() =>
              addItem({
                product_id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                unit: product.unit,
              })
            }
            className="w-full bg-[#FF6B35] hover:bg-[#e55a25] active:scale-[0.97] disabled:bg-gray-300 text-white text-sm font-semibold py-2 rounded-lg transition-all"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
