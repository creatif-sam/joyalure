"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"

type Order = {
  id: string
  customer_email: string
  status: string
  total_amount: number
  created_at: string
}

const statusConfig: Record<string, string> = {
  completed: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-800",
  pending:   "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  processing:"bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-800",
}

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("orders")
      .select("id, customer_email, status, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setOrders((data as Order[]) ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 text-[13px]">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-zinc-400 text-[13px] max-w-[180px] truncate">
                  {order.customer_email}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 text-[13px]">
                  ${((order.total_amount || 0) / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-gray-400 dark:text-zinc-500 text-[12px]">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href="/admin/payments"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-gray-200 dark:border-zinc-700 text-gray-400 hover:text-green-600 hover:border-green-300 transition-colors"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-zinc-800">
        {orders.map((order) => (
          <div key={order.id} className="px-4 py-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[11px] text-gray-400 mb-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100 truncate max-w-[180px]">{order.customer_email}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-base font-semibold text-gray-900 dark:text-zinc-100">
                ${((order.total_amount || 0) / 100).toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls = statusConfig[status?.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${cls}`}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  )
}