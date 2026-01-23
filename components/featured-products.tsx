"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

type Product = {
  id: string
  name?: string
  title?: string
  price: number
  image_url?: string
  image?: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products/featured")
        if (!res.ok) {
          setProducts([])
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch {
        setProducts([])
      }
    }
    load()
  }, [])

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-900 mb-12">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative"
            >
              <div className="relative overflow-hidden bg-gray-100 rounded-lg">
                <img
                  src={product.image_url || product.image || ""}
                  alt={product.name || product.title || "Product"}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  aria-label="Add to wishlist"
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <Heart size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-800 font-medium">
                  {product.name || product.title}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-semibold">
                    ${product.price.toFixed(2)}
                  </span>

                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name || product.title || "Product",
                        price: product.price,
                        image: product.image_url || product.image || "",
                        quantity: 1
                      })
                    }
                    className="flex items-center gap-2 text-sm border border-gray-900 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-gray-900 hover:text-white"
                  >
                    <ShoppingBag size={16} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="mt-12 text-center text-gray-500">
            No featured products available
          </p>
        )}
      </div>
    </section>
  )
}
