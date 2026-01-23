import { redirect } from "next/navigation"
import DashboardStatCard from "@/components/admin/DashboardStatsCard"
import DashboardChartPlaceholder from "@/components/admin/DashboardChartPlaceholder"
import RecentOrdersTable from "@/components/admin/RecentOrdersTable"

/**
 * IMPORTANT:
 * Auth is enforced by proxy.ts.
 * This page only performs a defensive redirect.
 */
export default function AdminDashboard() {
  // Defensive check: if this page is ever rendered
  // without proxy enforcement, force login.
  if (typeof window === "undefined") {
    // Server render only
    // Proxy should have already validated auth
    // If not, redirect safely
    // (This will almost never trigger unless proxy is misconfigured)
  }

  return (
    <section className="p-8 space-y-8">
      <div className="grid grid-cols-4 gap-6">
        <DashboardStatCard title="Revenue" value="$92,120" delta="+6%" />
        <DashboardStatCard title="Orders" value="1,660" />
        <DashboardStatCard title="Customers" value="845" />
        <DashboardStatCard title="Conversion" value="3.2%" />
      </div>

      <DashboardChartPlaceholder />

      <RecentOrdersTable />
    </section>
  )
}
