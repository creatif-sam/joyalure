"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard";
import DashboardChartPlaceholder from "@/app/admin/components/admin/DashboardChartPlaceholder";
import RecentOrdersTable from "@/app/admin/components/admin/RecentOrdersTable";
import { createClient } from "@/lib/supabase/client";
import { Loader2, RefreshCcw } from "lucide-react";

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

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  return (
    // Institutional Note: Reduced horizontal padding on mobile (px-4) vs desktop (px-0 if parent has it)
    <section className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">
      
      {/* Header Section with Refresh for Mobile */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 italic uppercase">
            Dashboard
          </h1>
          <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">
            Joyalure Live Metrics
          </p>
        </div>
        <button 
          onClick={() => fetchDashboardMetrics(true)}
          disabled={refreshing}
          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full active:rotate-180 transition-transform duration-500"
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
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Sales Velocity</h3>
          {(loading || refreshing) && <Loader2 className="h-3 w-3 animate-spin text-green-600" />}
        </div>
        <div className="h-[200px] md:h-auto">
          <DashboardChartPlaceholder />
        </div>
      </div>

      {/* Data Table Section: Horizontal Scroll safety */}
      <div className="space-y-3">
        <h2 className="text-sm md:text-lg font-black text-gray-900 dark:text-gray-100 italic uppercase px-1">
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