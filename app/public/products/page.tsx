"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card" // Updated path

type Product = {
  id: string
  title: string
  price: number
  image_url: string | null
  is_featured: boolean
  is_recent: boolean
  category?: { name: string } | null
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") || "" // Get search term from URL
  
  const [products, setProducts] = useState<Product[]>([])
  const [localQuery, setLocalQuery] = useState("") // For the on-page search input
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "recent" | "featured">("all")

  // Sync local input with URL search
  useEffect(() => {
    setLocalQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to load products", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Institutionalized Filtering Logic: Handles both URL query and UI filters
  const filtered = products
    .filter(p => p.title.toLowerCase().includes(localQuery.toLowerCase()))
    .filter(p => {
      if (filter === "recent") return p.is_recent
      if (filter === "featured") return p.is_featured
      return true
    })

  if (loading) {
    return (
      <main className="py-20 text-center text-gray-400 italic">
        Searching the Joyalure collection...
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          {urlQuery ? `Results for "${urlQuery}"` : "Our Products"}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          {filtered.length} premium skincare solutions found.
        </p>
      </header>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {(["all", "recent", "featured"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
              filter === f
                ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-900/10"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-900"
            }`}
          >
            {f === "all" ? "All Products" : f === "recent" ? "New Arrivals" : "Featured"}
          </button>
        ))}
      </div>

      {/* ON-PAGE SEARCH (Synchronized with URL) */}
      <div className="max-w-md mx-auto mb-16">
        <input
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          placeholder="Refine your search..."
          className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all bg-gray-50/50"
        />
      </div>

      {/* PRODUCTS GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
          <p className="text-gray-400 italic">No products match your search or filter.</p>
          <button 
            onClick={() => {setLocalQuery(""); setFilter("all")}}
            className="mt-4 text-sm font-bold text-green-600 underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              priority={filtered.indexOf(p) < 4} 
            />
          ))}
        </div>
      )}
    </main>
  )
}

// Institutional Safety: Next.js requires Suspense when using useSearchParams
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  )
}