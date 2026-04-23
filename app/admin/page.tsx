"use client"

import { useEffect, useState, useCallback } from "react"
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard"
import DashboardChartPlaceholder from "@/app/admin/components/admin/DashboardChartPlaceholder"
import RecentOrdersTable from "@/app/admin/components/admin/RecentOrdersTable"
import TikTokClicksPanel from "@/app/admin/components/admin/TikTokClicksPanel"
import { createClient } from "@/lib/supabase/client"
import { RefreshCcw, DollarSign, ShoppingCart, Users, Loader2 } from "lucide-react"

type TiktokStats = {
  summary: {
    total_clicks: number
    clicks_last_24h: number
    clicks_last_7d: number
    clicks_last_30d: number
  }
  deviceStats: Record<string, number>
  countryStats: Record<string, number>
  clicksByDate: Record<string, number>
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    conversion: "3.2%",
  })
  const [tiktokStats, setTiktokStats] = useState<TiktokStats | null>(null)
  const [loadingTiktok, setLoadingTiktok] = useState(true)

  const fetchDashboardMetrics = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      else setRefreshing(true)

      const [ordersRes, customersRes] = await Promise.all([
        supabase.from("orders").select("total_amount"),
        supabase.from("customers").select("id", { count: "exact", head: true }),
      ])

      const totalRevenue = (ordersRes.data ?? []).reduce(
        (acc, o) => acc + (o.total_amount || 0),
        0
      )

      setStats((prev) => ({
        ...prev,
        revenue: totalRevenue / 100,
        orders: (ordersRes.data ?? []).length,
        customers: customersRes.count ?? 0,
      }))
    } catch (e) {
      console.error("Dashboard fetch error:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [supabase])

  const fetchTiktokStats = useCallback(async () => {
    try {
      setLoadingTiktok(true)
      const res = await fetch("/api/tiktok-clicks")
      if (res.ok) {
        const json = await res.json()
        if (json.success) setTiktokStats(json.data)
      }
    } catch (e) {
      console.error("TikTok fetch error:", e)
    } finally {
      setLoadingTiktok(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardMetrics()
    fetchTiktokStats()
  }, [fetchDashboardMetrics, fetchTiktokStats])

  return (
    <section className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
            Dashboard
          </h1>
          <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
            Joyalure Live Metrics
          </p>
        </div>
        <button
          onClick={() => fetchDashboardMetrics(true)}
          disabled={refreshing}
          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded active:rotate-180 transition-transform duration-500"
        >
          <RefreshCcw className={`h-4 w-4 text-zinc-500 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DashboardStatCard
          title="Revenue"
          value={loading ? "..." : `$${Math.round(stats.revenue)}`}
          delta="+6.4%"
        />
        <DashboardStatCard
          title="Orders"
          value={loading ? "..." : stats.orders.toString()}
          delta="+2.1%"
        />
        <DashboardStatCard
          title="Customers"
          value={loading ? "..." : stats.customers.toString()}
          delta="+12.5%"
        />
        <DashboardStatCard
          title="Conv."
          value={stats.conversion}
          delta="-0.4%"
        />
      </div>

      {/* Sales Map */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-md overflow-hidden shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sales Velocity</h3>
          {(loading || refreshing) && <Loader2 className="h-3 w-3 animate-spin text-green-600" />}
        </div>
        <div className="h-[200px] md:h-auto">
          <DashboardChartPlaceholder />
        </div>
      </div>

      {/* TikTok Analytics */}
      <TikTokClicksPanel
        stats={tiktokStats}
        loading={loadingTiktok}
        onRefresh={fetchTiktokStats}
      />

      {/* Recent Activity */}
      <div className="space-y-3">
        <h2 className="text-sm md:text-lg font-black text-gray-900 dark:text-gray-100 uppercase px-1">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-md shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <RecentOrdersTable />
          </div>
        </div>
      </div>
    </section>
  )
}
