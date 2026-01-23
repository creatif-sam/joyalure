import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { product_id, stock } = await req.json();
    if (!product_id || typeof stock !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    // Upsert inventory row for the product
    const { error } = await supabaseAdmin
      .from("inventory")
      .upsert({ product_id, stock }, { onConflict: ["product_id"] });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
