
"use client";

import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  // Avoid duplicate extension instances by creating new ones for each editor
  const getExcerptExtensions = () => [
    StarterKit.configure({}),
    Underline.configure({}),
    Link.configure({ openOnClick: false })
  ];
  const getContentExtensions = () => [
    StarterKit.configure({}),
    Underline.configure({}),
    Link.configure({ openOnClick: false })
  ];

  const excerptEditor = useEditor({
    extensions: getExcerptExtensions(),
    content: '',
    onUpdate: ({ editor }) => {
      setExcerpt(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const contentEditor = useEditor({
    extensions: getContentExtensions(),
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Ensure the event target is a form
    const form = e.target as HTMLFormElement;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const formData = new FormData(form);


    const post = {
      slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
      title: formData.get('title') as string,
      excerpt: excerpt,
      content: content,
      // Only send fields that exist in the schema
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
            {/* Toolbar for excerpt rich text editing */}
            <div className="mb-2 flex flex-wrap gap-1">
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleBold().run()} className={excerptEditor?.isActive('bold') ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Bold"><b>B</b></button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleItalic().run()} className={excerptEditor?.isActive('italic') ? 'italic bg-gray-200 px-2 rounded' : 'px-2'} title="Italic"><i>I</i></button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleUnderline().run()} className={excerptEditor?.isActive('underline') ? 'underline bg-gray-200 px-2 rounded' : 'px-2'} title="Underline"><u>U</u></button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleHeading({ level: 1 }).run()} className={excerptEditor?.isActive('heading', { level: 1 }) ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Heading 1">H1</button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleHeading({ level: 2 }).run()} className={excerptEditor?.isActive('heading', { level: 2 }) ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Heading 2">H2</button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleBulletList().run()} className={excerptEditor?.isActive('bulletList') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Bullet List">• List</button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().toggleOrderedList().run()} className={excerptEditor?.isActive('orderedList') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Numbered List">1. List</button>
              <button type="button" onClick={() => {
                const url = prompt('Enter URL');
                if (url) excerptEditor?.chain().focus().setLink({ href: url }).run();
              }} className={excerptEditor?.isActive('link') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Add Link">🔗</button>
              <button type="button" onClick={() => excerptEditor?.chain().focus().unsetLink().run()} className="px-2" title="Remove Link">❌</button>
            </div>
            <div className="border rounded-md min-h-[100px] p-2 bg-white prose prose-sm max-w-none focus:outline-none">
              <EditorContent editor={excerptEditor} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Short summary. Formatting supported.</p>
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            {/* Toolbar for content rich text editing */}
            <div className="mb-2 flex flex-wrap gap-1">
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleBold().run()} className={contentEditor?.isActive('bold') ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Bold"><b>B</b></button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleItalic().run()} className={contentEditor?.isActive('italic') ? 'italic bg-gray-200 px-2 rounded' : 'px-2'} title="Italic"><i>I</i></button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleUnderline().run()} className={contentEditor?.isActive('underline') ? 'underline bg-gray-200 px-2 rounded' : 'px-2'} title="Underline"><u>U</u></button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleHeading({ level: 1 }).run()} className={contentEditor?.isActive('heading', { level: 1 }) ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Heading 1">H1</button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleHeading({ level: 2 }).run()} className={contentEditor?.isActive('heading', { level: 2 }) ? 'font-bold bg-gray-200 px-2 rounded' : 'px-2'} title="Heading 2">H2</button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleBulletList().run()} className={contentEditor?.isActive('bulletList') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Bullet List">• List</button>
              <button type="button" onClick={() => contentEditor?.chain().focus().toggleOrderedList().run()} className={contentEditor?.isActive('orderedList') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Numbered List">1. List</button>
              <button type="button" onClick={() => {
                const url = prompt('Enter URL');
                if (url) contentEditor?.chain().focus().setLink({ href: url }).run();
              }} className={contentEditor?.isActive('link') ? 'bg-gray-200 px-2 rounded' : 'px-2'} title="Add Link">🔗</button>
              <button type="button" onClick={() => contentEditor?.chain().focus().unsetLink().run()} className="px-2" title="Remove Link">❌</button>
            </div>
            <div className="border rounded-md min-h-[160px] p-2 bg-white prose prose-sm max-w-none focus:outline-none">
              <EditorContent editor={contentEditor} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Full blog content. Formatting supported.</p>
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
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
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