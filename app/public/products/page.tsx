"use client"

import { useState } from "react"
import { products } from "@/lib/products"

export default function ProductsPage() {
  const [query, setQuery] = useState("")

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main className="py-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products"
        className="w-full max-w-md mx-auto block mb-12 px-6 py-3 rounded-full border"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow-lg p-6">
            <img src={p.image} className="h-56 w-full object-cover rounded-lg mb-4" />
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{p.description}</p>
            <p className="text-green-600 font-bold">${p.price}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
