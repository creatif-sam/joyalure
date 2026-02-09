"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, FolderPlus, Image as ImageIcon } from "lucide-react"

export default function CategoryForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    setSlug(val.toLowerCase().replace(/\s+/g, '_').replace(/[^\w-]+/g, ''))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("image") as File
    
    let image_url = ""

    // 1. Upload Image to Supabase Storage
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${slug}-${Math.random()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('categories')
        .upload(fileName, imageFile)

      if (uploadError) {
        toast.error("Image upload failed")
        setLoading(false)
        return
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(uploadData.path)
        
      image_url = publicUrl
    }

    // 2. Insert Category into Database
    const { error } = await supabase.from("categories").insert([{
      name,
      slug,
      image_url
    }])

    setLoading(false)

    if (error) {
      toast.error("Could not create category", { description: error.message })
      return
    }

    toast.success("Category Added", { description: `${name} is now a live collection.` })
    setName("")
    setSlug("")
    router.refresh()
  }

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-6 text-green-700">
        <FolderPlus size={20} />
        <h2 className="text-lg font-bold">Create New Category</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Name</label>
          <input
            value={name}
            onChange={handleNameChange}
            required
            className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-600 outline-none"
            placeholder="e.g. Organic Oils"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Slug (URL)</label>
          <input
            value={slug}
            readOnly
            className="w-full border bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="hidden"
              id="cat-image"
            />
            <label 
              htmlFor="cat-image"
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 rounded-xl py-2 text-xs font-bold text-gray-500 hover:border-green-600 hover:text-green-600 cursor-pointer transition"
            >
              <ImageIcon size={14} /> Add Cover
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-black transition disabled:opacity-50"
          >
            {loading ? <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" /> : <Plus size={18} />}
          </button>
        </div>
      </form>
    </div>
  )
}