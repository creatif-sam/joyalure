import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { ShoppingBag, Heart, Mail, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

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
    <div className="space-y-8 animate-in fade-in duration-700 transition-colors">

      {/* Welcome Section */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-500">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-zinc-100">
            Welcome, <span className="text-green-700 dark:text-green-500">{name}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
            Manage your Joyalure experience from one place.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Orders"
          value={ordersCount ?? 0}
          icon={<ShoppingBag size={18} />}
        />

        <StatCard
          label="Wishlist"
          value={wishlistCount ?? 0}
          icon={<Heart size={18} />}
        />

        <StatCard
          label="Account Identity"
          value={user.email ?? null}
          icon={<Mail size={18} />}
        />
      </div>
      
      {/* Quick Tips or Next Steps could go here */}
    </div>
  )
}

function StatCard({
  label,
  icon,
  value
}: {
  label: string
  icon: React.ReactNode
  value: number | string | null
}) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-green-300 dark:hover:border-green-900/50 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {label}
        </p>
        <div className="text-green-700 dark:text-green-500 opacity-50 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-zinc-100 truncate">
        {value}
      </p>
    </div>
  )
}