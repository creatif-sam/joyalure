export const dynamic = "force-dynamic"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Calendar, User, Globe, Lock, Pencil, Image as ImageIcon } from "lucide-react"

export default async function ViewBlogPost({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({ cookies: cookieStore })

  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/blog" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-green-600 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </Link>
        <Link 
          href={`/admin/blog/edit/${post.id}`}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95"
        >
          <Pencil size={14} />
          Edit Article
        </Link>
      </div>

      {/* FEATURED IMAGE HERO */}
      <section className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-2xl">
        {post.main_image && post.main_image !== "" ? (
          <img 
            src={post.main_image} 
            alt={post.title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-300 dark:text-zinc-700">
            <ImageIcon size={64} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest">No Featured Visual</p>
          </div>
        )}
      </section>

      {/* ARTICLE HEADER */}
      <header className="space-y-6 pb-8 border-b dark:border-zinc-800">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {post.published ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest">
                <Globe size={12} /> Live on Site
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                <Lock size={12} /> Internal Draft
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-gray-100 leading-tight italic uppercase">
            {post.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-green-600" />
            {new Date(post.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-green-600" />
            Joyalure Editorial
          </div>
          <div className="font-mono bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg lowercase tracking-normal">
            slug: /{post.slug}
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      <article className="prose prose-zinc lg:prose-xl dark:prose-invert max-w-none pb-32
        prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic
        prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100">
        <div 
          dangerouslySetInnerHTML={{ __html: post.content || '<p className="italic">No content provided.</p>' }} 
        />
      </article>
    </div>
  )
}