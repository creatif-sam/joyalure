"use client"

import { Eye, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import ToggleFeatured from "./toggle-featured"
import ToggleRecent from "@/components/admin/ToggleRecent"
import type { Product } from "@/types/product"

const ProductViewModal = dynamic(
  () => import("@/components/admin/ProductViewModal"),
  { ssr: false }
)

export default function AdminProductsPageWrapper() {
  const [products, setProducts] = useState<Product[]>([])
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products/all")
      const data: Product[] = await res.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <section className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New Product
        </Link>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Recent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No products yet
                </td>
              </tr>
            )}

            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3 font-medium">
                  {product.title}
                  <div className="text-xs text-gray-500">{product.slug}</div>
                </td>

                <td className="px-4 py-3">${product.price}</td>

                <td className="px-4 py-3">
                  <ToggleFeatured
                    productId={product.id}
                    initialValue={product.is_featured}
                  />
                </td>

                <td className="px-4 py-3">
                  <ToggleRecent
                    productId={product.id}
                    initialValue={product.is_recent}
                  />
                </td>

                <td className="px-4 py-3">
                  {product.active ? "Active" : "Hidden"}
                </td>

                <td className="px-4 py-3">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setViewProduct(product)
                      setModalOpen(true)
                    }}
                  >
                    <Eye className="w-5 h-5 text-gray-500 hover:text-blue-600" />
                  </button>

                  <Link href={`/admin/products/${product.id}`}>
                    <Pencil className="w-5 h-5 text-gray-500 hover:text-green-600" />
                  </Link>

                  <button>
                    <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductViewModal
        product={viewProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  )
}
