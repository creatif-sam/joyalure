"use client"

import Link from "next/link"
import {
  ShoppingCart,
  Search,
  User,
  Home,
  Grid,
  Heart,
  LogOut,
  X
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { useUser } from "@/hooks/use-user"
import { useShopStore } from "@/lib/shop-store"
import { createClient } from "@/lib/supabase/client"
import { ThemeSwitcher } from "@/components/theme-switcher"
import SearchBar from "@/components/navigation/SearchBar"

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const router = useRouter()
  const { user, loading } = useUser()
  
  const openCart = useCartStore(s => s.openCart)
  const cartItems = useCartStore(s => s.items)
  const wishlist = useShopStore(s => s.wishlist)

  // Avoid hydration mismatch for badges
  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist?.length || 0

  function handleAccountClick() {
    if (!user) {
      router.push("/auth/login")
      return
    }
    user.role === "admin" ? router.push("/admin") : router.push("/client-dashboard")
  }

  function handleWishlistClick() {
    if (!user) router.push("/auth/login")
    else router.push("/client-dashboard/wishlist")
  }

  const Badge = ({ count, color }: { count: number, color: string }) => {
    if (!mounted || count <= 0) return null
    return (
      <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${color} text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950 animate-in zoom-in duration-300`}>
        {count}
      </span>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-green-600 dark:text-green-500">
            Joyalure
          </Link>

          {/* Center Links */}
          <div className="flex gap-8 text-sm font-bold text-gray-500 dark:text-zinc-400">
            <Link href="/public" className="hover:text-green-600 dark:hover:text-green-500 transition">Home</Link>
            <Link href="/public/products" className="hover:text-green-600 dark:hover:text-green-500 transition">Products</Link>
            <Link href="/public/about" className="hover:text-green-600 dark:hover:text-green-500 transition">About</Link>
                        <Link href="/public/blog" className="hover:text-green-600 dark:hover:text-green-500 transition">Blog</Link>
            <Link href="/public/contact" className="hover:text-green-600 dark:hover:text-green-500 transition">Contact</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <button
              onClick={() => setSearchOpen(v => !v)}
              className={`p-2 rounded-full transition ${searchOpen ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-600 dark:text-zinc-400'}`}
              aria-label="Toggle Search"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              onClick={handleWishlistClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition relative text-gray-600 dark:text-zinc-400"
            >
              <Heart size={20} />
              <Badge count={wishlistCount} color="bg-red-500" />
            </button>

            {!loading && (
              <button
                onClick={handleAccountClick}
                className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition"
              >
                {user ? (
                  <div className="h-8 w-8 overflow-hidden rounded-full border dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-green-600 uppercase">
                        {user.displayName?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-1.5 text-gray-600 dark:text-zinc-400">
                    <User size={20} />
                  </div>
                )}
              </button>
            )}

            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition relative text-gray-600 dark:text-zinc-400"
            >
              <ShoppingCart size={20} />
              <Badge count={cartCount} color="bg-green-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH BAR OVERLAY (Desktop Only) */}
      {searchOpen && (
        <div className="hidden md:block absolute top-[65px] left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b dark:border-zinc-800 p-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl z-40">
          <div className="max-w-3xl mx-auto">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t dark:border-zinc-800 md:hidden pb-safe transition-colors duration-300">
        <div className="flex justify-around items-center h-16">
          <Link href="/public" className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-zinc-400">
            <Home size={20} />
            <span className="mt-1">Home</span>
          </Link>

          <Link href="/public/products" className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-zinc-400">
            <Grid size={20} />
            <span className="mt-1">Shop</span>
          </Link>

          <button onClick={handleWishlistClick} className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-zinc-400 relative">
            <Heart size={20} />
            <Badge count={wishlistCount} color="bg-red-500" />
            <span className="mt-1">Wishlist</span>
          </button>

          <button onClick={openCart} className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-zinc-400 relative">
            <ShoppingCart size={20} />
            <Badge count={cartCount} color="bg-green-600" />
            <span className="mt-1">Cart</span>
          </button>

          <button onClick={handleAccountClick} className="flex flex-col items-center text-[10px] font-black uppercase tracking-tighter text-gray-500 dark:text-zinc-400">
            {user ? (
              <div className="h-6 w-6 overflow-hidden rounded-full border dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black text-green-600">{user.displayName?.charAt(0)}</span>
                )}
              </div>
            ) : (
              <>
                <User size={20} />
                <span className="mt-1">Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}