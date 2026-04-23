import { NextResponse } from "next/server"
import { getShopifyProducts } from "@/lib/shopify"

export const revalidate = 300

export async function GET() {
  try {
    const all = await getShopifyProducts(50)
    const featured = all.filter((p) => p.is_featured)
    return NextResponse.json(featured)
  } catch (error) {
    console.error("[GET /api/products/featured]", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
