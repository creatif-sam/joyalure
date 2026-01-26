import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

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

  // Fetch unique countries for filter dropdown
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
      `
        id,
        email,
        full_name,
        country,
        created_at,
        total_orders,
        total_spent
      `,
      { count: "exact" }
    )

  if (query) {
    queryBuilder = queryBuilder.or(
      `email.ilike.%${query}%,full_name.ilike.%${query}%`
    )
  }

  if (country) {
    queryBuilder = queryBuilder.eq("country", country)
  }

  // Sorting
  if (sort === "total_spent_desc") {
    queryBuilder = queryBuilder.order("total_spent", { ascending: false })
  } else if (sort === "total_spent_asc") {
    queryBuilder = queryBuilder.order("total_spent", { ascending: true })
  } else if (sort === "total_orders_desc") {
    queryBuilder = queryBuilder.order("total_orders", { ascending: false })
  } else if (sort === "total_orders_asc") {
    queryBuilder = queryBuilder.order("total_orders", { ascending: true })
  } else {
    queryBuilder = queryBuilder.order("created_at", { ascending: false })
  }

  const { data, error, count } = await queryBuilder.range(from, to)

  if (error) {
    console.error("SUPABASE ERROR:", error)
    throw new Error(error.message)
  }

  const rows =
    data?.map(c => ({
      ...c,
      totalOrders: c.total_orders ?? 0,
      totalSpent: c.total_spent ?? 0
    })) ?? []

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">Customers</h1>

        <span className="inline-flex items-center px-5 py-2 rounded-full bg-green-100 text-green-800 text-base font-semibold border border-green-200">
          {count ?? 0} customers
        </span>
      </div>

      <hr className="mb-4 border-gray-200" />

      <form className="flex gap-2 items-center">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search name or email"
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <select
          name="country"
          defaultValue={country}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">All Countries</option>
          {countryOptions.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={sort}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="created_at_desc">Newest</option>
          <option value="total_spent_desc">Highest Spent</option>
          <option value="total_spent_asc">Lowest Spent</option>
          <option value="total_orders_desc">Most Orders</option>
          <option value="total_orders_asc">Fewest Orders</option>
        </select>

        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Search
        </button>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="text-left">Email</th>
              <th className="text-left">Country</th>
              <th className="text-left">Orders</th>
              <th className="text-left">Total Spent</th>
              <th className="text-left">Joined</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.map(c => (
              <tr key={c.id}>
                <td className="px-6 py-4 font-medium">
                  {c.full_name ?? "—"}
                </td>
                <td>{c.email}</td>
                <td>{c.country ?? "—"}</td>
                <td>{c.totalOrders}</td>
                <td>${(c.totalSpent / 100).toFixed(2)}</td>
                <td>
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          {page > 1 && (
            <a
              href={`/admin/customers?page=${page - 1}&q=${query}&country=${country}&sort=${sort}`}
              className="px-3 py-1 border rounded"
            >
              Previous
            </a>
          )}
          {page < totalPages && (
            <a
              href={`/admin/customers?page=${page + 1}&q=${query}&country=${country}&sort=${sort}`}
              className="px-3 py-1 border rounded"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
