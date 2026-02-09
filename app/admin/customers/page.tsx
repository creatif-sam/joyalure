import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Search, Users, Filter, ArrowUpDown } from "lucide-react"

const PAGE_SIZE = 10

type SearchParams = {
  page?: string
  q?: string
  country?: string
  sort?: string
}

type PageProps = {
  searchParams: SearchParams
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const cookiesList = await cookies()
  const supabase = createServerSupabaseClient({
    cookies: cookiesList,
  })

  // Fetch unique countries
  const { data: countryData } = await supabase
    .from("customers")
    .select("country")
    .neq("country", null)
    .neq("country", "")
    .order("country", { ascending: true })
    .limit(1000)

  const countryOptions: string[] = Array.from(
    new Set(
      (countryData ?? [])
        .map((c: { country: string | null }) => c.country)
        .filter((c): c is string => Boolean(c))
    )
  )

  const page = Number(searchParams.page ?? 1)
  const query = searchParams.q?.trim() ?? ""
  const country = searchParams.country?.trim() ?? ""
  const sort = searchParams.sort ?? "created_at_desc"

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let queryBuilder = supabase
    .from("customers")
    .select(
      `id, email, full_name, country, created_at, total_orders, total_spent`,
      { count: "exact" }
    )

  if (query) {
    queryBuilder = queryBuilder.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
  }
  if (country) {
    queryBuilder = queryBuilder.eq("country", country)
  }

  // Sorting Logic
  const sortMap: Record<string, { col: string; asc: boolean }> = {
    total_spent_desc: { col: "total_spent", asc: false },
    total_spent_asc: { col: "total_spent", asc: true },
    total_orders_desc: { col: "total_orders", asc: false },
    total_orders_asc: { col: "total_orders", asc: true },
    created_at_desc: { col: "created_at", asc: false },
  }
  const currentSort = sortMap[sort] || sortMap.created_at_desc
  queryBuilder = queryBuilder.order(currentSort.col, { ascending: currentSort.asc })

  const { data, error, count } = await queryBuilder.range(from, to)
  if (error) throw new Error(error.message)

  const rows = data?.map(c => ({
    ...c,
    totalOrders: c.total_orders ?? 0,
    totalSpent: c.total_spent ?? 0
  })) ?? []

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
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

      {/* FILTER FORM */}
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

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            name="country"
            defaultValue={country}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-green-600 appearance-none dark:text-gray-100"
          >
            <option value="">Global (All)</option>
            {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            name="sort"
            defaultValue={sort}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl outline-none focus:ring-2 focus:ring-green-600 appearance-none dark:text-gray-100"
          >
            <option value="created_at_desc">Newest First</option>
            <option value="total_spent_desc">Highest Spend</option>
            <option value="total_orders_desc">Order Count</option>
          </select>
        </div>

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
                <th className="px-4 py-4">Country</th>
                <th className="px-4 py-4">Orders</th>
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
                  <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{c.country ?? "—"}</td>
                  <td className="px-4 py-4">
                     <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-bold text-[10px] dark:text-gray-300">
                        {c.totalOrders}
                     </span>
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                    ${(c.totalSpent / 100).toFixed(2)}
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

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {page} / {totalPages || 1}
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={`/admin/customers?page=${page - 1}&q=${query}&country=${country}&sort=${sort}`} className="px-4 py-2 text-xs font-bold border dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 dark:text-gray-300 transition">
              Previous
            </a>
          )}
          {page < totalPages && (
            <a href={`/admin/customers?page=${page + 1}&q=${query}&country=${country}&sort=${sort}`} className="px-4 py-2 text-xs font-bold border dark:border-zinc-800 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 dark:text-gray-300 transition">
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  )
}