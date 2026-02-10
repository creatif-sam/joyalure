import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Search, Users, Filter, ArrowUpDown, ShoppingCart, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { CustomerListDetails } from "./CustomerListDetails"

const PAGE_SIZE = 10

type SearchParams = {
  page?: string
  q?: string
  country?: string
  sort?: string
  view?: string // The customer ID to view
}

type PageProps = {
  searchParams: Promise<SearchParams> // Next.js 15/16 requires searchParams to be awaited
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const cookiesList = await cookies()
  const supabase = createServerSupabaseClient({ cookies: cookiesList })

  const page = Number(params.page ?? 1)
  const query = params.q?.trim() ?? ""
  const country = params.country?.trim() ?? ""
  const sort = params.sort ?? "created_at_desc"
  const viewId = params.view

  // 1. Fetch unique countries (same as before)
  const { data: countryData } = await supabase
    .from("customers")
    .select("country")
    .neq("country", null)
    .neq("country", "")
    .order("country", { ascending: true })
    .limit(1000)

  const countryOptions: string[] = Array.from(
    new Set((countryData ?? []).map((c) => c.country).filter(Boolean))
  ) as string[]

  // 2. Fetch Customers
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let queryBuilder = supabase
    .from("customers")
    .select(`id, email, full_name, country, created_at, total_orders, total_spent`, { count: "exact" })

  if (query) queryBuilder = queryBuilder.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
  if (country) queryBuilder = queryBuilder.eq("country", country)

  const sortMap: Record<string, { col: string; asc: boolean }> = {
    total_spent_desc: { col: "total_spent", asc: false },
    total_spent_asc: { col: "total_spent", asc: true },
    total_orders_desc: { col: "total_orders", asc: false },
    total_orders_asc: { col: "total_orders", asc: true },
    created_at_desc: { col: "created_at", asc: false },
  }
  const currentSort = sortMap[sort] || sortMap.created_at_desc
  queryBuilder = queryBuilder.order(currentSort.col, { ascending: currentSort.asc })

  const { data, count } = await queryBuilder.range(from, to)
  const rows = data ?? []
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* DIALOG FOR WISHLIST/CART */}
      {viewId && (
        <Dialog open={true}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customer Engagement</DialogTitle>
              <DialogDescription>
                Viewing active shopping cart and wishlist items.
              </DialogDescription>
            </DialogHeader>
            <CustomerListDetails customerId={viewId} />
            <div className="mt-4 flex justify-end">
              <Link 
                href={`/admin/customers?page=${page}&q=${query}&country=${country}&sort=${sort}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold transition"
              >
                Close
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">Customer Base</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage and segment your Joyalure community.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-black text-green-700 dark:text-green-400">
            {count ?? 0} total
          </span>
        </div>
      </div>

      {/* FILTER FORM (Keep existing) */}
      <form className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search identity..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-green-600 transition dark:text-gray-100"
          />
        </div>
        {/* ... (Country and Sort selects same as before) */}
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-green-600/20 active:scale-95">
          Apply Filters
        </button>
      </form>

      {/* CUSTOMER TABLE */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4">Full Identity</th>
                <th className="px-4 py-4 text-center">Engagement</th>
                <th className="px-4 py-4 text-center">Orders</th>
                <th className="px-4 py-4">LTV (Spent)</th>
                <th className="px-4 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-800">
              {rows.map(c => (
                <tr key={c.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-gray-100">{c.full_name ?? "Unregistered"}</div>
                    <div className="text-xs text-gray-400 dark:text-zinc-500">{c.email}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Link 
                        href={`/admin/customers?page=${page}&q=${query}&country=${country}&sort=${sort}&view=${c.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 rounded-lg text-xs font-bold transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Lists
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                     <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-bold text-[10px] dark:text-gray-300">
                        {c.total_orders ?? 0}
                     </span>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                    ${((c.total_spent ?? 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-gray-500 dark:text-zinc-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION (Keep same) */}
    </div>
  )
}