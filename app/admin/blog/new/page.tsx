import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { Suspense } from "react";

const BlogForm = dynamic(() => import("./BlogForm").then(mod => ({ default: mod.BlogForm })));

export default function NewBlogPost() {
  // Make the page dynamic
  headers();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Blog Post 1</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogForm />
      </Suspense>
    </div>
  );
}