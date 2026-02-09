import { Suspense } from "react";
import BlogFormWrapper from "./BlogFormWrapper";

export const dynamic = 'force-dynamic';

export default function NewBlogPost() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
          New Article
        </h2>
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          Joyalure Editorial Desk
        </p>
      </div>

      <Suspense fallback={<div className="h-96 w-full bg-zinc-900/50 animate-pulse rounded-3xl" />}>
        <BlogFormWrapper />
      </Suspense>
    </div>
  );
}