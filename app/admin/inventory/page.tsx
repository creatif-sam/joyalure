import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import InventoryPageUI from "@/components/admin/InventoryPageUI"
import { unstable_noStore } from "next/cache"

type InventoryRow = {
  stock: number | null
}

type InventoryProduct = {
  id: string
  title: string
  price: number
  image_url: string | null
  inventory: InventoryRow[] | null
}

export default async function AdminInventory() {
  unstable_noStore()

  const cookieStore = await cookies()

  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      image_url,
      inventory ( stock )
    `)
    .order("title")

  if (error) {
    console.error("Inventory fetch error", error)
    throw new Error(error.message)
  }

  const safeProducts: InventoryProduct[] = products ?? []

  const lowStockProducts = safeProducts.filter(product => {
    const stock = product.inventory?.[0]?.stock ?? 0
    return stock < 10
  })

  return (
    <InventoryPageUI
      products={safeProducts}
      lowStockProducts={lowStockProducts}
    />
  )
}
