import Link from "next/link"
import BlogSidebarProducts from "./BlogSideBarProducts"

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  image: string
  date: string
  author: string
}

export default function BlogLayout({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
        {/* LEFT CONTENT */}
        <div>
          {posts.map((post) => (
            <article key={post.slug} className="mb-20">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-[420px] object-cover rounded-2xl mb-8"
              />

              <p className="text-sm text-gray-500 mb-2">
                {post.date} • {post.author}
              </p>

              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                {post.title}
              </h2>

              <p className="text-gray-700 leading-relaxed mb-6 max-w-2xl">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-green-700 hover:underline"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="relative">
          <div className="sticky top-28">
            <BlogSidebarProducts />
          </div>
        </aside>
      </div>
    </section>
  )
}
