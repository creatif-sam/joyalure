"use client"

import { useEffect, useState, useCallback } from "react"
import { RefreshCcw, Loader2, BarChart3 } from "lucide-react"
import AnalyticsKpiCards from "./components/AnalyticsKpiCards"
import TopPagesTable from "./components/TopPagesTable"
import ClickEventsTable from "./components/ClickEventsTable"
import CheckoutFunnelCard from "./components/CheckoutFunnelCard"
import DeviceBreakdown from "./components/DeviceBreakdown"
import TrafficChart from "./components/TrafficChart"
import ReferrersTable from "./components/ReferrersTable"

const RANGES = [
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
]

interface AnalyticsData {
  summary: {
    totalPageViews: number
    uniqueSessions: number
    totalClicks: number
    addToCart: number
    checkoutStart: number
    checkoutComplete: number
    checkoutAbandoned: number
    cartToCheckoutRate: number
    checkoutConversionRate: number
  }
  topPages: { page: string; views: number }[]
  topClicks: { element: string; count: number }[]
  topReferrers: { source: string; visits: number }[]
  deviceBreakdown: Record<string, number>
  browserBreakdown: Record<string, number>
  trafficByDay: { date: string; views: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("30")
  const [noTable, setNoTable] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/summary?range=${range}`)
      const json = await res.json()
      if (json.error && !json.data) {
        setNoTable(true)
      } else {
        setNoTable(false)
        setData(json)
      }
    } catch (e) {
      console.error("Analytics fetch error:", e)
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => { fetchData() }, [fetchData])

  const kpis = data
    ? [
        {
          label: "Page Views",
          value: data.summary.totalPageViews.toLocaleString(),
          sub: `Last ${range} days`,
          color: "bg-gradient-to-br from-violet-500 to-violet-700",
        },
        {
          label: "Unique Sessions",
          value: data.summary.uniqueSessions.toLocaleString(),
          sub: "Distinct visitors",
          color: "bg-gradient-to-br from-sky-500 to-sky-700",
        },
        {
          label: "Button Clicks",
          value: data.summary.totalClicks.toLocaleString(),
          sub: "All tracked clicks",
          color: "bg-gradient-to-br from-amber-500 to-amber-700",
        },
        {
          label: "Checkout Conversion",
          value: `${data.summary.checkoutConversionRate}%`,
          sub: `${data.summary.checkoutComplete} orders completed`,
          color: "bg-gradient-to-br from-green-500 to-green-700",
        },
      ]
    : []

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-violet-600" />
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
              Analytics
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
            Website KPIs &amp; visitor behaviour
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Range picker */}
          <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-md p-1 gap-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  range === r.value
                    ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md active:rotate-180 transition-transform duration-500"
          >
            <RefreshCcw className={`h-4 w-4 text-zinc-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Setup notice */}
      {noTable && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-6">
          <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Database table not set up yet</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
            Create an <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">analytics_events</code> table in your Supabase project to start collecting data.
          </p>
          <pre className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 rounded-md p-4 text-xs overflow-x-auto whitespace-pre-wrap">
{`create table analytics_events (
  id           uuid default gen_random_uuid() primary key,
  event_type   text not null,
  page         text,
  element      text,
  session_id   text,
  device_type  text,
  browser      text,
  referrer     text,
  ip_prefix    text,
  metadata     jsonb default '{}',
  created_at   timestamptz default now()
);

-- Index for fast time-range queries
create index on analytics_events (created_at desc);
create index on analytics_events (event_type);`}
          </pre>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : data ? (
        <>
          {/* KPI row */}
          <AnalyticsKpiCards kpis={kpis} />

          {/* Traffic over time */}
          <TrafficChart data={data.trafficByDay} />

          {/* Pages + Clicks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopPagesTable pages={data.topPages} total={data.summary.totalPageViews} />
            <ClickEventsTable clicks={data.topClicks} />
          </div>

          {/* Funnel + Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CheckoutFunnelCard data={data.summary} />
            <DeviceBreakdown
              deviceBreakdown={data.deviceBreakdown}
              browserBreakdown={data.browserBreakdown}
            />
          </div>

          {/* Referrers */}
          <ReferrersTable referrers={data.topReferrers} />
        </>
      ) : null}
    </section>
  )
}
