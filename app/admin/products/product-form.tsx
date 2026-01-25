"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white border rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Add New Product</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Product Title</label>
            <input
              name="name"
              type="text"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Product title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              name="slug"
              type="text"
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="example_product_name"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be unique. Use lowercase and underscores.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              required
              min="0"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Price as integer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use smallest currency unit
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="w-full border rounded px-3 py-2 bg-white"
              onChange={e => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setImagePreview(ev.target?.result as string);
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
            />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded transition-colors duration-150 disabled:opacity-60"
          >
            {loading ? "Creating product..." : "Create product"}
          </button>
        </form>
      </div>
    </div>
  )
}
