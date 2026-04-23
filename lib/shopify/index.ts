import { shopifyFetch } from "./client"
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
} from "./queries"
import type { ShopifyProduct, ShopifyCart, NormalizedProduct } from "./types"

// ─── Normalization ────────────────────────────────────────────────────────────

/**
 * Converts a raw Shopify product into the shape expected by existing components.
 * Price is stored in cents (× 100) to stay compatible with the current cart store.
 * `is_featured` / `is_recent` are derived from Shopify product tags.
 */
export function normalizeProduct(product: ShopifyProduct): NormalizedProduct {
  const priceAmount = parseFloat(product.priceRange.minVariantPrice.amount)
  const priceInCents = Math.round(priceAmount * 100)

  const firstImage = product.images.edges[0]?.node
  const firstVariant = product.variants.edges[0]?.node
  const firstCollection = product.collections.edges[0]?.node

  const tags = product.tags.map((t) => t.toLowerCase())

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description ?? "",
    price: priceInCents,
    image_url: firstImage?.url ?? null,
    is_featured: tags.includes("featured"),
    is_recent: tags.includes("recent") || tags.includes("new"),
    category: firstCollection ? { name: firstCollection.title } : null,
    variantId: firstVariant?.id ?? product.id,
    availableForSale: firstVariant?.availableForSale ?? true,
  }
}

// ─── Product Fetchers ─────────────────────────────────────────────────────────

export async function getShopifyProducts(first = 50): Promise<NormalizedProduct[]> {
  try {
    const data = await shopifyFetch<{
      products: { edges: { node: ShopifyProduct }[] }
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first },
      // Uses default 5-minute revalidation cache (set in shopifyFetch)
    })

    return data.products.edges.map(({ node }) => normalizeProduct(node))
  } catch (error) {
    console.error("[Shopify] getShopifyProducts error:", error)
    return []
  }
}

export async function getShopifyProductByHandle(
  handle: string
): Promise<NormalizedProduct | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      // Uses default 5-minute revalidation cache (set in shopifyFetch)
    })

    return data.product ? normalizeProduct(data.product) : null
  } catch (error) {
    console.error("[Shopify] getShopifyProductByHandle error:", error)
    return null
  }
}

// ─── Cart / Checkout ──────────────────────────────────────────────────────────

export type CartLineInput = {
  merchandiseId: string
  quantity: number
}

/**
 * Creates a Shopify cart and returns the cart ID and hosted checkout URL.
 * The checkout URL can be used to redirect the customer to Shopify's checkout.
 */
export async function createShopifyCart(
  lines: CartLineInput[]
): Promise<{ id: string; checkoutUrl: string }> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart
      userErrors: { field: string[]; message: string }[]
    }
  }>({
    query: CREATE_CART_MUTATION,
    variables: { lines },
  })

  const { cart, userErrors } = data.cartCreate

  if (userErrors.length > 0) {
    throw new Error(`Shopify cart error: ${userErrors[0].message}`)
  }

  return { id: cart.id, checkoutUrl: cart.checkoutUrl }
}

/**
 * Adds lines to an existing Shopify cart.
 */
export async function addLinesToShopifyCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart
      userErrors: { field: string[]; message: string }[]
    }
  }>({
    query: ADD_CART_LINES_MUTATION,
    variables: { cartId, lines },
  })

  const { cart, userErrors } = data.cartLinesAdd

  if (userErrors.length > 0) {
    throw new Error(`Shopify cartLinesAdd error: ${userErrors[0].message}`)
  }

  return cart
}
