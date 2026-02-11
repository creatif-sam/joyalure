"use client"

import { ExternalLink, ChevronRight } from "lucide-react"

const orders = [
  { id: "JL 1021", customer: "Ava Mitchell", status: "Completed", amount: "$79.00", color: "green" },
  { id: "JL 1022", customer: "Liam Parker", status: "Pending", amount: "$55.00", color: "yellow" },
  { id: "JL 1023", customer: "Noah Williams", status: "Processing", amount: "$124.50", color: "blue" },
]

export default function RecentOrdersTable() {
  return (
    <div className="w-full">
      {/* --- DESKTOP TABLE VIEW (Hidden on mobile) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 border-b dark:border-zinc-800">
            <tr>
              <th className="px-6 py-6 font-black italic">Order ID</th>
              <th className="px-4 py-6 font-black uppercase">Customer</th>
              <th className="px-4 py-6 font-black uppercase text-center">Status</th>
              <th className="px-4 py-6 font-black uppercase text-right">Amount</th>
              <th className="px-6 py-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-800">
            {orders.map((order) => (
              <tr key={order.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all duration-300">
                <td className="px-6 py-5 font-black text-gray-900 dark:text-gray-100 italic">{order.id}</td>
                <td className="px-4 py-5 text-zinc-600 dark:text-zinc-400 font-medium">{order.customer}</td>
                <td className="px-4 py-5 text-center"><StatusBadge status={order.status} color={order.color} /></td>
                <td className="px-4 py-5 text-right font-black text-gray-900 dark:text-gray-100">{order.amount}</td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 hover:text-green-600 transition-all">
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARD VIEW (Visible only on small screens) --- */}
      <div className="md:hidden divide-y dark:divide-zinc-800">
        {orders.map((order) => (
          <div key={order.id} className="p-5 active:bg-zinc-50 dark:active:bg-zinc-800/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Ref: {order.id}</p>
                <h4 className="font-bold text-gray-900 dark:text-zinc-100">{order.customer}</h4>
              </div>
              <StatusBadge status={order.status} color={order.color} />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-lg font-black tracking-tight text-gray-900 dark:text-zinc-100">{order.amount}</p>
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">
                Details <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status, color }: { status: string; color: string }) {
  const variants: Record<string, string> = {
    green: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-100/50",
    yellow: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-100/50",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100/50",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${variants[color]}`}>
      {status}
    </span>
  )
}