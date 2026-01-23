import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  const { productId, isRecent } = await req.json()
  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_recent: isRecent })
    .eq("id", productId)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
