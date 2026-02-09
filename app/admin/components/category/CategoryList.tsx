"use client"

import { createClient } from "@/lib/supabase/client"
import { Trash2, FolderSearch } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CategoryList({ categories }: { categories: any[] }) {
  const supabase = createClient()
  const router = useRouter()

  // 1. Check if the array exists and has items
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl bg-gray-50/50">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-gray-400">
          <FolderSearch size={32} />
        </div>
        <h3 className="text-sm font-bold text-gray-900">No collections found</h3>
        <p className="text-xs text-gray-500 mt-1 text-center max-w-[200px]">
          Start by creating your first product category using the form above.
        </p>
      </div>
    )
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete the "${name}" collection?`)) return

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      toast.error("Deletion failed", {
        description: "Check if products are still linked to this category."
      })
      return
    }

    toast.success("Category deleted successfully")
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <div key={cat.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden p-3 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
          {/* IMAGE PREVIEW */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-50">
            <Image 
              src={cat.image_url || "/placeholder-cat.jpg"} 
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {/* OVERLAY BADGE */}
            <div className="absolute top-2 left-2">
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-gray-600 shadow-sm">
                Live
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between px-1">
            <div className="max-w-[140px]">
              <h3 className="text-sm font-black text-gray-900 truncate">{cat.name}</h3>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter opacity-70">
                /{cat.slug}
              </p>
            </div>
            
            <button 
              onClick={() => handleDelete(cat.id, cat.name)}
              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Category"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}