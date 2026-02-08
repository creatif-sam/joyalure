import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Unified Parallel Fetcher
 * Used by the HomePage to get both lists in a single trip to the server.
 */
export async function getHomeProducts() {
  // Parallel execution prevents the "Waterfall" delay
  const [featured, recent] = await Promise.all([
    getFeaturedProducts(),
    getRecentProducts()
  ]);

  return { featured, recent };
}

/**
 * Featured Products Fetcher
 */
export async function getFeaturedProducts() {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      title, 
      price, 
      image_url,
      category:categories(name)
    `) 
    .eq('is_featured', true) 
    .eq('active', true)
    .limit(4);

  if (error) {
    console.error("Supabase Featured Error:", error.message);
    return [];
  }

  return data;
}

/**
 * Recent Products Fetcher
 */
export async function getRecentProducts() {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, 
      title, 
      price, 
      image_url,
      category:categories(name)
    `) 
    .eq('active', true)
    .order('created_at', { ascending: false }) // Newest first
    .limit(4);

  if (error) {
    console.error("Supabase Recent Error:", error.message);
    return [];
  }

  return data;
}