import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import CategoryForm from "../components/category/CategoryForm";
import CategoryList from "../components/category/CategoryList";
import { FolderTree } from "lucide-react";

export default async function CategoriesPage() {
  // 1. Initialize Supabase on the Server
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  // 2. Fetch existing categories - FIXED: Removed "created_at" to match your schema
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true }); // Ordering by name as a stable alternative

  // DEBUG LOGS
  console.log("--- Category Fetch Debug ---");
  console.log("Categories Data:", categories);
  if (error) console.error("Supabase Error:", error);
  console.log("----------------------------");

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <FolderTree size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Architecture</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Collections</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize your skincare range into logical customer-facing categories.
          </p>
        </div>
      </div>

      {/* 3. THE MANAGEMENT FORM */}
      <section>
        <CategoryForm />
      </section>

      {/* 4. THE LIVE LIST */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Collections</h2>
          <div className="h-[1px] flex-1 bg-gray-100" />
        </div>
        
        {/* Pass an empty array if categories is null to prevent .map errors */}
        <CategoryList categories={categories || []} />
      </section>
    </div>
  );
}