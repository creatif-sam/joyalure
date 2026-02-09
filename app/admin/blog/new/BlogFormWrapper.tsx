"use client";

import dynamic from "next/dynamic";

// We import the local BlogForm and strictly disable SSR
const DynamicForm = dynamic(
  () => import("./BlogForm").then((mod) => mod.BlogForm),
  { 
    ssr: false,
    loading: () => <div className="h-96 animate-pulse bg-zinc-900/50 rounded-3xl" />
  }
);

export default function BlogFormWrapper() {
  return <DynamicForm />;
}