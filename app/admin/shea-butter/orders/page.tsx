"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, RefreshCcw, Loader2 } from "lucide-react";
import OrderStatsCards from "./components/OrderStatsCards";
import OrdersTable, { type Order } from "./components/OrdersTable";
import OrderDetailsModal from "./components/OrderDetailsModal";

interface Stats {
  total_orders: number;
  orders_last_24h: number;
  orders_last_7d: number;
  orders_last_30d: number;
  total_revenue: number;
  revenue_last_30d: number;
  unique_customers: number;
  average_order_value: number;
}

export default function SheaButterOrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shea-butter/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setStats(data.stats || null);
      }
    } catch (e) { console.error("Error fetching orders:", e); }
    finally { setLoading(false); }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const res = await fetch("/api/shea-butter/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        await fetchOrders();
        setSelectedOrder((prev) => prev?.id === orderId ? { ...prev, status: newStatus } : prev);
      } else {
        alert("Failed to update order status");
      }
    } catch (e) { console.error("Error updating order:", e); alert("An error occurred"); }
    finally { setUpdatingStatus(false); }
  };

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
            Shea Butter Orders
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
            Manage customer orders
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {stats && <OrderStatsCards stats={stats} />}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-zinc-700">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h3>
          <p className="text-gray-500">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <OrdersTable
          orders={orders}
          updatingStatus={updatingStatus}
          onStatusChange={updateOrderStatus}
          onViewDetails={setSelectedOrder}
        />
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </section>
  );
}
