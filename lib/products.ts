import { getShopifyProducts } from "@/lib/shopify"

/**
 * Unified Parallel Fetcher
 * Used by the HomePage to get both lists in a single trip to Shopify.
 */
export async function getHomeProducts() {
  const all = await getShopifyProducts(50)
  const featured = all.filter((p) => p.is_featured).slice(0, 4)
  const recent = all.filter((p) => p.is_recent).slice(0, 4)
  return { featured, recent }
}

/**
 * Featured Products Fetcher
 */
export async function getFeaturedProducts() {
  const all = await getShopifyProducts(50)
  return all.filter((p) => p.is_featured).slice(0, 4)
}

/**
 * Recent Products Fetcher
 */
export async function getRecentProducts() {
  const all = await getShopifyProducts(50)
  return all.filter((p) => p.is_recent).slice(0, 4)
}