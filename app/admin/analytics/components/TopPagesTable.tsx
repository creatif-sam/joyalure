import { FileText } from "lucide-react"

interface PageRow { page: string; views: number }

export default function TopPagesTable({ pages, total }: { pages: PageRow[]; total: number }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
        <FileText className="h-4 w-4 text-green-600" />
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
          Top Pages
        </h3>
      </div>
      {pages.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400 text-center">No page view data yet</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {pages.map(({ page, views }) => {
            const pct = total > 0 ? Math.round((views / total) * 100) : 0
            const label = page === "/" ? "Home" : page.replace(/^\/public\//, "/").replace(/^\//, "")
            return (
              <div key={page} className="px-6 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{label}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white">{views.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{pct}%</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
