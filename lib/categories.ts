import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getHomeCategories() {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  // Fetch categories. We select 'image_url' because that's what we just added.
  const { data, error } = await supabase
    .from('categories')
    .select('name, slug, image_url')
    .limit(4);

  if (error) {
    console.error("Categories Fetch Error:", error.message);
    return [];
  }

  return data;
}