"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Save, Globe, Lock } from "lucide-react"

export default function EditBlogForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const updates = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      published: formData.get("published") === "on",
    }

    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', initialData.id)

    setLoading(false)

    if (error) {
      toast.error("Save Failed", { description: error.message })
    } else {
      toast.success("Article Updated", { description: "Changes have been deployed to the database." })
      router.push("/admin/blog")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleUpdate} className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TITLE */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Title</label>
          <input
            name="title"
            defaultValue={initialData.title}
            required
            className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100"
          />
        </div>

        {/* SLUG */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL Slug</label>
          <input
            name="slug"
            defaultValue={initialData.slug}
            required
            className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100"
          />
        </div>

        {/* VISIBILITY */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visibility Status</label>
          <div className="flex items-center gap-4 h-[46px] bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl px-4">
            <input 
              type="checkbox" 
              name="published" 
              defaultChecked={initialData.published}
              className="w-5 h-5 accent-green-600 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Publish to Live Site
            </span>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Content (HTML/Text)</label>
          <textarea
            name="content"
            defaultValue={initialData.content}
            rows={15}
            className="w-full bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-2xl p-4 text-sm leading-relaxed focus:ring-2 focus:ring-green-600 outline-none transition dark:text-gray-100 font-sans"
            placeholder="Write your Joyalure editorial here..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-zinc-800">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-green-600/20 active:scale-95 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Saving Changes..." : "Deploy Updates"}
        </button>
      </div>
    </form>
  )
}