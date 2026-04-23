import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "30" // days

    const days = parseInt(range, 10)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Fetch all events in range
    const { data: events, error } = await supabase
      .from("analytics_events")
      .select("event_type, page, element, session_id, device_type, browser, referrer, metadata, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000)

    if (error) {
      return NextResponse.json({ error: "Table not set up yet", data: null }, { status: 200 })
    }

    const evts = events ?? []

    // ── Page views ──────────────────────────────────────────────
    const pageViews = evts.filter((e) => e.event_type === "page_view")
    const uniqueSessions = new Set(evts.map((e) => e.session_id).filter(Boolean)).size

    // Top pages
    const pageCount: Record<string, number> = {}
    for (const e of pageViews) {
      if (e.page) pageCount[e.page] = (pageCount[e.page] || 0) + 1
    }
    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // ── Click events ─────────────────────────────────────────────
    const clicks = evts.filter((e) => e.event_type === "click")
    const clickCount: Record<string, number> = {}
    for (const e of clicks) {
      const key = e.element || "unknown"
      clickCount[key] = (clickCount[key] || 0) + 1
    }
    const topClicks = Object.entries(clickCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([element, count]) => ({ element, count }))

    // ── Checkout funnel ──────────────────────────────────────────
    const addToCart = evts.filter((e) => e.event_type === "add_to_cart").length
    const checkoutStart = evts.filter((e) => e.event_type === "checkout_start").length
    const checkoutComplete = evts.filter((e) => e.event_type === "checkout_complete").length
    const checkoutAbandoned = checkoutStart - checkoutComplete

    // ── Device & Browser breakdown ───────────────────────────────
    const deviceCount: Record<string, number> = {}
    const browserCount: Record<string, number> = {}
    for (const e of evts) {
      if (e.device_type) deviceCount[e.device_type] = (deviceCount[e.device_type] || 0) + 1
      if (e.browser) browserCount[e.browser] = (browserCount[e.browser] || 0) + 1
    }

    // ── Referrer sources ────────────────────────────────────────
    const referrerCount: Record<string, number> = {}
    for (const e of pageViews) {
      const ref = e.referrer || "Direct"
      let source = "Direct"
      if (ref !== "Direct") {
        try {
          const hostname = new URL(ref).hostname.replace("www.", "")
          source = hostname || "Direct"
        } catch {
          source = "Direct"
        }
      }
      referrerCount[source] = (referrerCount[source] || 0) + 1
    }
    const topReferrers = Object.entries(referrerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, visits]) => ({ source, visits }))

    // ── Daily traffic (last N days) ──────────────────────────────
    const dailyTraffic: Record<string, number> = {}
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      dailyTraffic[d.toISOString().slice(0, 10)] = 0
    }
    for (const e of pageViews) {
      const day = e.created_at.slice(0, 10)
      if (day in dailyTraffic) dailyTraffic[day] = (dailyTraffic[day] || 0) + 1
    }
    const trafficByDay = Object.entries(dailyTraffic)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, views]) => ({ date, views }))

    // ── Summary KPIs ─────────────────────────────────────────────
    const totalPageViews = pageViews.length
    const cartToCheckoutRate = addToCart > 0 ? Math.round((checkoutStart / addToCart) * 100) : 0
    const checkoutConversionRate = checkoutStart > 0 ? Math.round((checkoutComplete / checkoutStart) * 100) : 0

    return NextResponse.json({
      ok: true,
      range: days,
      summary: {
        totalPageViews,
        uniqueSessions,
        totalClicks: clicks.length,
        addToCart,
        checkoutStart,
        checkoutComplete,
        checkoutAbandoned,
        cartToCheckoutRate,
        checkoutConversionRate,
      },
      topPages,
      topClicks,
      topReferrers,
      deviceBreakdown: deviceCount,
      browserBreakdown: browserCount,
      trafficByDay,
    })
  } catch (e) {
    console.error("Analytics summary error:", e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
