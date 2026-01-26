import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const product_id: string | undefined = body.product_id
    const stock: number | undefined = body.stock

    if (!product_id || typeof stock !== "number") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from("inventory")
      .upsert(
        { product_id, stock },
        { onConflict: "product_id" }
      )

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
