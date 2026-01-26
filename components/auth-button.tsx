import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"

export async function AuthButton() {
  const cookieStore = await cookies()

  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <form action="/auth/signout" method="post">
        <button className="text-sm font-medium">
          Sign out
        </button>
      </form>
    )
  }

  return (
    <Link href="/auth/login" className="text-sm font-medium">
      Sign in
    </Link>
  )
}
