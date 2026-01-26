import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getRecentProducts(limit = 8) {
  const cookieStore = await cookies()

  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const { data, error } = await supabase
    .from("products")
    .select("id, name, title, price, image_url, image, is_recent")
    .eq("is_recent", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

export async function getFeaturedProducts() {
  const cookieStore = await cookies()

  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image_url")
    .eq("is_featured", true)

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}
