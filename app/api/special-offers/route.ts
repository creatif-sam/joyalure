import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    })

    const { data: offers, error } = await supabase
      .from("special_offers")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching special offers:", error)
      return NextResponse.json(
        { error: "Failed to fetch special offers" },
        { status: 500 }
      )
    }

    // Filter out expired offers
    const now = new Date()
    const activeOffers = offers?.filter((offer) => {
      if (!offer.end_date) return true
      return new Date(offer.end_date) > now
    })

    return NextResponse.json({ offers: activeOffers || [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
