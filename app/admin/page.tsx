"use client"

import { useEffect, useState, useCallback } from "react"
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard"
import RecentOrdersTable from "@/app/admin/components/admin/RecentOrdersTable"
import { createClient } from "@/lib/supabase/client"
import {
  RefreshCcw,
  DollarSign,
  ShoppingCart,
  Users,
  MousePointerClick,
  TrendingUp,
  Smartphone,
  Globe,
  Loader2,
} from "lucide-react"

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

      setStats({
        revenue: totalRevenue / 100,
        orders: (ordersRes.data ?? []).length,
        customers: customersRes.count ?? 0,
      })
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
    <div className="space-y-6 pb-10">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Joyalure store performance</p>
        </div>
        <button
          onClick={() => fetchDashboardMetrics(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardStatCard
          title="Total Revenue"
          value={loading ? "—" : `$${stats.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <DashboardStatCard
          title="Total Orders"
          value={loading ? "—" : stats.orders.toLocaleString()}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <DashboardStatCard
          title="Customers"
          value={loading ? "—" : stats.customers.toLocaleString()}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* TikTok Analytics */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-4 w-4 text-pink-500" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">TikTok Shop Clicks</h2>
          </div>
          <button
            onClick={fetchTiktokStats}
            disabled={loadingTiktok}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-zinc-700 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCcw className={`h-3 w-3 ${loadingTiktok ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="p-5">
          {loadingTiktok ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : tiktokStats ? (
            <div className="space-y-5">
              {/* Click Counts */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "All Time", value: tiktokStats.summary?.total_clicks ?? 0, icon: <MousePointerClick className="h-3.5 w-3.5" /> },
                  { label: "24 Hours",  value: tiktokStats.summary?.clicks_last_24h ?? 0, icon: <TrendingUp className="h-3.5 w-3.5" /> },
                  { label: "7 Days",    value: tiktokStats.summary?.clicks_last_7d ?? 0,  icon: <TrendingUp className="h-3.5 w-3.5" /> },
                  { label: "30 Days",   value: tiktokStats.summary?.clicks_last_30d ?? 0, icon: <TrendingUp className="h-3.5 w-3.5" /> },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 dark:bg-zinc-800 rounded-md p-3 border border-gray-100 dark:border-zinc-700">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">{item.icon}<span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span></div>
                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{item.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Device & Country */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-100 dark:border-zinc-800 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Device Types</h4>
                  </div>
                  {Object.keys(tiktokStats.deviceStats ?? {}).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(tiktokStats.deviceStats).map(([device, count]) => {
                        const total = tiktokStats.summary?.clicks_last_30d || 1
                        return (
                          <div key={device} className="flex items-center justify-between gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px]">{device}</span>
                            <div className="flex-1 bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5">
                              <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: `${Math.min((count / total) * 100, 100)}%` }} />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No data yet</p>
                  )}
                </div>

                <div className="border border-gray-100 dark:border-zinc-800 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-3.5 w-3.5 text-gray-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Top Countries</h4>
                  </div>
                  {Object.keys(tiktokStats.countryStats ?? {}).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(tiktokStats.countryStats)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([country, count]) => {
                          const total = tiktokStats.summary?.clicks_last_30d || 1
                          return (
                            <div key={country} className="flex items-center justify-between gap-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] truncate">{country}</span>
                              <div className="flex-1 bg-gray-100 dark:bg-zinc-700 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min((count / total) * 100, 100)}%` }} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">{count}</span>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No data yet</p>
                  )}
                </div>
              </div>

              {/* 30-Day Bar Chart */}
              {Object.keys(tiktokStats.clicksByDate ?? {}).length > 0 && (
                <div className="border border-gray-100 dark:border-zinc-800 rounded-md p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Last 30 Days</h4>
                  <div className="flex items-end gap-0.5 h-24">
                    {Object.entries(tiktokStats.clicksByDate)
                      .slice(-30)
                      .map(([date, count]) => {
                        const max = Math.max(...Object.values(tiktokStats.clicksByDate))
                        const pct = max > 0 ? (count / max) * 100 : 0
                        return (
                          <div
                            key={date}
                            className="flex-1 bg-pink-400 dark:bg-pink-500 rounded-sm min-w-[3px] hover:bg-pink-500 dark:hover:bg-pink-400 transition-colors group relative"
                            style={{ height: `${Math.max(pct, 2)}%` }}
                            title={`${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${count}`}
                          />
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-8 text-center">No TikTok data available</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Orders</h2>
        </div>
        <RecentOrdersTable />
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    conversion: "3.2%",
  });
  const [tiktokStats, setTiktokStats] = useState<any>(null);
  const [loadingTiktok, setLoadingTiktok] = useState(true);

  const fetchDashboardMetrics = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      
      const [ordersRes, customersRes] = await Promise.all([
        supabase.from("orders").select("total_amount"),
        supabase.from("customers").select("id", { count: "exact", head: true })
      ]);

      if (ordersRes.error) throw ordersRes.error;

      const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.total_amount || 0), 0);
      
      setStats((prev) => ({
        ...prev,
        revenue: totalRevenue / 100,
        orders: ordersRes.data.length,
        customers: customersRes.count || 0,
      }));
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [supabase]);

  const fetchTiktokStats = useCallback(async () => {
    try {
      setLoadingTiktok(true);
      const response = await fetch('/api/tiktok-clicks');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setTiktokStats(result.data);
        }
      }
    } catch (error) {
      console.error("TikTok Stats Error:", error);
    } finally {
      setLoadingTiktok(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchTiktokStats();
  }, [fetchDashboardMetrics, fetchTiktokStats]);

  return (
    // Institutional Note: Reduced horizontal padding on mobile (px-4) vs desktop (px-0 if parent has it)
    <section className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">
      
      {/* Header Section with Refresh for Mobile */}
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
          <RefreshCcw className={`h-4 w-4 text-zinc-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid: 2 columns on mobile, 4 on desktop */}
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

      {/* Analytics Visualization: Optimized padding for small screens */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2rem] overflow-hidden shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sales Velocity</h3>
          {(loading || refreshing) && <Loader2 className="h-3 w-3 animate-spin text-green-600" />}
        </div>
        <div className="h-[200px] md:h-auto">
          <DashboardChartPlaceholder />
        </div>
      </div>

      {/* TikTok Shop Button Analytics */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-green-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-green-950/20 border-2 border-pink-200 dark:border-pink-800 rounded-[2rem] overflow-hidden shadow-lg p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
              <MousePointerClick className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-black uppercase tracking-wide text-gray-900 dark:text-gray-100">
                TikTok Shop Clicks
              </h3>
              <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Button Performance Analytics
              </p>
            </div>
          </div>
          <button 
            onClick={fetchTiktokStats}
            disabled={loadingTiktok}
            className="p-2 bg-white dark:bg-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCcw className={`h-4 w-4 text-pink-600 dark:text-pink-400 ${loadingTiktok ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loadingTiktok ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
          </div>
        ) : tiktokStats ? (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-pink-200 dark:border-pink-900">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="h-4 w-4 text-pink-600" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Total</p>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                  {tiktokStats.summary?.total_clicks || 0}
                </p>
                <p className="text-[8px] text-gray-400 mt-1">All-time clicks</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-purple-200 dark:border-purple-900">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">24 Hours</p>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                  {tiktokStats.summary?.clicks_last_24h || 0}
                </p>
                <p className="text-[8px] text-gray-400 mt-1">Last day</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-green-200 dark:border-green-900">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">7 Days</p>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                  {tiktokStats.summary?.clicks_last_7d || 0}
                </p>
                <p className="text-[8px] text-gray-400 mt-1">Last week</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">30 Days</p>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">
                  {tiktokStats.summary?.clicks_last_30d || 0}
                </p>
                <p className="text-[8px] text-gray-400 mt-1">Last month</p>
              </div>
            </div>

            {/* Device & Geographic Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Device Stats */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Device Types
                  </h4>
                </div>
                <div className="space-y-2">
                  {tiktokStats.deviceStats && Object.entries(tiktokStats.deviceStats).length > 0 ? (
                    Object.entries(tiktokStats.deviceStats).map(([device, count]: [string, any]) => (
                      <div key={device} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{device}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                              style={{ 
                                width: `${(count / (tiktokStats.summary?.clicks_last_30d || 1)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No device data yet</p>
                  )}
                </div>
              </div>

              {/* Country Stats */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Geographic Distribution
                  </h4>
                </div>
                <div className="space-y-2">
                  {tiktokStats.countryStats && Object.entries(tiktokStats.countryStats).length > 0 ? (
                    Object.entries(tiktokStats.countryStats)
                      .sort((a: any, b: any) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([country, count]: [string, any]) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {country === 'Unknown' ? '🌍 Unknown' : `🌍 ${country}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                style={{ 
                                  width: `${(count / (tiktokStats.summary?.clicks_last_30d || 1)) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 min-w-[2rem] text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No geographic data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Click Trend Chart */}
            {tiktokStats.clicksByDate && Object.keys(tiktokStats.clicksByDate).length > 0 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
                  Last 30 Days Trend
                </h4>
                <div className="flex items-end gap-1 h-32">
                  {Object.entries(tiktokStats.clicksByDate)
                    .slice(-30)
                    .map(([date, count]: [string, any]) => {
                      const maxClicks = Math.max(...Object.values(tiktokStats.clicksByDate).map((c: any) => c || 0));
                      const height = maxClicks > 0 ? (count / maxClicks) * 100 : 0;
                      return (
                        <div 
                          key={date} 
                          className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t min-w-[4px] hover:opacity-75 transition-opacity group relative"
                          style={{ height: `${height}%` }}
                          title={`${date}: ${count} clicks`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {count}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>

      {/* Data Table Section: Horizontal Scroll safety */}
      <div className="space-y-3">
        <h2 className="text-sm md:text-lg font-black text-gray-900 dark:text-gray-100 uppercase px-1">
          Recent Activity
        </h2>
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden">
          {/* Wrapper for horizontal scroll on tiny devices */}
          <div className="overflow-x-auto">
             <RecentOrdersTable />
          </div>
        </div>
      </div>
    </section>
  );
}