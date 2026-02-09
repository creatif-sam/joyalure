import ProductForm from "../product-form"
import Link from "next/link"
import { ChevronRight, Package, LayoutDashboard } from "lucide-react"

export default function NewProductPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* BREADCRUMBS */}
      <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
        <Link 
          href="/admin" 
          className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <LayoutDashboard className="mr-1 h-3 w-3" />
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link 
          href="/admin/inventory" 
          className="flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <Package className="mr-1 h-3 w-3" />
          Inventory
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100">Add Product</span>
      </nav>

      {/* HEADER */}
      <div className="max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
            Register New Item
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Fill in the details below to add a new product to your Joyalure store.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <ProductForm />
        </div>
      </div>
    </div>
  )
}