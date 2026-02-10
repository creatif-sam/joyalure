import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { VoucherList } from "./VoucherList"

export const dynamic = "force-dynamic"

export default async function VouchersPage() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: vouchers } = await supabase
    .from("vouchers")
    .select(`id, code, discount_type, discount_value, expires_at, is_used`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 max-w-3xl transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-500">
          Vouchers
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          View and manage your discount vouchers.
        </p>
      </div>

      <VoucherList vouchers={vouchers || []} />
    </div>
  )
}