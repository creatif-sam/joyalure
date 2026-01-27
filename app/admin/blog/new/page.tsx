"use client";

// 1. Rename this import to 'nextDynamic'
import nextDynamic from "next/dynamic"; 
import { headers } from "next/headers";
import { Suspense } from "react";

// 2. This is the correct Next.js convention for forcing dynamic rendering
export const dynamic = 'force-dynamic';

// 3. Use the new name 'nextDynamic' here
const BlogForm = nextDynamic(() => 
  import("./BlogForm").then(mod => ({ default: mod.BlogForm }))
);

export default function NewBlogPost() {
  headers();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Blog Post</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogForm />
      </Suspense>
    </div>
  );
}