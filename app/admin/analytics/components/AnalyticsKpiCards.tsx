interface KPI {
  label: string
  value: string | number
  sub?: string
  color: string
}

export default function AnalyticsKpiCards({ kpis }: { kpis: KPI[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className={`rounded-2xl p-5 text-white ${kpi.color}`}>
          <p className="text-xs uppercase tracking-widest opacity-80 mb-2">{kpi.label}</p>
          <p className="text-3xl font-black">{kpi.value}</p>
          {kpi.sub && <p className="text-xs opacity-70 mt-1">{kpi.sub}</p>}
        </div>
      ))}
    </div>
  )
}
