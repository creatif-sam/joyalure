import { getShopifyProducts } from "@/lib/shopify"
import ProductsGrid from "@/components/ProductsGrid"

// This page is now a server component — no loading spinner, no client-side fetch.
// Products are fetched at request time with 5-minute cache revalidation.

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const urlQuery = params.q || ""

  const products = await getShopifyProducts(50)

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 transition-colors duration-300">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-zinc-100 mb-4">
          {urlQuery ? `Results for "${urlQuery}"` : "Our Products"}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 max-w-lg mx-auto font-medium">
          {products.length} premium skincare solutions found.
        </p>
      </header>

      <ProductsGrid products={products} initialQuery={urlQuery} />
    </main>
  )
}
