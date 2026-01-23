import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export function createServerSupabaseClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(c => ({
            name: c.name,
            value: c.value
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set({
              name,
              value,
              ...options
            })
          })
        }
      }
    }
  )
}
