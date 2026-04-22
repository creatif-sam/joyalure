import { NextResponse } from "next/server"
import { getShopifyProducts } from "@/lib/shopify"

export async function GET() {
  try {
    const products = await getShopifyProducts(50)
    return NextResponse.json(products)
  } catch (error) {
    console.error("[GET /api/products]", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
