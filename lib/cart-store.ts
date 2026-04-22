import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Standardized types for Joyalure
type CartItem = {
  id: string
  title: string
  price: number
  image_url: string | null
  quantity: number
  /** Shopify ProductVariant GID – required for Shopify checkout */
  variantId?: string
}

type AddCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  isCheckingOut: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: AddCartItem) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  subtotal: () => number
  /** Creates a Shopify cart and redirects to Shopify hosted checkout */
  checkout: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckingOut: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              // Institutional Fix: Removed isOpen: true to prevent popup
            }
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: item.quantity ?? 1
              }
            ],
            // Institutional Fix: Removed isOpen: true to prevent popup
          }
        }),

      increase: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          )
        })),

      decrease: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id)
          if (!item) return state

          if (item.quantity === 1) {
            return {
              items: state.items.filter((i) => i.id !== id)
            }
          }

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        })),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),

      checkout: async () => {
        const { items } = get()
        if (items.length === 0) return

        // Build Shopify cart lines from cart items that have a variantId
        const lines = items
          .filter((item) => Boolean(item.variantId))
          .map((item) => ({
            merchandiseId: item.variantId as string,
            quantity: item.quantity,
          }))

        if (lines.length === 0) {
          console.warn("[Cart] No items with Shopify variantId found – cannot create Shopify cart")
          return
        }

        set({ isCheckingOut: true })

        try {
          const res = await fetch("/api/shopify/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lines }),
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error ?? "Failed to create Shopify cart")
          }

          const { checkoutUrl } = await res.json()
          // Redirect to Shopify hosted checkout
          window.location.href = checkoutUrl
        } catch (error) {
          console.error("[Cart] Shopify checkout error:", error)
          set({ isCheckingOut: false })
          throw error
        }
      },
    }),
    {
      name: "joyalure-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)