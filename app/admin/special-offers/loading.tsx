export default function SpecialOffersLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-4 w-72 bg-zinc-100 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="h-40 bg-zinc-100 dark:bg-zinc-800 w-full" />

            <div className="p-4 space-y-3">
              {/* Badge + title */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-14 bg-green-100 dark:bg-green-900 rounded-full" />
                <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
              {/* Description */}
              <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-4/5 bg-zinc-100 dark:bg-zinc-800 rounded" />
              {/* Footer */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                  <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                  <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
