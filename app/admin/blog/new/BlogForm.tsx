"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BlogForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const formData = new FormData(e.currentTarget);
    const post = {
      slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      image: formData.get('image') as string,
      date: new Date().toISOString().split('T')[0],
      author: formData.get('author') as string,
      sections: [], // For simplicity, empty sections
    };

    const { error } = await supabase
      .from('blog_posts')
      .insert([post]);

    if (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post');
    } else {
      router.push('/admin/blog');
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Post Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              name="excerpt"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>

          <div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" required />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" type="url" required />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog Post'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}