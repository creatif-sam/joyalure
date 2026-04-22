import { ArrowUpRight } from "lucide-react"

interface ReferrerRow { source: string; visits: number }

export default function ReferrersTable({ referrers }: { referrers: ReferrerRow[] }) {
  const max = referrers[0]?.visits || 1

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
        <ArrowUpRight className="h-4 w-4 text-purple-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
          Traffic Sources
        </h3>
      </div>
      {referrers.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400 text-center">No referrer data yet</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {referrers.map(({ source, visits }) => {
            const pct = Math.round((visits / max) * 100)
            return (
              <div key={source} className="px-6 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{source}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white shrink-0">
                  {visits.toLocaleString()}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
