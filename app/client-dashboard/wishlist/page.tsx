"use client"

import { useEffect, useState } from "react"
import { useShopStore } from "@/lib/shop-store"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { Heart } from "lucide-react"

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const wishlist = useShopStore((s) => s.wishlist)

  // Ensure client-side data is ready
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 italic">
        Loading your favorites...
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh]">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold text-gray-900">My Wishlist</h1>
        <p className="text-gray-500 mt-2">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later.
        </p>
      </header>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-100 rounded-3xl bg-white">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <Heart size={32} />
          </div>
          <h2 className="text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-500 mt-1 mb-8">Save items you love to find them easily later.</p>
          <Link 
            href="/products" 
            className="px-8 py-3 bg-green-600 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}