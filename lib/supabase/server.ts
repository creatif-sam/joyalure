import { createServerClient } from "@supabase/ssr"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

type CreateServerClientParams = {
  cookies: ReadonlyRequestCookies
}

export function createServerSupabaseClient(
  params: CreateServerClientParams
) {
  const { cookies } = params

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options)
          })
        },
      },
    }
  )
}
