"use client";
import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Add this line right here
export const dynamic = 'force-dynamic';


export default function AdminBlog() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch posts on mount
  React.useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from('blog_posts').select('id, title, slug, published, created_at').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setBlogPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      alert('Error deleting post: ' + error.message);
    } else {
      setBlogPosts(posts => posts.filter(post => post.id !== id));
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading blog posts: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-left">Blog Posts</h1>
        <Link href="/admin/blog/new" className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition">New Post</Link>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="text-left">Slug</th>
              <th className="text-left">Published</th>
              <th className="text-left">Created</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((post: any) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 font-medium">{post.title}</td>
                  <td>{post.slug}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!post.published}
                      onChange={async (e) => {
                        // Optimistic UI update
                        const newValue = e.target.checked;
                        setBlogPosts(posts => posts.map(p => p.id === post.id ? { ...p, published: newValue } : p));
                        const supabase = createClient();
                        const { error } = await supabase
                          .from('blog_posts')
                          .update({ published: newValue })
                          .eq('id', post.id);
                        if (error) {
                          // Revert if error
                          setBlogPosts(posts => posts.map(p => p.id === post.id ? { ...p, published: !newValue } : p));
                          alert('Failed to update published status: ' + error.message);
                        }
                      }}
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                      aria-label="Toggle published"
                    />
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="space-x-2 flex items-center">
                    <Link href={`/admin/blog/${post.id}`} title="View">
                      <button type="button" className="p-2 hover:bg-green-100 rounded-full text-green-700" aria-label="View"><Eye size={18} /></button>
                    </Link>
                    <Link href={`/admin/blog/edit/${post.id}`} title="Edit">
                      <button type="button" className="p-2 hover:bg-blue-100 rounded-full text-blue-700" aria-label="Edit"><Pencil size={18} /></button>
                    </Link>
                    <button type="button" onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-100 rounded-full text-red-600" aria-label="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No blog posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}