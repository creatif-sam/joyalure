import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Do not touch API or static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return res
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: cookies =>
          cookies.forEach(c =>
            res.cookies.set(c.name, c.value, c.options)
          )
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Protect admin and client dashboard
  if (!user && (pathname.startsWith("/admin") || pathname.startsWith("/client-dashboard"))) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // Admin role check only for admin routes
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/client-dashboard", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/client-dashboard/:path*"]
}
