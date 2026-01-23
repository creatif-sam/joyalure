"use client"

import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

type Product = {
  id: string
  name: string
  price: number
  image_url: string
}

export default function RecentProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const addToCart = useCartStore(state => state.addToCart)

  useEffect(() => {
    fetch("/api/products/recent")
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-40 object-cover"
          />

          <h3 className="mt-2 font-semibold">{product.name}</h3>
          <p className="text-sm">${product.price}</p>

          <button
            onClick={() => addToCart(product)}
            className="mt-2 w-full bg-black text-white py-2"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      ))}
    </section>
  )
}
