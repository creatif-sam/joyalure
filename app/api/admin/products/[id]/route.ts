import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient({
    cookies: cookies()
  })

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      description,
      price,
      image_url,
      active
    `)
    .eq("id", params.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const supabase = createServerSupabaseClient({
    cookies: cookies()
  })

  const { error } = await supabase
    .from("products")
    .update({
      title: body.title,
      description: body.description,
      price: body.price,
      image_url: body.image_url,
      active: body.active
    })
    .eq("id", params.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
