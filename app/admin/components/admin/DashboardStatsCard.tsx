interface Props {
  title: string
  value: string
  delta?: string
}

export default function DashboardStatCard({
  title,
  value,
  delta,
}: Props) {
  // Institutional Logic: Determine if the trend is positive or negative
  const isNegative = delta?.startsWith("-");
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      {/* Title - Muted text */}
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </p>

      {/* Value - Primary text */}
      <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100 tracking-tight">
        {value}
      </h2>

      {/* Delta - Conditional Coloring */}
      {delta && (
        <div className="flex items-center gap-1 mt-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isNegative 
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" 
              : "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          }`}>
            {delta}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">vs last month</span>
        </div>
      )}
    </div>
  )
}