interface DayRow { date: string; views: number }

export default function TrafficChart({ data }: { data: DayRow[] }) {
  const max = Math.max(...data.map((d) => d.views), 1)

  // Show every 7th label to avoid crowding
  const labelEvery = Math.ceil(data.length / 7)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-gray-100 dark:border-zinc-800 p-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-6">
        Daily Page Views
      </h3>
      {data.every((d) => d.views === 0) ? (
        <p className="text-sm text-gray-400 text-center py-10">No traffic data yet — start collecting after deployment</p>
      ) : (
        <div className="flex items-end gap-1 h-32">
          {data.map(({ date, views }, i) => {
            const height = Math.round((views / max) * 100)
            const showLabel = i % labelEvery === 0
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {views} — {date.slice(5)}
                </div>
                <div
                  className="w-full bg-green-500 hover:bg-green-400 rounded-t-sm transition-all duration-300"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                {showLabel && (
                  <span className="text-[9px] text-gray-400 rotate-45 origin-left mt-1 whitespace-nowrap">
                    {date.slice(5)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
