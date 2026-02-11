"use client"

import { useEffect, useState } from "react"
import { useShopStore } from "@/lib/shop-store"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const wishlist = useShopStore((s) => s.wishlist)

  // Ensure client-side data is ready
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-gray-400 italic">
        <Loader2 className="animate-spin mb-2" size={24} />
        <p className="text-sm">Loading your favorites...</p>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-[60vh] transition-colors duration-300">
      <header className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-zinc-100">
          My Wishlist
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 mt-1 md:mt-2 font-medium">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later.
        </p>
      </header>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 shadow-sm mx-auto max-w-xl">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-zinc-600">
            <Heart size={28} className="md:w-8 md:h-8" />
          </div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-zinc-100">
            Your wishlist is empty
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-zinc-400 mt-1 mb-8 text-center px-6">
            Save items you love to find them easily later.
          </p>
          <Link 
            href="/public/products" 
            className="px-6 py-3 bg-green-600 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        /* Mobile Fix: 2 columns on mobile (grid-cols-2) to showcase more items at once */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {wishlist.map((product) => (
            /* We wrap this to ensure the card handles the column span correctly */
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}