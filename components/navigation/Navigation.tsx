"use client"

import { Avatar } from "@/components/ui/avatar"
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

// NEW: Import the standalone SearchBar component
import SearchBar from "@/components/navigation/SearchBar"

export default function Navigation() {
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const router = useRouter()
  const { user, loading } = useUser()
  
  const openCart = useCartStore(s => s.openCart)
  const cartItems = useCartStore(s => s.items)
  const wishlist = useShopStore(s => s.wishlist)

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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  function handleWishlistClick() {
    if (!user) router.push("/auth/login")
    else router.push("/client-dashboard/wishlist")
  }

  const Badge = ({ count, color }: { count: number, color: string }) => {
    if (!mounted || count <= 0) return null
    return (
      <span className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${color} text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in duration-300`}>
        {count}
      </span>
    )
  }

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Joyalure
          </Link>

          <div className="flex gap-8 text-sm font-medium text-gray-600">
            <Link href="/public" className="hover:text-green-600 transition">Home</Link>
            <Link href="/public/products" className="hover:text-green-600 transition">Products</Link>
            <Link href="/public/about" className="hover:text-green-600 transition">About</Link>
            <Link href="/public/contact" className="hover:text-green-600 transition">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className={`p-2 rounded-full transition ${searchOpen ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'}`}
              aria-label="Toggle Search"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <button
              onClick={handleWishlistClick}
              className="p-2 hover:bg-gray-100 rounded-full transition relative"
            >
              <Heart size={20} />
              <Badge count={wishlistCount} color="bg-red-500" />
            </button>

            {!loading && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAccountClick}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full transition"
                >
                  {user ? (
                    <>
                      <Avatar src={user.avatar_url} name={user.displayName} className="h-8 w-8" />
                      <span className="text-sm font-medium">{user.displayName}</span>
                    </>
                  ) : (
                    <User size={20} />
                  )}
                </button>
                {user && (
                  <button onClick={handleLogout} className="p-2 hover:text-red-500 transition">
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 rounded-full transition relative"
            >
              <ShoppingCart size={20} />
              <Badge count={cartCount} color="bg-green-600" />
            </button>
          </div>
        </div>
      </nav>

      {/* DESKTOP SEARCH OVERLAY */}
      {searchOpen && (
        <div className="hidden md:block border-b bg-white animate-in slide-in-from-top duration-300 shadow-sm">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <nav className="md:hidden sticky top-0 z-50 bg-white border-b">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">Joyalure</Link>
          <button 
            onClick={() => setSearchOpen(v => !v)} 
            className={`p-2 rounded-full ${searchOpen ? 'text-green-600' : ''}`}
          >
            {searchOpen ? <X size={22} /> : <Search size={22} />}
          </button>
        </div>
        {searchOpen && (
          <div className="px-4 py-3 bg-white border-b">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/public" className="flex flex-col items-center text-[10px] font-medium text-gray-600">
            <Home size={20} />
            <span className="mt-1">Home</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center text-[10px] font-medium text-gray-600">
            <Grid size={20} />
            <span className="mt-1">Shop</span>
          </Link>

          <button onClick={handleWishlistClick} className="flex flex-col items-center text-[10px] font-medium text-gray-600 relative">
            <Heart size={20} />
            <Badge count={wishlistCount} color="bg-red-500" />
            <span className="mt-1">Wishlist</span>
          </button>

          <button onClick={openCart} className="flex flex-col items-center text-[10px] font-medium text-gray-600 relative">
            <ShoppingCart size={20} />
            <Badge count={cartCount} color="bg-green-600" />
            <span className="mt-1">Cart</span>
          </button>

          <button onClick={handleAccountClick} className="flex flex-col items-center text-[10px] font-medium text-gray-600">
            {user ? (
              <>
                <Avatar src={user.avatar_url} name={user.displayName} className="h-5 w-5" />
                <span className="mt-1 truncate max-w-[50px] font-semibold">{user.displayName}</span>
              </>
            ) : (
              <>
                <User size={20} />
                <span className="mt-1">Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}