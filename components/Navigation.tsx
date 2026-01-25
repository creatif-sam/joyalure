"use client"

import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/cart-store"

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")

  const router = useRouter()
  const openCart = useCartStore((s) => s.openCart)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    router.push(`/products?q=${encodeURIComponent(query)}`)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-green-600">
          Joyalure
        </Link>

        <div className="hidden md:flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/help-center">Help Center</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search />
          </button>

          <button
            aria-label="Account"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <User />
          </button>

          <button
            onClick={openCart}
            aria-label="Cart"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ShoppingCart />
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {searchOpen && (
        <div className="border-t bg-white">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-7xl mx-auto px-4 py-4"
          >
            <input
              autoFocus
              type="text"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-green-600"
            />
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/help-center" onClick={() => setMenuOpen(false)}>Help Center</Link>
        </div>
      )}
    </nav>
  )
}
