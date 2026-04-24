export default function TestimoniesLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-pulse">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-4 w-80 bg-zinc-100 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
      </div>

      {/* Testimony cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden"
          >
            {/* Screenshot placeholder */}
            <div className="h-48 bg-zinc-100 dark:bg-zinc-800 w-full" />

            <div className="p-4 space-y-3">
              {/* Name + stars row */}
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-3 w-3 bg-yellow-100 dark:bg-yellow-900 rounded-sm" />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>

              {/* Badges + actions */}
              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                  <div className="h-5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
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
