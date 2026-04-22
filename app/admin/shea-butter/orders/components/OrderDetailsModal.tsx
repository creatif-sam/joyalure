"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { Order } from "./OrdersTable"

interface Props {
  order: Order
  onClose: () => void
}

export default function OrderDetailsModal({ order, onClose }: Props) {
  const waNumber = order.customer_whatsapp.replace(/[^0-9]/g, "")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">✕</button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Name</p>
                <p className="font-bold text-gray-900 dark:text-white">{order.customer_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <a href={`mailto:${order.customer_email}`} className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                  {order.customer_email}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">WhatsApp</p>
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                  className="font-bold text-green-600 hover:underline flex items-center gap-1">
                  {order.customer_whatsapp}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">Order Date</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {order.notes && (
              <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-900 rounded-lg p-3">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    <p className="font-black text-green-600">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount:</span>
              <span className="text-3xl font-black text-green-600">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full text-center transition-colors"
            >
              📱 Contact on WhatsApp
            </a>
            <a
              href={`mailto:${order.customer_email}`}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-center transition-colors"
            >
              📧 Send Email
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
