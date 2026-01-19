import { blogPosts } from "@/lib/blog-data"
import BlogLayout from "@/components/blog/BlogLayout"

export default function BlogPage() {
  return <BlogLayout posts={blogPosts} />
}
