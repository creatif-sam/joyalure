import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { productId, value } = await req.json()

  if (!productId || typeof value !== "boolean") {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("products")
    .update({ is_featured: value })
    .eq("id", productId)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
