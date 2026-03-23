export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  barcode: string | null
  category: string
  in_stock: boolean
  is_popular: boolean
  unit: string
  created_at: string
}

export interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string | null
  unit: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shopping' | 'delivering' | 'delivered'
  notes: string | null
  delivery_slot: string | null
  delivery_fee: number
  created_at: string
}
