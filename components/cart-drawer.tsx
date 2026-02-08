"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { useShopStore } from "@/lib/shop-store"
import { useCurrencyStore } from "@/lib/currency-store" // Import Currency Store
import { Heart, Trash2, Minus, Plus, X, ShoppingCart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner" 

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    increase,
    decrease
  } = useCartStore()

  const { wishlist, toggleWishlist } = useShopStore()
  
  // Currency Logic
  const { currency, rate } = useCurrencyStore()
  const rawSubtotal = useCartStore((s) => s.subtotal())

  // Institutional Fix: Prevent hydration flicker
  useEffect(() => {
    setMounted(true)
  }, [])

  // Dynamic Price Formatting Helpers
  const formatPrice = (priceInCents: number) => {
    const amount = currency === "USD" 
      ? (priceInCents / 100) 
      : (priceInCents / 100) * rate;
    
    return amount.toFixed(2);
  };

  const symbol = currency === "USD" ? "$" : "₵";

  const handleCheckout = () => {
    closeCart()
    router.push("/public/check-out") // Standardized route
  }

  const handleRemove = (id: string, title: string) => {
    removeItem(id)
    toast.error(`${title} removed`)
  }

  const handleWishlistToggle = (item: any) => {
    const isCurrentlyWishlisted = wishlist.some((w) => w.id === item.id)
    toggleWishlist(item)
    if (!isCurrentlyWishlisted) {
      toast.success("Moved to favorites")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="popLayout">
            {mounted && items.map((item) => {
              const isWishlisted = wishlist.some((w) => w.id === item.id);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-4 border-b pb-6 mb-6 last:border-0"
                >
                  <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image_url || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm font-semibold text-green-700 mt-1">
                      {symbol}{formatPrice(item.price)}
                    </p>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => decrease(item.id)} className="p-1.5 hover:text-green-600 transition"><Minus size={14} /></button>
                        <span className="text-xs font-bold w-8 text-center">{item.quantity}</span>
                        <button onClick={() => increase(item.id)} className="p-1.5 hover:text-green-600 transition"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <button onClick={() => handleWishlistToggle(item)} className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition">
                      <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
                    </button>
                    <button onClick={() => handleRemove(item.id, item.title)} className="p-2 text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {mounted && items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={32} className="text-gray-300 mb-4" />
              <p className="text-gray-500 italic">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        {mounted && items.length > 0 && (
          <div className="border-t bg-gray-50/50 px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{symbol}{formatPrice(rawSubtotal)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{symbol}{formatPrice(rawSubtotal)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-green-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}