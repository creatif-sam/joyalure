"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut()
      router.replace("/public")
    }

    logout()
  }, [router, supabase])

  return null
}
