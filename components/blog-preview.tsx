import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"

export default function BlogPreview() {
  const latest = blogPosts.slice(0, 3)

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-semibold text-gray-900">
            From Our Journal
          </h2>

          <Link
            href="/blog"
            className="text-sm text-gray-600 hover:text-green-700 transition"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="p-6">
                <p className="text-xs text-gray-500 mb-2">
                  {post.date}
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
