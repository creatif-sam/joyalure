"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  active: boolean
}

export default function AdminProductEditPage() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error("Failed to load product")
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        console.error(err)
        setError("Unable to load product")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
      })

      if (!res.ok) throw new Error("Failed to update product")

      router.push("/admin/products")
    } catch (err) {
      console.error(err)
      setError("Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <section className="p-8">
        <p className="text-gray-500">Loading product…</p>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="p-8">
        <p className="text-red-600">Product not found</p>
      </section>
    )
  }

  return (
    <section className="p-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Product
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white border rounded-lg p-6 space-y-6"
      >
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            value={product.title}
            onChange={e =>
              setProduct({ ...product, title: e.target.value })
            }
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={product.description ?? ""}
            onChange={e =>
              setProduct({ ...product, description: e.target.value })
            }
            className="w-full border rounded px-4 py-2 min-h-[120px]"
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            value={product.price}
            onChange={e =>
              setProduct({
                ...product,
                price: Number(e.target.value)
              })
            }
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>

        {/* IMAGE URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={product.image_url ?? ""}
            onChange={e =>
              setProduct({
                ...product,
                image_url: e.target.value
              })
            }
            className="w-full border rounded px-4 py-2"
          />
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={product.active}
            onChange={e =>
              setProduct({
                ...product,
                active: e.target.checked
              })
            }
          />
          <span className="text-sm">Product is active</span>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
