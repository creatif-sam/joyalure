import { NextResponse } from "next/server"
import { getShopifyProductByHandle } from "@/lib/shopify"

/**
 * GET /api/shopify/products/[handle]
 *
 * Returns a single normalized product by its Shopify handle.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params

  if (!handle) {
    return NextResponse.json({ error: "Missing product handle" }, { status: 400 })
  }

  try {
    const product = await getShopifyProductByHandle(handle)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("[GET /api/shopify/products/:handle]", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
