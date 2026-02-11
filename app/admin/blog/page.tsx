"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Plus, FileText, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminBlog() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch posts on mount including the main_image column
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const supabase = createClient();
      
      // Institutional Fix: We must explicitly select 'main_image' to see it in the UI
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published, created_at, main_image') 
        .order('created_at', { ascending: false });
      
      if (error) toast.error("Failed to load posts from database");
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
      toast.success('Post removed from Joyalure ecosystem');
    }
  };

  const togglePublished = async (id: string, currentValue: boolean) => {
    const newValue = !currentValue;
    setBlogPosts(posts => posts.map(p => p.id === id ? { ...p, published: newValue } : p));
    
    const supabase = createClient();
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: newValue })
      .eq('id', id);

    if (error) {
      setBlogPosts(posts => posts.map(p => p.id === id ? { ...p, published: currentValue } : p));
      toast.error('Failed to sync visibility status');
    } else {
      toast.success(newValue ? 'Post is now Live' : 'Post moved to Draft');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
      <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest">Syncing Editorial Data...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100 uppercase italic">Editorial Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Archive and publish high-end skincare insights.</p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-green-600/20 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Article
        </Link>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-zinc-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-5 w-24">Visual</th>
                <th className="px-6 py-5">Article Metadata</th>
                <th className="px-4 py-5">Visibility</th>
                <th className="px-4 py-5">Date Created</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-green-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                    {/* IMAGE THUMBNAIL COLUMN */}
                    <td className="px-6 py-4">
                      <div className="h-14 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900 border dark:border-zinc-800 flex items-center justify-center group-hover:shadow-lg transition-all">
                        {post.main_image && post.main_image !== "" ? (
                          <img 
                            src={post.main_image} 
                            alt="" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="text-zinc-300 dark:text-zinc-700" size={20} />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 dark:text-gray-100 text-base tracking-tight">{post.title}</span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter mt-0.5">slug: /{post.slug}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <button 
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          post.published 
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/20" 
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                        }`}
                      >
                        {post.published ? "Live" : "Draft"}
                      </button>
                    </td>

                    <td className="px-4 py-4 text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                      {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/blog/${post.id}`} className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 text-zinc-400 hover:text-green-600 transition-all shadow-sm">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`} className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 text-zinc-400 hover:text-blue-500 transition-all shadow-sm">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 text-zinc-400 hover:text-red-500 transition-all shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <FileText className="h-12 w-12 text-zinc-200 dark:text-zinc-800" />
                       <p className="text-zinc-400 italic font-medium">The editorial desk is empty. No articles found.</p>
                    </div>
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