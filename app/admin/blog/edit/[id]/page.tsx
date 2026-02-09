import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import EditBlogForm from "./EditBlogForm"
import { ChevronLeft, FileEdit } from "lucide-react"
import Link from "next/link"

export default async function EditBlogPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Correctly unwrap the async params
  const { id } = await params;

  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({ cookies: cookieStore })

  // 2. Fetch the existing post data
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* NAVIGATION & TITLE */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/blog" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors w-fit"
        >
          <ChevronLeft size={16} />
          Back to Editorial Desk
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600">
            <FileEdit size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              Edit Article
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Update content, visibility, and metadata for: <span className="text-green-600 italic">"{post.title}"</span>
            </p>
          </div>
        </div>
      </div>

      {/* THE EDIT FORM (Client Component) */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
        <EditBlogForm initialData={post} />
      </div>
    </div>
  )
}