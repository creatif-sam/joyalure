import { getShopifyProductByHandle } from "@/lib/shopify"
import { notFound } from "next/navigation"
import ProductDetailClient from "@/components/ProductDetailClient"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getShopifyProductByHandle(handle)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
