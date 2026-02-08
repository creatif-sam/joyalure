import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Product {
  id: string
  title: string
  price: number
  image_url: string | null
  category?: { name: string } | null
}

interface JoyalureState {
  wishlist: Product[]
  toggleWishlist: (product: Product) => void
  clearWishlist: () => void
}

export const useShopStore = create<JoyalureState>()(
  persist(
    (set) => ({
      wishlist: [],

      toggleWishlist: (product) => 
        set((state) => {
          const isExisting = state.wishlist.some((item) => item.id === product.id)
          
          if (isExisting) {
            // Remove from Joyalure wishlist
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id)
            }
          } else {
            // Add to Joyalure wishlist
            return {
              wishlist: [...state.wishlist, product]
            }
          }
        }),

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'joyalure-storage', // Project-specific key to avoid data clashing
      storage: createJSONStorage(() => localStorage),
    }
  )
)