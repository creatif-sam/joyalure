export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: vouchers } = await supabase
    .from("vouchers")
    .select(`
      id,
      code,
      discount_type,
      discount_value,
      expires_at,
      is_used
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          Vouchers
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage your discount vouchers.
        </p>
      </div>

      {!vouchers || vouchers.length === 0 && (
        <EmptyVouchers />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vouchers?.map(voucher => (
          <VoucherCard key={voucher.id} voucher={voucher} />
        ))}
      </div>

    </div>
  )
}

function VoucherCard({ voucher }: { voucher: any }) {
  const expired =
    voucher.expires_at &&
    new Date(voucher.expires_at) < new Date()

  const label =
    voucher.discount_type === "percentage"
      ? `${voucher.discount_value}% OFF`
      : `$${voucher.discount_value} OFF`

  return (
    <div
      className={`border rounded-lg p-4 space-y-3 ${
        expired || voucher.is_used
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-green-100"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-green-700">
          {label}
        </span>

        {(expired || voucher.is_used) && (
          <span className="text-xs text-gray-500">
            {voucher.is_used ? "Used" : "Expired"}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Code
        <span className="ml-2 font-mono font-medium text-green-700">
          {voucher.code}
        </span>
      </div>

      <div className="text-xs text-gray-500">
        Expires on{" "}
        {voucher.expires_at
          ? new Date(voucher.expires_at).toLocaleDateString()
          : "No expiry"}
      </div>
    </div>
  )
}

function EmptyVouchers() {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-6 text-center">
      <p className="text-sm text-gray-500">
        You do not have any vouchers yet.
      </p>
    </div>
  )
}
