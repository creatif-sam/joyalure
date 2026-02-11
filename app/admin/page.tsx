"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard";
import DashboardChartPlaceholder from "@/app/admin/components/admin/DashboardChartPlaceholder";
import RecentOrdersTable from "@/app/admin/components/admin/RecentOrdersTable";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    conversion: "3.2%", // Mocked until analytics table is ready
  });

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Institutional Fetch: Parallel requests for maximum performance
      const [ordersRes, customersRes] = await Promise.all([
        supabase.from("orders").select("total_amount"),
        supabase.from("customers").select("id", { count: "exact", head: true })
      ]);

      if (ordersRes.error) throw ordersRes.error;

      // Calculate Total Revenue (assuming total_amount is stored in cents)
      const totalRevenue = ordersRes.data.reduce((acc, order) => acc + (order.total_amount || 0), 0);
      
      setStats((prev) => ({
        ...prev,
        revenue: totalRevenue / 100, // Format to dollars
        orders: ordersRes.data.length,
        customers: customersRes.count || 0,
      }));
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 italic uppercase">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Real-time metrics for Joyalure.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
          title="Total Revenue" 
          value={loading ? "..." : `$${stats.revenue.toLocaleString()}`} 
          delta="+6.4%" 
        />
        <DashboardStatCard 
          title="Total Orders" 
          value={loading ? "..." : stats.orders.toString()} 
          delta="+2.1%" 
        />
        <DashboardStatCard 
          title="Global Customers" 
          value={loading ? "..." : stats.customers.toString()} 
          delta="+12.5%" 
        />
        <DashboardStatCard 
          title="Conversion Rate" 
          value={stats.conversion} 
          delta="-0.4%" 
        />
      </div>

      {/* Analytics Visualization */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Sales Velocity</h3>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-green-600" />}
        </div>
        <DashboardChartPlaceholder />
      </div>

      {/* Data Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 px-1 italic uppercase">
          Recent Orders
        </h2>
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden">
          <RecentOrdersTable />
        </div>
      </div>
    </section>
  );
}