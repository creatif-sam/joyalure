import { NextResponse } from "next/server"
import { createShopifyCart } from "@/lib/shopify"

/**
 * POST /api/shopify/cart
 *
 * Body: { lines: [{ merchandiseId: string; quantity: number }] }
 *
 * Creates a Shopify cart and returns the hosted checkout URL.
 * The client can then redirect to `checkoutUrl` to complete payment via Shopify.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { lines } = body

    if (!Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: "lines must be a non-empty array" },
        { status: 400 }
      )
    }

    // Validate each line has the required shape
    for (const line of lines) {
      if (typeof line.merchandiseId !== "string" || !line.merchandiseId) {
        return NextResponse.json(
          { error: "Each line must have a valid merchandiseId string" },
          { status: 400 }
        )
      }
      if (typeof line.quantity !== "number" || line.quantity < 1) {
        return NextResponse.json(
          { error: "Each line must have a quantity >= 1" },
          { status: 400 }
        )
      }
    }

    const cart = await createShopifyCart(lines)

    return NextResponse.json({ id: cart.id, checkoutUrl: cart.checkoutUrl })
  } catch (error) {
    console.error("[POST /api/shopify/cart]", error)
    return NextResponse.json(
      { error: "Failed to create Shopify cart" },
      { status: 500 }
    )
  }
}
