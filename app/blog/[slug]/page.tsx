import Link from "next/link"
import { blogPosts } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import TableOfContents from "@/components/blog/TableOfContents"
import BlogSidebarProducts from "@/components/blog/BlogSideBarProducts"
import Comments from "@/components/blog/Comments"


export const dynamic = "force-dynamic"


type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* ARTICLE */}
        <article className="lg:col-span-2">
          <Link
            href="/blog"
            className="text-sm text-gray-600 hover:text-green-700"
          >
            ← Back to Journal
          </Link>

          <h1 className="text-4xl font-semibold mt-6 mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-gray-500 mb-8">
            {post.date} • {post.author}
          </p>

          <img
            src={post.image}
            alt={post.title}
            className="w-full h-[420px] object-cover rounded-2xl mb-12"
          />

          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                {section.title}
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                {section.content.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </section>
          ))}

          <Comments />
        </article>

        {/* SIDEBAR */}
        <aside className="hidden lg:block space-y-8">
          <div className="sticky top-28 space-y-8">
            <TableOfContents sections={post.sections} />
            <BlogSidebarProducts />
          </div>
        </aside>

      </div>
    </section>
  )
}
