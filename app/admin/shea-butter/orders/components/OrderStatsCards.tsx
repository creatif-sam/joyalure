"use client"

import { ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react"

interface Stats {
  total_orders: number
  orders_last_24h: number
  orders_last_7d: number
  orders_last_30d: number
  total_revenue: number
  revenue_last_30d: number
  unique_customers: number
  average_order_value: number
}

export default function OrderStatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <ShoppingBag className="h-8 w-8 mb-3 opacity-80" />
        <p className="text-3xl font-black mb-1">{stats.total_orders}</p>
        <p className="text-xs uppercase tracking-wider opacity-80">Total Orders</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <DollarSign className="h-8 w-8 mb-3 opacity-80" />
        <p className="text-3xl font-black mb-1">${stats.total_revenue?.toFixed(2) || "0.00"}</p>
        <p className="text-xs uppercase tracking-wider opacity-80">Total Revenue</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
        <p className="text-3xl font-black mb-1">{stats.orders_last_30d}</p>
        <p className="text-xs uppercase tracking-wider opacity-80">Last 30 Days</p>
      </div>
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
        <Package className="h-8 w-8 mb-3 opacity-80" />
        <p className="text-3xl font-black mb-1">${stats.average_order_value?.toFixed(2) || "0.00"}</p>
        <p className="text-xs uppercase tracking-wider opacity-80">Avg Order Value</p>
      </div>
    </div>
  )
}
