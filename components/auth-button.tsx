import Link from "next/link"
import { Button } from "./ui/button"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { LogoutButton } from "./logout-button"

export async function AuthButton() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Link href="/auth/login">
        <Button>Login</Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{user.email}</span>
      <LogoutButton />
    </div>
  )
}
