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
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
      {delta && (
        <p className="text-xs text-green-600 mt-1">{delta}</p>
      )}
    </div>
  )
}
