import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
  title: string
  value: string
  delta?: string
  icon?: ReactNode
}

export default function DashboardStatCard({ title, value, delta, icon }: Props) {
  const isNegative = delta?.startsWith("-")

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
            {icon}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight tabular-nums">
        {value}
      </h2>

      {delta && (
        <div className="flex items-center gap-1 mt-2.5">
          {isNegative
            ? <TrendingDown className="h-3 w-3 text-red-500" />
            : <TrendingUp className="h-3 w-3 text-green-500" />
          }
          <span className={`text-xs font-semibold ${isNegative ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
            {delta}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  )
}