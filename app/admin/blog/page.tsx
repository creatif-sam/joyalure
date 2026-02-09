"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminBlog() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published, created_at')
        .order('created_at', { ascending: false });
      
      if (error) toast.error("Failed to load posts");
      else setBlogPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Institutional Rule: Permanent deletion cannot be undone. Continue?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    
    if (error) {
      toast.error('Error deleting post');
    } else {
      setBlogPosts(posts => posts.filter(post => post.id !== id));
      toast.success('Post removed from database');
    }
  };

  const togglePublished = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    // Optimistic Update
    setBlogPosts(posts => posts.map(p => p.id === id ? { ...p, published: newValue } : p));
    
    const supabase = createClient();
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: newValue })
      .eq('id', id);

    if (error) {
      setBlogPosts(posts => posts.map(p => p.id === id ? { ...p, published: currentValue } : p));
      toast.error('Failed to update status');
    } else {
      toast.success(newValue ? 'Post is now Live' : 'Post moved to Draft');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading Blog...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">Editorial Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Create and manage content for the Joyalure blog.</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95"
        >
          <Plus size={18} />
          New Article
        </Link>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Article Title</th>
                <th className="px-4 py-4">URL Slug</th>
                <th className="px-4 py-4">Visibility</th>
                <th className="px-4 py-4">Date Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-400">
                          <FileText size={16} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-gray-500 dark:text-zinc-500">/{post.slug}</td>
                    <td className="px-4 py-4">
                      <button 
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${
                          post.published 
                          ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                          : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-500"
                        }`}
                      >
                        {post.published ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-zinc-500 text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/blog/${post.id}`} className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                          <Eye size={18} />
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <Pencil size={18} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-zinc-600 italic">
                    The editorial desk is empty. No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}