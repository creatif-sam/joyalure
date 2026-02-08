import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrencyState {
  currency: 'USD' | 'GHS'
  rate: number // 1 USD to GHS rate
  setCurrency: (code: 'USD' | 'GHS') => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'USD',
      rate: 15.5, // You can update this via API later
      setCurrency: (code) => set({ currency: code }),
    }),
    { name: 'joyalure-currency' }
  )
)