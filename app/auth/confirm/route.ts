import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import type { EmailOtpType } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  if (!token_hash || !type) {
    redirect("/auth/login")
  }

  const supabase = createServerSupabaseClient({
    cookies: cookies()
  })

  await supabase.auth.verifyOtp({
    token_hash,
    type
  })

  redirect("/client-dashboard")
}
