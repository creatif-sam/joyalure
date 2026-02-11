"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card" 

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
  const urlQuery = searchParams.get("q") || "" 
  
  const [products, setProducts] = useState<Product[]>([])
  const [localQuery, setLocalQuery] = useState("") 
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "recent" | "featured">("all")

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

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(localQuery.toLowerCase()))
    .filter(p => {
      if (filter === "recent") return p.is_recent
      if (filter === "featured") return p.is_featured
      return true
    })

  if (loading) {
    return (
      <main className="py-20 text-center text-gray-400 dark:text-zinc-500 italic">
        Searching the Joyalure collection...
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 transition-colors duration-300">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-4">
          {urlQuery ? `Results for "${urlQuery}"` : "Our Products"}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 max-w-lg mx-auto font-medium">
          {filtered.length} premium skincare solutions found.
        </p>
      </header>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {(["all", "recent", "featured"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === f
                ? "bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-100 shadow-xl shadow-gray-900/10 dark:shadow-zinc-900/40"
                : "bg-white dark:bg-zinc-950 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-800 hover:border-gray-900 dark:hover:border-zinc-100"
            }`}
          >
            {f === "all" ? "All Products" : f === "recent" ? "New Arrivals" : "Featured"}
          </button>
        ))}
      </div>

      {/* ON-PAGE SEARCH */}
      <div className="max-w-md mx-auto mb-16">
        <input
          value={localQuery}
          onChange={e => setLocalQuery(e.target.value)}
          placeholder="Refine your search..."
          className="w-full px-6 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-600 dark:focus:border-green-500 transition-all bg-gray-50/50 dark:bg-zinc-900/50 dark:text-zinc-100"
        />
      </div>

      {/* PRODUCTS GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-zinc-950/50">
          <p className="text-gray-400 dark:text-zinc-500 italic">No products match your search or filter.</p>
          <button 
            onClick={() => {setLocalQuery(""); setFilter("all")}}
            className="mt-4 text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-500 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-400 dark:text-zinc-500">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  )
}