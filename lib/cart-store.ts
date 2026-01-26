import { create } from "zustand"

type CartItem = {
  id: string
  name: string
  price: number
  image: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: CartItem) => void
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  subtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

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
          isOpen: true
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
        isOpen: true
      }
    }),

  increase: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity + 1 }
          : i
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
          i.id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
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
    )
}))
