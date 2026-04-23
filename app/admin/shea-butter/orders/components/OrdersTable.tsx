"use client"

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_whatsapp: string
  items: OrderItem[]
  total_amount: number
  status: string
  notes: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

interface Props {
  orders: Order[]
  updatingStatus: boolean
  onStatusChange: (id: string, status: string) => void
  onViewDetails: (order: Order) => void
}

export default function OrdersTable({ orders, updatingStatus, onStatusChange, onViewDetails }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md overflow-hidden shadow-lg border-2 border-gray-100 dark:border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
            <tr>
              {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{order.customer_name || "N/A"}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </td>
                <td className="px-6 py-4 text-sm font-black text-green-600">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    disabled={updatingStatus}
                    className={`px-3 py-1 text-xs font-bold rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(order)}
                    className="text-green-600 hover:text-green-700 font-bold text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
