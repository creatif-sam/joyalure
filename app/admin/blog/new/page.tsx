"use client";

import nextDynamic from "next/dynamic";
import { Suspense } from "react";

// This tells Next.js to skip static generation for this page
export const dynamic = 'force-dynamic';

const BlogForm = nextDynamic(() => 
  import("./BlogForm").then(mod => ({ default: mod.BlogForm }))
);

export default function NewBlogPost() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Blog Post</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogForm />
      </Suspense>
    </div>
  );
}