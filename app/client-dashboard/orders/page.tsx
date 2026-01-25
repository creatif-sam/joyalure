export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-green-700 py-4">
          My Orders
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View your order history and details.
        </p>
      </div>

      {!orders || orders.length === 0 && (
        <EmptyOrders />
      )}

      <div className="space-y-4">
        {orders?.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

    </div>
  )
}

function OrderCard({ order }: { order: any }) {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-4 space-y-3">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            Order ID
          </p>
          <p className="font-medium text-green-700">
            {order.id}
          </p>
        </div>

        <OrderStatus status={order.status} />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>
          {new Date(order.created_at).toLocaleDateString()}
        </span>
        <span className="font-medium text-green-700">
          ${order.total_amount}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        {order.order_items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span className="text-gray-600">
              ${item.price}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

function OrderStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-green-100 text-green-700",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-100 text-red-700"
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  )
}

function EmptyOrders() {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-6 text-center">
      <p className="text-sm text-gray-500">
        You have not placed any orders yet.
      </p>
    </div>
  )
}
