import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type Testimony = {
  id: string
  customer_name: string
  customer_location: string | null
  testimony_text: string | null
  screenshot_url: string
  rating: number | null
  platform: string | null
  verified_purchase: boolean
  testimony_date: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
}

export async function getTestimonies(): Promise<Testimony[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient({ cookies: cookieStore })

    const { data, error } = await supabase
      .from("customer_testimonies")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Failed to fetch testimonies:", error)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error("Unexpected error fetching testimonies:", error)
    return []
  }
}
