export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft, Share2 } from "lucide-react"
import BlogNewsletter from "../BlogNewsletter" // 

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostDetail({ params }: Props) {
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
        <div className="flex justify-center items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-6">
          <Calendar size={12} />
          {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 mb-8 leading-tight italic uppercase">
          {post.title}
        </h1>
      </header>

      {post.main_image && (
        <div className="max-w-5xl mx-auto px-6 mb-16">
          <div className="aspect-video rounded-2xl overflow-hidden border dark:border-zinc-800 shadow-xl">
            <img src={post.main_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-6">
        <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic
          prose-p:text-gray-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed
          prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
          prose-a:text-green-600 dark:prose-a:text-green-500">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>

      {/* REPLACED FOOTER WITH MINIMALIST NEWSLETTER */}
      <footer className="max-w-2xl mx-auto px-6 mt-32 border-t dark:border-zinc-800 pt-16">
        <div className="text-center mb-10">
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-2 uppercase italic">
            The Skincare Ritual
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
            Subscribe to receive editorial updates and skincare insights.
          </p>
        </div>
        
        {/* The Client Component Form */}
        <BlogNewsletter />
      </footer>
    </article>
  )
}