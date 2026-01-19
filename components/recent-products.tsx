"use client"

import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

const products = [
  {
    id: 1,
    name: "Hydrating Face Serum",
    price: 45,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883"
  },
  {
    id: 2,
    name: "Gentle Cleansing Foam",
    price: 32,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108"
  },
  {
    id: 3,
    name: "Nourishing Night Cream",
    price: 58,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a"
  },
  {
    id: 4,
    name: "Vitamin C Brightening Mask",
    price: 38,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af"
  },
  {
    id: 5,
    name: "Rose Water Toner",
    price: 28,
    image: "https://images.unsplash.com/photo-1556228720-195b6eb9e31a"
  },
  {
    id: 6,
    name: "Eye Renewal Cream",
    price: 42,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be"
  },
  {
    id: 7,
    name: "Balancing Essence",
    price: 36,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
  },
  {
    id: 8,
    name: "Daily Moisturizing Lotion",
    price: 34,
    image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58"
  },
  {
    id: 9,
    name: "Purifying Clay Mask",
    price: 40,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348"
  },
  {
    id: 10,
    name: "Soothing Facial Oil",
    price: 52,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6"
  }
]

export default function RecentProducts() {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Recent Products
          </h2>

          <Link
            href="/products"
            className="text-sm text-gray-600 hover:text-green-700 transition"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  aria-label="Add to wishlist"
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition"
                >
                  <Heart size={16} />
                </button>
              </div>

              <div className="p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {product.name}
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <button
                  onClick={() =>
                    addItem({
                      ...product,
                      quantity: 1
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 text-sm border border-gray-900 py-2 rounded-md hover:bg-gray-900 hover:text-white transition"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
