import { createAdminClient } from "@/lib/supabase/server"

const PAGE_SIZE = 10

type PageProps = {
  searchParams: {
    page?: string
    q?: string
  }
}

export default async function CustomersPage({ searchParams }: PageProps) {
  const supabase = await createAdminClient()

  const params = await searchParams
  const page = Number(params.page ?? 1)
  const query = params.q?.trim() ?? ""

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let queryBuilder = supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      full_name,
      role,
      created_at
    `,
      { count: "exact" }
    )
    .eq("role", "customer")

  if (query) {
    queryBuilder = queryBuilder.or(
      `email.ilike.%${query}%,full_name.ilike.%${query}%`
    )
  }

  const { data, error, count } = await queryBuilder
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("SUPABASE ERROR:", error)
    throw new Error(error.message)
  }

  const rows =
    data?.map(c => ({
      ...c,
      totalOrders: 0, // Placeholder until orders table is set up
      totalSpent: 0, // Placeholder until orders table is set up
    })) ?? []

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Customers</h1>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search name or email"
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Search
        </button>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {rows.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-6 py-4 font-medium">
                  {c.full_name ?? "—"}
                </td>
                <td>{c.email}</td>
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
                  colSpan={5}
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
              href={`/admin/customers?page=${page - 1}&q=${query}`}
              className="px-3 py-1 border rounded"
            >
              Previous
            </a>
          )}
          {page < totalPages && (
            <a
              href={`/admin/customers?page=${page + 1}&q=${query}`}
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
