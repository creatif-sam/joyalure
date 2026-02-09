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

  const editorClass = "border dark:border-zinc-800 rounded-xl min-h-[200px] p-4 bg-gray-50 dark:bg-zinc-950 prose dark:prose-invert max-w-none focus:outline-none focus:ring-2 focus:ring-green-600 transition-all text-sm";

  // Memoize extensions to prevent unnecessary re-renders and "Duplicate Extension" warnings
  const extensions = useMemo(() => [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
  ], []);

  const excerptEditor = useEditor({
    extensions,
    content: '',
    editorProps: { attributes: { class: 'focus:outline-none' } },
    immediatelyRender: false,
  });

  const contentEditor = useEditor({
    extensions,
    content: '',
    editorProps: { attributes: { class: 'focus:outline-none' } },
    immediatelyRender: false,
  });

  // Safety: Cleanup editors and handle AbortError silently
  useEffect(() => {
    return () => {
      try {
        if (excerptEditor) excerptEditor.destroy();
        if (contentEditor) contentEditor.destroy();
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error("Editor Cleanup Error:", e);
      }
    };
  }, [excerptEditor, contentEditor]);

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
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        mainImageUrl = supabase.storage.from('blog-images').getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Data Preparation (Aligned to your JSONB schema)
      const postData = {
        title: formData.get('title') as string,
        slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
        excerpt: excerptEditor?.getText() || "", // Stores as Text
        content: contentEditor?.getJSON() || {}, // Stores as JSONB
        published: publishNow,
        main_image: mainImageUrl,
        meta_description: formData.get('meta_description') as string,
      };

      const { error } = await supabase.from('blog_posts').insert([postData]);
      if (error) throw error;

      toast.success(publishNow ? "Article Published!" : "Draft Saved Successfully");
      router.push('/admin/blog');
      router.refresh();
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast.error("Process Failed", { description: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden border-t-4 border-t-green-600">
      <CardHeader className="border-b dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50 flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg text-green-600">
                <Rocket size={20} />
            </div>
            <CardTitle className="text-xl font-black tracking-tight dark:text-gray-100 uppercase">Editorial Desk</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-500 hover:text-red-500 font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" /> DISCARD
        </Button>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          
          {/* HEADER INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Title</Label>
              <Input name="title" required className="bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl py-6" placeholder="The Future of Skincare..." />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">SEO Meta Description</Label>
              <Input name="meta_description" className="bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl py-6" placeholder="Brief summary for search engines..." />
            </div>
          </div>

          {/* IMAGE PREVIEW & UPLOAD */}
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Featured Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed dark:border-zinc-800 rounded-2xl p-6 bg-gray-50/50 dark:bg-zinc-950/50 transition-colors hover:border-green-600/50">
              {imagePreview ? (
                <div className="relative w-full h-56 mb-4 group">
                  <img src={imagePreview} className="w-full h-full object-cover rounded-xl border dark:border-zinc-800 shadow-lg" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => { setImagePreview(null); }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                    <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-500 mb-4 font-medium">PNG, JPG or WEBP (Max 5MB)</p>
                </div>
              )}
              <Input 
                name="image_file" 
                type="file" 
                accept="image/*" 
                className="max-w-xs cursor-pointer file:bg-green-600 file:text-white file:border-0 file:rounded-lg file:px-4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>

          {/* EXCERPT */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Excerpt</Label>
            <Toolbar editor={excerptEditor} />
            <div className={editorClass}>
              <EditorContent editor={excerptEditor} />
            </div>
          </div>

          {/* CONTENT */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Body Content (JSONB Body)</Label>
            <Toolbar editor={contentEditor} />
            <div className={editorClass}>
              <EditorContent editor={contentEditor} />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t dark:border-zinc-800">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold px-8 py-7 rounded-2xl flex-1 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              <Save className="mr-2 h-5 w-5" />
              {loading ? 'Processing...' : 'Save as Draft'}
            </Button>
            
            <Button 
              type="button"
              onClick={(e) => {
                const form = e.currentTarget.closest('form');
                if (form?.checkValidity()) {
                  const event = new Event('submit', { cancelable: true }) as any;
                  handleSubmit(event, true);
                } else {
                  form?.reportValidity();
                }
              }}
              disabled={loading} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-7 rounded-2xl shadow-lg shadow-green-600/20 flex-1 transition-all active:scale-95"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Publish to Joyalure
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// SHARED TOOLBAR
function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  const btnClass = "p-2.5 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 active:scale-90";
  const activeClass = "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20 shadow-sm";

  return (
    <div className="flex flex-wrap gap-1 mb-2 border dark:border-zinc-800 p-1.5 rounded-xl bg-white dark:bg-zinc-950 shadow-sm sticky top-0 z-10">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}><Bold size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}><Italic size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${btnClass} ${editor.isActive('underline') ? activeClass : ''}`}><UnderlineIcon size={16}/></button>
      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}><Heading1 size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}><Heading2 size={16}/></button>
      <div className="w-px h-6 bg-gray-200 dark:bg-zinc-800 mx-1 self-center" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}><List size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}><ListOrdered size={16}/></button>
      <button type="button" onClick={() => {
        const url = prompt('Enter URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} className={`${btnClass} ${editor.isActive('link') ? activeClass : ''}`}><Link2 size={16}/></button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} className={btnClass}><XCircle size={16}/></button>
    </div>
  );
}