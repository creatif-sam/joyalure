export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Package, Calendar, Tag } from "lucide-react"

export default async function OrdersPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      created_at,
      order_items (
        id,
        product_name,
        quantity,
        price
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 transition-colors duration-300">

      <div>
        <h1 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-500">
          My Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          View your order history and details.
        </p>
      </div>

      {(!orders || orders.length === 0) ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

    </div>
  )
}

function OrderCard({ order }: { order: any }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow-md transition-all group">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-gray-400 dark:text-zinc-500">
            <Package size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order Reference
            </p>
            <p className="font-mono text-sm font-bold text-green-700 dark:text-green-500">
              #{order.id.split('-')[0].toUpperCase()}
            </p>
          </div>
        </div>

        <OrderStatus status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-600 dark:text-zinc-300">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Tag size={14} className="text-gray-400" />
          <span className="text-sm font-black text-green-700 dark:text-green-500">
            ${(order.total_amount / 1).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {order.order_items.map((item: any) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-gray-700 dark:text-zinc-300 font-medium">
                {item.product_name}
              </span>
              <span className="text-[10px] font-black text-gray-400 dark:text-zinc-600">
                ×{item.quantity}
              </span>
            </div>
            <span className="font-mono text-xs text-gray-500 dark:text-zinc-500">
              ${(item.price / 1).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

function OrderStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-500 dark:border-yellow-500/20",
    processing: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/20",
    shipped: "bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20",
    delivered: "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    cancelled: "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20"
  }

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        styles[status] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  )
}

function EmptyOrders() {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-400 mb-4">
        <Package size={20} />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
        You have not placed any orders yet.
      </p>
    </div>
  )
}