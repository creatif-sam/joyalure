"use client"
import { Avatar } from "@/components/ui/avatar"

import Link from "next/link"
import {
  ShoppingCart,
  Search,
  User,
  Home,
  Grid,
  Heart
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"
import { useUser } from "@/hooks/use-user"

export default function Navigation() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const router = useRouter()
  const openCart = useCartStore(s => s.openCart)
  const { user, loading } = useUser()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    router.push(`/products?q=${encodeURIComponent(query)}`)
  }

function handleAccountClick() {
  if (!user) {
    router.push("/auth/login")
    return
  }

  if (user.role === "admin") {
    router.push("/admin")
  } else {
    router.push("/client-dashboard")
  }
}



  function handleWishlistClick() {
    if (!user) router.push("/login")
    else router.push("/client-dashboard/wishlist")
  }

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600">
            Joyalure
          </Link>

          {/* Links */}
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/public">Home</Link>
            <Link href="/public/products">Products</Link>
            <Link href="/public/about">About</Link>
            <Link href="/public/contact">Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(v => !v)}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Search"
            >
              <Search />
            </button>

            <button
              onClick={handleWishlistClick}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Wishlist"
            >
              <Heart />
            </button>

           {!loading && (
  <button
    onClick={handleAccountClick}
    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full"
    aria-label="Account"
  >
    {user ? (
      <>
        <Avatar
          src={user.avatar_url}
          name={user.displayName}
        />
        <span className="text-sm">
          {user.displayName}
        </span>
      </>
    ) : (
      <User className="h-5 w-5" />
    )}
  </button>
)}


            <button
              onClick={openCart}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Cart"
            >
              <ShoppingCart />
            </button>
          </div>
        </div>
      </nav>

      {/* DESKTOP SEARCH */}
      {searchOpen && (
        <div className="hidden md:block border-b bg-white">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-7xl mx-auto px-6 py-3"
          >
            <input
              autoFocus
              type="text"
              placeholder="Search products"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-green-600"
            />
          </form>
        </div>
      )}

      {/* MOBILE HEADER */}
      <nav className="md:hidden sticky top-0 z-50 bg-white border-b">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-600">
            Joyalure
          </Link>

          <button
            onClick={() => setSearchOpen(v => !v)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search />
          </button>
        </div>

        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="px-4 py-3"
          >
            <input
              autoFocus
              type="text"
              placeholder="Search products"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-green-600"
            />
          </form>
        )}
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link href="/public" className="flex flex-col items-center text-xs">
            <Home />
            Home
          </Link>

          <Link href="/products" className="flex flex-col items-center text-xs">
            <Grid />
            Shop
          </Link>

          <button
            onClick={handleWishlistClick}
            className="flex flex-col items-center text-xs"
          >
            <Heart />
            Wishlist
          </button>

        

          <button
            onClick={openCart}
            className="flex flex-col items-center text-xs"
          >
            <ShoppingCart />
            Cart
          </button>

 <button
  onClick={handleAccountClick}
  className="flex flex-col items-center text-xs"
  disabled={loading}
>
  {user ? (
    <>
      <Avatar
        src={user.avatar_url}
        name={user.displayName}
      />
      <span className="mt-1 max-w-[64px] truncate">
        {user.displayName}
      </span>
    </>
  ) : (
    <>
      <User />
      <span>Login</span>
    </>
  )}
</button>


        </div>
      </div>
    </>
  )
}
