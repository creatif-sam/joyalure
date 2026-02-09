import { redirect } from "next/navigation"
import DashboardStatCard from "@/app/admin/components/admin/DashboardStatsCard"
import DashboardChartPlaceholder from "@/app/admin/components/admin/DashboardChartPlaceholder"
import RecentOrdersTable from "@/app/admin/components/admin/RecentOrdersTable"

export default function AdminDashboard() {
  /**
   * Institutional Note: 
   * We removed 'p-8' here because AdminLayout already wraps this 
   * in a padded main container. This avoids excessive white space.
   */

  return (
    <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time metrics for Joyalure.
        </p>
      </div>

      {/* Stats Grid - Made responsive (1 col on mobile, 4 on lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
          title="Revenue" 
          value="$92,120" 
          delta="+6%" 
        />
        <DashboardStatCard 
          title="Orders" 
          value="1,660" 
          delta="+2%" 
        />
        <DashboardStatCard 
          title="Customers" 
          value="845" 
          delta="+12%" 
        />
        <DashboardStatCard 
          title="Conversion" 
          value="3.2%" 
          delta="-0.4%" 
        />
      </div>

      {/* Analytics Visualization */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <DashboardChartPlaceholder />
      </div>

      {/* Data Table Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 px-1">
          Recent Orders
        </h2>
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
          <RecentOrdersTable />
        </div>
      </div>
    </section>
  )
}