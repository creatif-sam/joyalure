"use client"

import { Eye, Pencil, Trash2, Plus, MoreVertical } from "lucide-react"
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
    <section className="space-y-6 md:space-y-8 animate-in fade-in duration-700 px-4 md:px-0">
      {/* HEADER: Stacked on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-gray-100">
            Products
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
            Joyalure Inventory Control
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all shadow-xl shadow-green-600/20 active:scale-95"
        >
          <Plus size={16} />
          New Product
        </Link>
      </div>

      {/* --- DESKTOP TABLE (Hidden on Mobile) --- */}
      <div className="hidden md:block bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-5">Title</th>
                <th className="px-4 py-5">Price</th>
                <th className="px-4 py-5 text-center">Featured</th>
                <th className="px-4 py-5 text-center">Recent</th>
                <th className="px-4 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {products.map(product => (
                <tr key={product.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all">
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900 dark:text-gray-100 italic">{product.title}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-tighter">/{product.slug}</div>
                  </td>
                  <td className="px-4 py-5 font-black text-zinc-700 dark:text-zinc-300">${product.price}</td>
                  <td className="px-4 py-5 text-center"><ToggleFeatured productId={product.id} initialValue={product.is_featured} /></td>
                  <td className="px-4 py-5 text-center"><ToggleRecent productId={product.id} initialValue={product.is_recent} /></td>
                  <td className="px-4 py-5 text-center">
                    <StatusBadge active={product.active} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionButtons 
                        product={product} 
                        onView={() => { setViewProduct(product); setModalOpen(true); }} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARD GRID (Visible on Mobile) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 italic text-sm">No products found.</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2rem] p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black italic uppercase text-zinc-900 dark:text-zinc-100">{product.title}</h3>
                  <p className="text-[10px] text-zinc-400 tracking-tighter uppercase">Ref: {product.id.slice(0,8)}</p>
                </div>
                <StatusBadge active={product.active} />
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y dark:border-zinc-800">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Featured</p>
                  <ToggleFeatured productId={product.id} initialValue={product.is_featured} />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Recent</p>
                  <ToggleRecent productId={product.id} initialValue={product.is_recent} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-green-600 dark:text-green-500">${product.price}</p>
                <div className="flex gap-2">
                  <ActionButtons 
                    product={product} 
                    mobile 
                    onView={() => { setViewProduct(product); setModalOpen(true); }} 
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ProductViewModal product={viewProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </section>
  )
}

/* Institutional Sub-Components */

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
      active 
      ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-100/50" 
      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400"
    }`}>
      {active ? "Active" : "Hidden"}
    </span>
  )
}

function ActionButtons({ product, onView, mobile = false }: { product: Product, onView: () => void, mobile?: boolean }) {
  const iconClass = "p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all active:scale-90"
  
  return (
    <>
      <button onClick={onView} className={iconClass}><Eye size={16} /></button>
      <Link href={`/admin/products/${product.id}`} className={iconClass}><Pencil size={16} /></Link>
      <button className={`${iconClass} hover:text-red-500`}><Trash2 size={16} /></button>
    </>
  )
}