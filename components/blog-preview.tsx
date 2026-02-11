import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { ArrowRight, Calendar } from "lucide-react"

export default async function BlogPreview() {
  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({ cookies: cookieStore })

  // Fetch only published posts, ordered by newest first
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("title, slug, created_at, excerpt, main_image")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3)

  const hasPosts = posts && posts.length > 0

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: Institutional Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-zinc-100 uppercase italic">
              From Our Journal
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1 font-medium italic">
              Editorial insights into the world of high-end skincare.
            </p>
          </div>

          <Link
            href="/public/blog"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 hover:text-green-600 dark:hover:text-green-500 transition-colors flex items-center gap-2"
          >
            View all entries <ArrowRight size={14} />
          </Link>
        </div>

        {/* GRID: Responsive Phone/PC cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {hasPosts ? (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/public/blog/${post.slug}`}
                className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl dark:hover:shadow-zinc-950/50 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <img
                    src={post.main_image || "/placeholder.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      Editorial
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-green-600 dark:text-green-500 mb-4">
                    <Calendar size={12} />
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 mb-3 tracking-tight italic uppercase leading-tight group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-3 font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-green-600 transition-colors">
                    Read Narrative <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem]">
               <p className="text-zinc-400 dark:text-zinc-600 italic font-medium">The journal is currently quiet. Check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}