"use client"

import { RefreshCcw, MousePointerClick, TrendingUp, Smartphone, Globe, Loader2 } from "lucide-react"

interface TikTokStats {
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

interface Props {
  stats: TikTokStats | null
  loading: boolean
  onRefresh: () => void
}

export default function TikTokClicksPanel({ stats, loading, onRefresh }: Props) {
  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-green-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-green-950/20 border-2 border-pink-200 dark:border-pink-800 rounded-md overflow-hidden shadow-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md">
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
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-white dark:bg-zinc-800 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <RefreshCcw className={`h-4 w-4 text-pink-600 dark:text-pink-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: "Total", sublabel: "All-time clicks", value: stats.summary?.total_clicks ?? 0, color: "pink" },
              { label: "24 Hours", sublabel: "Last day", value: stats.summary?.clicks_last_24h ?? 0, color: "purple" },
              { label: "7 Days", sublabel: "Last week", value: stats.summary?.clicks_last_7d ?? 0, color: "green" },
              { label: "30 Days", sublabel: "Last month", value: stats.summary?.clicks_last_30d ?? 0, color: "blue" },
            ].map(({ label, sublabel, value, color }) => (
              <div
                key={label}
                className={`bg-white dark:bg-zinc-900 rounded-md p-4 border border-${color}-200 dark:border-${color}-900`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`h-4 w-4 text-${color}-600`} />
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{label}</p>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-100">{value}</p>
                <p className="text-[8px] text-gray-400 mt-1">{sublabel}</p>
              </div>
            ))}
          </div>

          {/* Device & Geographic Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-md p-4 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Device Types
                </h4>
              </div>
              <div className="space-y-2">
                {stats.deviceStats && Object.entries(stats.deviceStats).length > 0 ? (
                  Object.entries(stats.deviceStats).map(([device, count]) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{device}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${(count / (stats.summary?.clicks_last_30d || 1)) * 100}%` }}
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

            <div className="bg-white dark:bg-zinc-900 rounded-md p-4 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Geographic Distribution
                </h4>
              </div>
              <div className="space-y-2">
                {stats.countryStats && Object.entries(stats.countryStats).length > 0 ? (
                  Object.entries(stats.countryStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          🌍 {country}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-zinc-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / (stats.summary?.clicks_last_30d || 1)) * 100}%` }}
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
          {stats.clicksByDate && Object.keys(stats.clicksByDate).length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-md p-4 border border-gray-200 dark:border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
                Last 30 Days Trend
              </h4>
              <div className="flex items-end gap-1 h-32">
                {Object.entries(stats.clicksByDate)
                  .slice(-30)
                  .map(([date, count]) => {
                    const maxClicks = Math.max(...Object.values(stats.clicksByDate).map((c) => c || 0))
                    const height = maxClicks > 0 ? (count / maxClicks) * 100 : 0
                    return (
                      <div
                        key={date}
                        className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-t min-w-[4px] hover:opacity-75 transition-opacity group relative"
                        style={{ height: `${height}%` }}
                        title={`${date}: ${count} clicks`}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}: {count}
                        </div>
                      </div>
                    )
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
  )
}
