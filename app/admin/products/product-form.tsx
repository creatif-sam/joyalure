"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const response = await fetch(
      "/api/admin/products",
      {
        method: "POST",
        body: formData
      }
    )

    setLoading(false)

    if (!response.ok) {
      const data = await response.json()
      alert(data.error || "Product creation failed")
      return
    }

    router.push("/admin/products")
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-4 max-w-lg"
    >
      <div>
        <label className="block text-sm font-medium">
          Product title
        </label>
        <input
          name="name"
          type="text"
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Product title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Slug
        </label>
        <input
          name="slug"
          type="text"
          required
          className="w-full border rounded px-3 py-2"
          placeholder="example_product_name"
        />
        <p className="text-xs text-gray-500">
          Must be unique. Use lowercase and underscores.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Price
        </label>
        <input
          name="price"
          type="number"
          required
          min="0"
          className="w-full border rounded px-3 py-2"
          placeholder="Price as integer"
        />
        <p className="text-xs text-gray-500">
          Use smallest currency unit
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Product image
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Creating product..." : "Create product"}
      </button>
    </form>
  )
}
