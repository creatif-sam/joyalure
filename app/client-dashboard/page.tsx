import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function DashboardPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const name =
    profile?.full_name ||
    user.email?.split("@")[0] ||
    "there"

  // Fetch counts
  const [{ count: ordersCount }, { count: wishlistCount }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
    ])

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          Welcome, {name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your orders, wishlist, and account information.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard
          label="Orders"
          value={ordersCount ?? 0}
        />

        <StatCard
          label="Wishlist"
          value={wishlistCount ?? 0}
        />

      <StatCard
  label="Account Email"
  value={user.email ?? null}
/>


      </div>
    </div>
  )
}

function StatCard({
  label,
  value
}: {
  label: string
  value: number | string | null
}) {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-4">
      <p className="text-sm text-gray-500">
        {label}
      </p>
      <p className="text-lg font-semibold text-green-700 mt-1">
        {value}
      </p>
    </div>
  )
}
