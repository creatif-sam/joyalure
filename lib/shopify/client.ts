const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const API_VERSION = "2024-10"

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  // Warn at startup in development; in production missing env vars will throw
  // at the first API call so the app still compiles.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or " +
        "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables."
    )
  }
}

export type ShopifyFetchOptions = {
  query: string
  variables?: Record<string, unknown>
  /** Override cache behaviour. Omit to use default 5-minute revalidation. Pass "no-store" for mutations. */
  cache?: RequestCache
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
}: ShopifyFetchOptions): Promise<T> {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    // Default: cache product reads for 5 minutes to prevent repeated API calls
    // Mutations should pass cache: "no-store" explicitly
    ...(cache ? { cache } : { next: { revalidate: 300 } }),
  })

  if (!res.ok) {
    throw new Error(`Shopify Storefront API HTTP ${res.status}: ${res.statusText}`)
  }

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`)
  }

  return json.data as T
}
