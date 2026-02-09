"use client"

import { ExternalLink } from "lucide-react"

const orders = [
  { id: "JL 1021", customer: "Ava Mitchell", status: "Completed", amount: "$79.00", color: "green" },
  { id: "JL 1022", customer: "Liam Parker", status: "Pending", amount: "$55.00", color: "yellow" },
  { id: "JL 1023", customer: "Noah Williams", status: "Processing", amount: "$124.50", color: "blue" },
]

export default function RecentOrdersTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-black">Order ID</th>
            <th className="px-4 py-4 font-black">Customer</th>
            <th className="px-4 py-4 font-black">Status</th>
            <th className="px-4 py-4 font-black text-right">Amount</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-zinc-800">
          {orders.map((order) => (
            <tr 
              key={order.id} 
              className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-150"
            >
              <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">
                {order.id}
              </td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-400">
                {order.customer}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={order.status} color={order.color} />
              </td>
              <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                {order.amount}
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <ExternalLink size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  const variants: Record<string, string> = {
    green: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    yellow: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${variants[color]}`}>
      {status}
    </span>
  )
}