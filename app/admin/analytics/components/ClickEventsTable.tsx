import { MousePointerClick } from "lucide-react"

interface ClickRow { element: string; count: number }

const LABEL_MAP: Record<string, string> = {
  add_to_cart_button: "Add to Cart",
  checkout_button: "Checkout Button",
  shopify_checkout: "Shopify Checkout",
  hero_cta: "Hero CTA",
  nav_products: "Nav → Products",
  nav_blog: "Nav → Blog",
  view_product: "View Product",
  subscribe_button: "Subscribe",
}

export default function ClickEventsTable({ clicks }: { clicks: ClickRow[] }) {
  const max = clicks[0]?.count || 1

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-md shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
        <MousePointerClick className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
          Top Button Clicks
        </h3>
      </div>
      {clicks.length === 0 ? (
        <p className="px-6 py-8 text-sm text-gray-400 text-center">No click data yet</p>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
          {clicks.map(({ element, count }) => {
            const label = LABEL_MAP[element] || element.replace(/_/g, " ")
            const pct = Math.round((count / max) * 100)
            return (
              <div key={element} className="px-6 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize truncate">{label}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white shrink-0">{count.toLocaleString()}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
