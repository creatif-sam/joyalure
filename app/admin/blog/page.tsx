import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore } from "next/cache";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
};

export default async function AdminBlog() {
  unstable_noStore();
  const supabase = await createClient();

  // Fetch blog posts from database
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts?.map((post: BlogPost) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="aspect-video relative mb-4">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">By {post.author}</span>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No blog posts found</p>
          </div>
        )}
      </div>
    </div>
  );
}