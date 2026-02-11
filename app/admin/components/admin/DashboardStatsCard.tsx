"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

export default function AdminDashboard() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: { val: 0, delta: "0%" },
    orders: { val: 0, delta: "0%" },
    customers: { val: 0, delta: "0%" },
  });

  const calculateDelta = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const percentage = ((current - previous) / previous) * 100;
    return `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    
    // Timeframes
    const now = new Date();
    const thisMonthStart = startOfMonth(now).toISOString();
    const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString();
    const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString();

    const [thisMonthOrders, lastMonthOrders, customers] = await Promise.all([
      // Current Month Orders
      supabase.from("orders").select("total_amount").gte("created_at", thisMonthStart),
      // Previous Month Orders
      supabase.from("orders").select("total_amount").gte("created_at", lastMonthStart).lte("created_at", lastMonthEnd),
      // Total Lifetime Customers
      supabase.from("customers").select("id", { count: "exact", head: true })
    ]);

    // Revenue Calculations
    const curRev = thisMonthOrders.data?.reduce((a, b) => a + (b.total_amount || 0), 0) || 0;
    const prevRev = lastMonthOrders.data?.reduce((a, b) => a + (b.total_amount || 0), 0) || 0;

    // Order Calculations
    const curOrd = thisMonthOrders.data?.length || 0;
    const prevOrd = lastMonthOrders.data?.length || 0;

    setMetrics({
      revenue: { val: curRev / 100, delta: calculateDelta(curRev, prevRev) },
      orders: { val: curOrd, delta: calculateDelta(curOrd, prevOrd) },
      customers: { val: customers.count || 0, delta: "+12%" }, // Customer growth mocked
    });
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardStatCard 
        title="Revenue" 
        value={loading ? "..." : `$${metrics.revenue.val.toLocaleString()}`} 
        delta={metrics.revenue.delta} 
      />
      <DashboardStatCard 
        title="Orders" 
        value={loading ? "..." : metrics.orders.val.toString()} 
        delta={metrics.orders.delta} 
      />
      <DashboardStatCard 
        title="Total Customers" 
        value={loading ? "..." : metrics.customers.val.toString()} 
        delta={metrics.customers.delta} 
      />
    </div>
  );
}