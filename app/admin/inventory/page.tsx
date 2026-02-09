import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import InventoryPageUI from "@/app/admin/components/admin/InventoryPageUI"
import { unstable_noStore } from "next/cache"

// Institutional Types: Reflecting the nested Supabase structure
export type InventoryProduct = {
  id: string
  title: string
  price: number
  image_url: string | null
  inventory: { stock: number | null }[] | null
}

export default async function AdminInventory() {
  unstable_noStore() // Ensures we get real-time stock levels

  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  // 1. Fetching products with nested inventory data
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image_url,
      inventory ( stock )
    `)
    .order("title", { ascending: true })

  if (error) {
    console.error("--- Inventory Fetch Failure ---")
    console.error(error)
    throw new Error("Failed to load inventory data.")
  }

  const safeProducts: InventoryProduct[] = products ?? []

  // 2. Identifying Low Stock items (Institutional Threshold: < 10)
  const lowStockProducts = safeProducts.filter(product => {
    const currentStock = product.inventory?.[0]?.stock ?? 0
    return currentStock < 10
  })

  return (
    <div className="animate-in fade-in duration-700">
      <InventoryPageUI
        products={safeProducts}
        lowStockProducts={lowStockProducts}
      />
    </div>
  )
}