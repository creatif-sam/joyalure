export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostDetail({ params }: Props) {
  // NEXT.JS 15 FIX: Await params
  const { slug } = await params
  
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) notFound()

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 pb-24">
      
      {/* NAVIGATION - Updated to Green */}
      <nav className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link 
          href="/public/blog" 
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-green-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Insights
        </Link>
        <button className="text-zinc-400 hover:text-green-600 transition-colors">
          <Share2 size={18} />
        </button>
      </nav>

      <header className="max-w-4xl mx-auto px-6 text-center mb-12">
        {/* Updated Accent to Green */}
        <div className="flex justify-center items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-6">
          <Calendar size={12} />
          {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-8 leading-tight italic uppercase">
          {post.title}
        </h1>
      </header>

      {/* FEATURED IMAGE - Reduced Radius from [2.5rem] to 2xl */}
      {post.main_image && post.main_image !== "" && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="aspect-video rounded-2xl overflow-hidden border dark:border-zinc-800 shadow-xl">
            <img 
              src={post.main_image} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      )}

      {/* CONTENT RENDERER - Fixed HTML Rendering */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic
          prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
          prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
          prose-a:text-green-600 dark:prose-a:text-green-500">
          
          {/* Using dangerouslySetInnerHTML to fix the <p> tag string issue */}
          {typeof post.content === 'string' ? (
             <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            /* Fallback for JSONB structure if necessary */
            <div dangerouslySetInnerHTML={{ __html: post.content?.html || "" }} />
          )}
        </div>
      </section>

      {/* FOOTER CTA - Reduced Radius & Updated Colors */}
      <footer className="max-w-2xl mx-auto px-6 mt-24">
        <div className="p-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border dark:border-zinc-800 text-center">
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-4 uppercase italic">
            Enjoyed this read?
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 font-medium">
            Subscribe to our newsletter to receive skincare rituals and editorial updates directly in your inbox.
          </p>
          <Link 
            href="/public/subscribe"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 active:scale-95"
          >
            Join the Newsletter
          </Link>
        </div>
      </footer>
    </article>
  )
}