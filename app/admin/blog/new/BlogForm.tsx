"use client";

import { useState, useEffect, useMemo } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, 
  List, ListOrdered, Link2, XCircle, Image as ImageIcon, 
  Save, Rocket, ArrowLeft 
} from "lucide-react";

export function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const editorClass = "border dark:border-zinc-800 rounded-xl min-h-[250px] p-4 bg-gray-50 dark:bg-zinc-950 prose dark:prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm";

  const extensions = useMemo(() => [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
  ], []);

  const excerptEditor = useEditor({
    extensions,
    content: '',
    immediatelyRender: false,
  });

  const contentEditor = useEditor({
    extensions,
    content: '',
    immediatelyRender: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, publishNow: boolean) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    try {
      let mainImageUrl = "";
      const imageFile = formData.get('image_file') as File;

      // 1. Image Upload Logic
      if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        // Upload to 'blog-images' bucket
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get the Public URL
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        mainImageUrl = data.publicUrl;
      }

      // 2. Data Preparation
      const title = formData.get('title') as string;
      const postData = {
        title,
        slug: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, ''),
        excerpt: excerptEditor?.getHTML() || "", // SAVING AS HTML STRING
        content: contentEditor?.getHTML() || "", // SAVING AS HTML STRING
        published: publishNow,
        main_image: mainImageUrl,
        meta_description: formData.get('meta_description') as string,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('blog_posts').insert([postData]);
      if (error) throw error;

      toast.success(publishNow ? "Joyalure Article Published!" : "Draft Archived Successfully");
      router.push('/admin/blog');
      router.refresh();
    } catch (error: any) {
      toast.error("Process Failed", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden border-t-8 border-t-green-600">
      <CardHeader className="border-b dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-row items-center justify-between p-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-2xl text-green-700">
                <Rocket size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-tighter dark:text-zinc-100 uppercase italic">Editorial Desk</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Institutional Content Manager</p>
            </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-zinc-400 hover:text-red-500 font-black tracking-widest text-[10px] uppercase">
          <ArrowLeft className="mr-2 h-4 w-4" /> DISCARD
        </Button>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Article Headline</Label>
              <Input name="title" required className="bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-2xl py-7 px-6 text-lg font-bold focus:ring-green-600" placeholder="The Ritual of Radiance..." />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">SEO Description</Label>
              <Input name="meta_description" className="bg-zinc-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-2xl py-7 px-6" placeholder="Discover the science behind..." />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Featured Cover Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed dark:border-zinc-800 rounded-[2.5rem] p-10 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-green-600/50 transition-all group">
              {imagePreview ? (
                <div className="relative w-full max-w-2xl h-64 mb-6">
                  <img src={imagePreview} className="w-full h-full object-cover rounded-3xl border dark:border-zinc-800 shadow-2xl" alt="Preview" />
                  <button type="button" onClick={() => setImagePreview(null)} className="absolute -top-3 -right-3 p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform">
                    <XCircle size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6">
                    <div className="p-5 rounded-full bg-white dark:bg-zinc-900 shadow-sm mb-4 text-zinc-300">
                      <ImageIcon size={40} />
                    </div>
                    <p className="text-xs text-zinc-400 font-black uppercase tracking-widest">Upload Editorial Visual</p>
                </div>
              )}
              <Input 
                name="image_file" 
                type="file" 
                accept="image/*" 
                className="max-w-xs cursor-pointer bg-white dark:bg-zinc-900 border-none shadow-sm rounded-xl py-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Summary (Excerpt)</Label>
            <Toolbar editor={excerptEditor} />
            <div className={editorClass}>
              <EditorContent editor={excerptEditor} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Main Narrative (Content)</Label>
            <Toolbar editor={contentEditor} />
            <div className={editorClass}>
              <EditorContent editor={contentEditor} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t dark:border-zinc-800">
            <Button type="submit" disabled={loading} className="h-20 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest text-xs rounded-3xl flex-1 transition-all hover:bg-zinc-200">
              <Save className="mr-2 h-5 w-5" /> {loading ? 'Saving...' : 'Archive Draft'}
            </Button>
            
            <Button 
              type="button"
              onClick={(e) => {
                const form = e.currentTarget.closest('form');
                if (form?.checkValidity()) {
                   const event = new Event('submit', { cancelable: true }) as any;
                   handleSubmit(event, true);
                } else form?.reportValidity();
              }}
              disabled={loading} 
              className="h-20 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-3xl shadow-xl shadow-green-600/20 flex-1 transition-all active:scale-95"
            >
              <Rocket className="mr-2 h-5 w-5" /> Publish to Joyalure
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const btnClass = "p-3 rounded-xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 active:scale-90";
  const activeClass = "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-500/20";

  return (
    <div className="flex flex-wrap gap-1 mb-2 border dark:border-zinc-800 p-2 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}><Bold size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}><Italic size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${btnClass} ${editor.isActive('underline') ? activeClass : ''}`}><UnderlineIcon size={18}/></button>
      <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800 mx-2 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}><Heading1 size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}><Heading2 size={18}/></button>
      <div className="w-px h-8 bg-zinc-100 dark:bg-zinc-800 mx-2 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}><List size={18}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}><ListOrdered size={18}/></button>
    </div>
  );
}