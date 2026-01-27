"use client";

import nextDynamic from "next/dynamic";
import { Suspense } from "react";

// 1. This handles the "dynamic" requirement correctly for both Client and Server components
export const dynamic = 'force-dynamic';

const BlogForm = nextDynamic(() => 
  import("./BlogForm").then(mod => ({ default: mod.BlogForm }))
);

export default function NewBlogPost() {
  // 2. Removed headers() call that was causing the crash
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Blog Post</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogForm />
      </Suspense>
    </div>
  );
}