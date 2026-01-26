import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getCategories() {
  const cookieStore = await cookies()

  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true })

  if (error) {
    console.error("Failed to fetch categories", error)
    return []
  }

  return data ?? []
}
