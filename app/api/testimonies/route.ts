import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient({
      cookies: await cookies()
    })
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured") === "true"

    let query = supabase
      .from("customer_testimonies")
      .select("*")
      .eq("is_active", true)

    if (featured) {
      query = query.eq("is_featured", true)
    }

    const { data: testimonies, error } = await query
      .order("rating", { ascending: false })
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching testimonies:", error)
      return NextResponse.json(
        { error: "Failed to fetch testimonies" },
        { status: 500 }
      )
    }

    return NextResponse.json({ testimonies: testimonies || [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
