import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerSupabaseClient({
    cookies: await cookies()
  })

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      is_featured,
      is_recent,
      created_at
    `)
    .eq("active", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
