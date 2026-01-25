"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

const supabase = createClient()

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: string | null
  avatar_url: string | null
  displayName: string
}

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadUser() {
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser()

    if (!authUser) {
      setUser(null)
      setLoading(false)
      return
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, avatar_url")
      .eq("id", authUser.id)
      .single()

    if (error) {
      console.error("Profile fetch error", {
        message: error.message,
        details: error.details,
        hint: error.hint
      })

      // IMPORTANT: do not destroy auth state
      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        full_name: null,
        role: null,
        avatar_url: null,
        displayName: authUser.email ?? "User"
      })
    } else {
      setUser({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
        displayName: profile.full_name || profile.email
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      () => loadUser()
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
