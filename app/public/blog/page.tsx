export const dynamic = "force-dynamic"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export default async function BlogPage() {
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

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, main_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const featuredPost = posts?.[0]
  const recentPosts = posts?.slice(1)

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      
      {/* FEATURED HERO */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
          <div className="bg-green-50/40 dark:bg-green-900/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center border border-green-100 dark:border-zinc-800">
            <div className="w-full md:w-1/2 relative group">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative bg-white dark:bg-zinc-800">
                {featuredPost.main_image ? (
                  <img 
                    src={featuredPost.main_image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="Featured" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="text-green-200" size={48}/>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Featured
                </span>
                <span className="text-xs font-bold text-gray-400">Journalist Pick</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-100 leading-tight tracking-tight uppercase italic">
                {featuredPost.title}
              </h1>
              
              {/* FIX: Render excerpt as HTML to hide <p> tags */}
              <div 
                className="text-gray-500 dark:text-zinc-400 leading-relaxed max-w-lg font-medium line-clamp-3 prose-p:my-0"
                dangerouslySetInnerHTML={{ __html: featuredPost.excerpt || "" }} 
              />

              <Link 
                href={`/public/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-green-700 dark:text-green-500 font-bold group"
              >
                Read More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* RECENT ARTICLES GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight italic">
              Our Recent Articles
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium italic">
              Stay Informed with Our Latest Insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts?.map((post) => (
            <Link key={post.id} href={`/public/blog/${post.slug}`} className="group space-y-5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 dark:bg-zinc-900 relative border border-gray-100 dark:border-zinc-800 transition-all group-hover:shadow-xl group-hover:shadow-green-600/5">
                {post.main_image ? (
                  <img 
                    src={post.main_image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={post.title} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="text-green-100 dark:text-zinc-800" size={32}/>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-green-600">Editorial</span>
                  <span className="text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 group-hover:text-green-600 transition-colors leading-snug uppercase tracking-tight italic">
                  {post.title}
                </h3>
                
                {/* FIX: Render excerpt as HTML for recent articles */}
                <div 
                  className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium prose-p:my-0"
                  dangerouslySetInnerHTML={{ __html: post.excerpt || "" }} 
                />

                <div className="pt-2">
                   <span className="inline-flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-widest">
                     Read More <ArrowRight size={14} />
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}