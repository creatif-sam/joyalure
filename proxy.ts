import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          req.cookies.getAll().map(c => ({
            name: c.name,
            value: c.value
          })),
        setAll: cookies =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set({ name, value, ...options })
          )
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // If user is NOT logged in and tries to access admin
  if (!user && req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    )
  }

  // If user IS logged in and visits login page
  if (user && req.nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(
      new URL("/admin", req.url)
    )
  }

  return res
}
