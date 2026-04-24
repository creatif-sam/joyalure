export default function AdminDashboardLoading() {
  return (
    <section className="space-y-6 md:space-y-8 pb-10 px-4 md:px-0 animate-pulse">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-700 rounded-md" />
        </div>
        <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3"
          >
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div className="h-48 w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}
