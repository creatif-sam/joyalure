import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getHomeCategories() {
  const cookieStore = await cookies();
  
  // FIXED: Pass an object with the cookies property, not just the store itself
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  // Fetching the real product count via a join
  const { data, error } = await supabase
    .from('categories')
    .select(`
      name, 
      slug, 
      image_url,
      count:products(count)
    `)
    .limit(4);

  if (error) {
    console.error("Categories Fetch Error:", error.message);
    return [];
  }

  // Format the count data to flatten the array return
  return data?.map(cat => ({
    ...cat,
    count: Array.isArray(cat.count) ? cat.count[0]?.count : 0
  })) || [];
}