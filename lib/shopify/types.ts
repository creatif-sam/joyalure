// ─── Raw Shopify Storefront API Types ─────────────────────────────────────────

export type ShopifyVariant = {
  id: string
  title: string
  price: { amount: string; currencyCode: string }
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
  image?: { url: string; altText: string | null }
}

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  tags: string[]
  productType: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  images: {
    edges: { node: { url: string; altText: string | null } }[]
  }
  variants: {
    edges: { node: ShopifyVariant }[]
  }
  collections: {
    edges: { node: { handle: string; title: string } }[]
  }
}

export type ShopifyCartLine = {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: { amount: string; currencyCode: string }
    product: { title: string; handle: string }
    image?: { url: string }
  }
}

export type ShopifyCart = {
  id: string
  checkoutUrl: string
  lines: { edges: { node: ShopifyCartLine }[] }
  cost: {
    totalAmount: { amount: string; currencyCode: string }
    subtotalAmount: { amount: string; currencyCode: string }
  }
}

// ─── Normalized types (compatible with existing components) ───────────────────

export type NormalizedProduct = {
  id: string
  handle: string
  title: string
  description: string
  price: number       // stored in cents to match existing component expectations
  image_url: string | null
  is_featured: boolean
  is_recent: boolean
  category: { name: string } | null
  variantId: string   // default variant – required for Shopify cart
  availableForSale: boolean
}
