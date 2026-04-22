import { NextResponse } from "next/server"
import { getShopifyProducts } from "@/lib/shopify"

export async function GET() {
  try {
    const all = await getShopifyProducts(50)
    const recent = all.filter((p) => p.is_recent)
    return NextResponse.json(recent)
  } catch (error) {
    console.error("[GET /api/products/recent]", error)
    return NextResponse.json({ error: "Failed to fetch recent products" }, { status: 500 })
  }
}
