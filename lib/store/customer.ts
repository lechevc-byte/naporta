'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from '@/types'

interface CustomerStore {
  customer: Customer | null
  setCustomer: (c: Customer | null) => void
  logout: () => void
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      logout: () => set({ customer: null }),
    }),
    { name: 'naporta-customer' }
  )
)
