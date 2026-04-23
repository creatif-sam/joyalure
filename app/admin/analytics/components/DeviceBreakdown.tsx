import { Monitor, Smartphone, Tablet } from "lucide-react"

const DEVICE_ICONS: Record<string, React.ElementType> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
}

const COLORS = ["bg-violet-500", "bg-sky-500", "bg-pink-500", "bg-amber-500", "bg-green-500", "bg-rose-500"]

function PieBar({ items, title }: { items: { label: string; count: number }[]; title: string }) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1
  return (
    <div>
      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{title}</h4>
      <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-3">
        {items.map(({ label, count }, i) => (
          <div
            key={label}
            className={`${COLORS[i % COLORS.length]} transition-all duration-700`}
            style={{ width: `${Math.round((count / total) * 100)}%` }}
            title={`${label}: ${count}`}
          />
        ))}
      </div>
      <div className="space-y-1.5">
        {items.map(({ label, count }, i) => {
          const Icon = DEVICE_ICONS[label] || Monitor
          return (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${COLORS[i % COLORS.length]}`} />
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</span>
                <span className="text-gray-400 text-xs w-8 text-right">{Math.round((count / total) * 100)}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  deviceBreakdown: Record<string, number>
  browserBreakdown: Record<string, number>
}

export default function DeviceBreakdown({ deviceBreakdown, browserBreakdown }: Props) {
  const devices = Object.entries(deviceBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }))

  const browsers = Object.entries(browserBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }))

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-gray-100 dark:border-zinc-800 p-6 space-y-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
        Audience
      </h3>
      <PieBar items={devices} title="Devices" />
      <PieBar items={browsers} title="Browsers" />
    </div>
  )
}
