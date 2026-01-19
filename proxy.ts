import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(req: NextRequest) {
  const res = NextResponse.next()

  res.headers.set(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://kit.fontawesome.com https://ka-f.fontawesome.com;
    style-src 'self' 'unsafe-inline' https://ka-f.fontawesome.com https://fonts.googleapis.com;
    font-src 'self' https://ka-f.fontawesome.com https://fonts.gstatic.com;
    connect-src 'self' https://ka-f.fontawesome.com;
    img-src 'self' data: https:;
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  )

  return res
}
