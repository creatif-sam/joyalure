
import { createServerClient } from "@supabase/ssr"

export function createServerSupabaseClient({ cookies } = {}) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          if (!cookies) return [];
          if (typeof cookies.getAll === "function") {
            return cookies.getAll().map(c => ({
              name: c.name,
              value: c.value
            }))
          }
          return [];
        },
        setAll(cookiesToSet) {
          if (!cookies) return;
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options)
          })
        }
      }
    }
  )
}
