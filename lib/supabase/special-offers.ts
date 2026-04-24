import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type SpecialOffer = {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  image_url: string | null
  link_url: string | null
  end_date: string | null
  is_active: boolean
  display_order: number
}

export async function getSpecialOffers(): Promise<SpecialOffer[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerSupabaseClient({ cookies: cookieStore })

    const { data: offers, error } = await supabase
      .from("special_offers")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Failed to fetch special offers:", error)
      return []
    }

    const now = new Date()
    return (offers ?? []).filter((offer) => {
      if (!offer.end_date) return true
      return new Date(offer.end_date) > now
    })
  } catch (error) {
    console.error("Unexpected error fetching special offers:", error)
    return []
  }
}
