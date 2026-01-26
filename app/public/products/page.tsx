"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  is_featured: boolean
  is_recent: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState<"all" | "recent" | "featured">("all")

  const addToCart = useCartStore(s => s.addItem)

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    }

    loadProducts()
  }, [])

  const filtered = products
    .filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    )
    .filter(p => {
      if (filter === "recent") return p.is_recent
      if (filter === "featured") return p.is_featured
      return true
    })

  if (loading) {
    return (
      <main className="py-20 text-center text-gray-500">
        Loading products…
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Our Products
      </h1>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-full border ${
            filter === "all"
              ? "bg-green-700 text-white"
              : "bg-white"
          }`}
        >
          All products
        </button>

        <button
          onClick={() => setFilter("recent")}
          className={`px-5 py-2 rounded-full border ${
            filter === "recent"
              ? "bg-green-700 text-white"
              : "bg-white"
          }`}
        >
          New
        </button>

        <button
          onClick={() => setFilter("featured")}
          className={`px-5 py-2 rounded-full border ${
            filter === "featured"
              ? "bg-green-700 text-white"
              : "bg-white"
          }`}
        >
          Featured
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products"
        className="w-full max-w-md mx-auto block mb-12 px-6 py-3 rounded-full border focus:outline-none focus:border-green-600"
      />

      {/* PRODUCTS GRID */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found
        </p>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm p-5 relative group"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={p.image_url ?? "/placeholder.png"}
                  alt={p.title}
                  className="h-56 w-full object-cover rounded-lg"
                />

                {/* RECENT TAG */}
                {p.is_recent && (
                  <span className="absolute top-3 left-3 bg-green-700 text-white text-xs px-3 py-1 rounded-full">
                    New
                  </span>
                )}

                {/* WISHLIST */}
                <button
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:text-green-600"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} />
                </button>
              </div>

              {/* INFO */}
              <h3 className="font-semibold text-lg mt-4">
                {p.title}
              </h3>

              {p.description && (
                <p className="text-gray-600 text-sm mb-2">
                  {p.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-4">
                <span className="text-green-700 font-bold text-lg">
                  ${p.price}
                </span>

                {/* ADD TO CART */}
                <button
                  onClick={() =>
                 addToCart({
  id: p.id,
  name: p.title,
  price: p.price,
  image: p.image_url,
  quantity: 1
})

                  }
                  className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800"
                >
                  <ShoppingCart size={16} />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
