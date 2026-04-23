import { ShoppingCart, CreditCard, CheckCircle2, XCircle } from "lucide-react"

interface FunnelData {
  addToCart: number
  checkoutStart: number
  checkoutComplete: number
  checkoutAbandoned: number
  cartToCheckoutRate: number
  checkoutConversionRate: number
}

export default function CheckoutFunnelCard({ data }: { data: FunnelData }) {
  const steps = [
    { label: "Add to Cart", value: data.addToCart, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Checkout Started", value: data.checkoutStart, icon: CreditCard, color: "bg-amber-500" },
    { label: "Checkout Completed", value: data.checkoutComplete, icon: CheckCircle2, color: "bg-green-500" },
    { label: "Abandoned", value: data.checkoutAbandoned, icon: XCircle, color: "bg-red-400" },
  ]
  const max = Math.max(data.addToCart, 1)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
          Checkout Funnel
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {steps.map(({ label, value, icon: Icon, color }) => {
          const pct = Math.round((value / max) * 100)
          return (
            <div key={label} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color} shrink-0`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
          <div className="text-center bg-amber-50 dark:bg-amber-900/20 rounded-md p-3">
            <p className="text-2xl font-black text-amber-600">{data.cartToCheckoutRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Cart → Checkout rate</p>
          </div>
          <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-md p-3">
            <p className="text-2xl font-black text-green-600">{data.checkoutConversionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Checkout conversion rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
