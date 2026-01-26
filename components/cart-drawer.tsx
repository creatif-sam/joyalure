"use client"

import { useCartStore } from "@/lib/cart-store"
import { Heart, Trash2, Minus, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    increase,
    decrease
  } = useCartStore()

  const subtotal = useCartStore((s) => s.subtotal())

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={closeCart} className="text-xl">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 border-b pb-4 mb-4"
              >
              <img
  src={item.image ?? "/placeholder.png"}
  alt={item.name}
  className="w-16 h-16 object-cover rounded-md"
/>


                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decrease(item.id)}
                      className="p-1 border rounded-md hover:bg-gray-100 transition"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="text-sm w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increase(item.id)}
                      className="p-1 border rounded-md hover:bg-gray-100 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    aria-label="Add to wishlist"
                    className="p-2 border rounded-md hover:bg-gray-100 transition"
                  >
                    <Heart size={16} />
                  </button>

                  <button
                    aria-label="Remove item"
                    onClick={() => removeItem(item.id)}
                    className="p-2 border rounded-md hover:bg-gray-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <p className="text-gray-600 text-center mt-10">
              Your cart is empty
            </p>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
