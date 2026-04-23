import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role to bypass RLS for analytics inserts
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin

    const userAgent = request.headers.get("user-agent") || "Unknown"
    const referrer = request.headers.get("referer") || "Direct"
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ipRaw = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "Unknown"
    // Truncate IP to avoid storing full personal data (GDPR-friendly)
    const ip = ipRaw.split(".").slice(0, 3).join(".") + ".0"

    const deviceType = /mobile/i.test(userAgent) ? "Mobile" : /tablet/i.test(userAgent) ? "Tablet" : "Desktop"

    let browser = "Other"
    if (userAgent.includes("Edg/")) browser = "Edge"
    else if (userAgent.includes("Chrome")) browser = "Chrome"
    else if (userAgent.includes("Firefox")) browser = "Firefox"
    else if (userAgent.includes("Safari")) browser = "Safari"

    const body = await request.json().catch(() => ({}))
    const { event_type, page, element, session_id, metadata } = body

    if (!event_type) {
      return NextResponse.json({ error: "event_type is required" }, { status: 400 })
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_type,
      page: page || null,
      element: element || null,
      session_id: session_id || null,
      device_type: deviceType,
      browser,
      referrer,
      ip_prefix: ip,
      metadata: metadata || {},
    })

    if (error) {
      // Table may not exist yet — fail silently so site never breaks
      console.error("Analytics insert error:", error.message)
      return NextResponse.json({ ok: false })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Analytics track error:", e)
    return NextResponse.json({ ok: false })
  }
}
