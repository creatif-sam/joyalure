"use client"

import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import ToggleFeatured from "./toggle-featured"
import ToggleRecent from "@/app/admin/components/admin/ToggleRecent"
import type { Product } from "@/types/product"

const ProductViewModal = dynamic(
  () => import("@/app/admin/components/admin/ProductViewModal"),
  { ssr: false }
)

export default function AdminProductsPageWrapper() {
  const [products, setProducts] = useState<Product[]>([])
  const [viewProduct, setViewProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/all")
        const data: Product[] = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <section className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your Joyalure inventory and visibility settings.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Featured</th>
                <th className="px-4 py-4">Recent</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y dark:divide-zinc-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-zinc-600 italic">
                    No products found in the database.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-gray-100">{product.title}</div>
                      <div className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 tracking-tighter">/{product.slug}</div>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                      ${product.price}
                    </td>

                    <td className="px-4 py-4">
                      <ToggleFeatured
                        productId={product.id}
                        initialValue={product.is_featured}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <ToggleRecent
                        productId={product.id}
                        initialValue={product.is_recent}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        product.active 
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
                        : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {product.active ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-500 dark:text-zinc-500">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setViewProduct(product)
                            setModalOpen(true)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductViewModal
        product={viewProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  )
}