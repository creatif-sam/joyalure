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
        <p>Loading your favorites...</p>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh] transition-colors duration-300">
      <header className="mb-12">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-zinc-100">
          My Wishlist
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later.
        </p>
      </header>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-zinc-600">
            <Heart size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-1 mb-8 text-center px-4">
            Save items you love to find them easily later.
          </p>
          <Link 
            href="/products" 
            className="px-8 py-3 bg-green-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}