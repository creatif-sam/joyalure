import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar, User, Globe, Lock, Pencil } from "lucide-react"

// Institutional Note: Next.js now requires params to be awaited
export default async function ViewBlogPost({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Unwrap the params promise
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({ cookies: cookieStore })

  // 2. Use the unwrapped ID
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/blog" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>
        <Link 
          href={`/admin/blog/edit/${post.id}`}
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Pencil size={16} />
          Edit Article
        </Link>
      </div>

      {/* ARTICLE HEADER */}
      <header className="space-y-6 pb-8 border-b dark:border-zinc-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {post.published ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest">
                <Globe size={12} /> Live on Site
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <Lock size={12} /> Internal Draft
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-green-600" />
            {new Date(post.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} className="text-green-600" />
            Joyalure Editorial
          </div>
          <div className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded italic">
             slug: /{post.slug}
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      
      <article className="prose prose-zinc lg:prose-lg dark:prose-invert max-w-none pb-20">
        <div 
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content || '<p className="italic">No content provided.</p>' }} 
        />
      </article>
    </div>
  )
}