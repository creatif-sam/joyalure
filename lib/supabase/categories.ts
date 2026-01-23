import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getCategories() {
  const supabase = createServerSupabaseClient()

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
