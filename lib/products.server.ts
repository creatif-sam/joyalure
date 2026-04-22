import { getShopifyProducts } from "@/lib/shopify"

export async function getRecentProducts(limit = 8) {
  const all = await getShopifyProducts(50)
  return all.filter((p) => p.is_recent).slice(0, limit)
}

export async function getFeaturedProducts() {
  const all = await getShopifyProducts(50)
  return all.filter((p) => p.is_featured)
}
