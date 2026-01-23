import { NextResponse } from "next/server"
import { getRecentProducts } from "@/lib/products.server"

export async function GET() {
  const products = await getRecentProducts()
  return NextResponse.json(products)
}
