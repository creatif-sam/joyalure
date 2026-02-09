"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { PackagePlus, Image as ImageIcon } from "lucide-react"

export default function ProductForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("id, name").order("name")
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const productName = formData.get("name") as string

    const response = await fetch("/api/admin/products", {
      method: "POST",
      body: formData
    })

    setLoading(false)

    if (!response.ok) {
      const data = await response.json()
      toast.error("Creation Failed", {
        description: data.error || "Please check your inputs and try again."
      })
      return
    }

    toast.success("Product Created", {
      description: `${productName} added to Joyalure collection.`
    })
    
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        {/* Header decoration */}
        <div className="h-2 bg-green-600 w-full" />
        
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600">
              <PackagePlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add New Product</h2>
              <p className="text-xs text-gray-500">Configure your skincare item details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TITLE */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Product Title</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100"
                  placeholder="e.g. Shea Butter Glow"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Category</label>
                <select
                  name="category_id"
                  required
                  className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100 appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* SLUG */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Slug</label>
                <input
                  name="slug"
                  type="text"
                  required
                  className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100"
                  placeholder="shea-butter-glow"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Price (Cents)</label>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100 font-mono"
                  placeholder="2500"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Image Asset</label>
                <div className="relative">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => setImagePreview(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-gray-50 dark:bg-zinc-950 border-2 border-dashed dark:border-zinc-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2 text-gray-500">
                    <ImageIcon size={18} />
                    <span>{imagePreview ? "Change Image" : "Upload File"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PREVIEW BOX */}
            {imagePreview && (
              <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border dark:border-zinc-800 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 object-cover rounded-xl shadow-md border-2 border-white dark:border-zinc-800"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              {loading ? "Processing..." : "Deploy Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}