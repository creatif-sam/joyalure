"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

/**
 * Drop this into any layout to auto-track page views on every navigation.
 */
export default function AnalyticsProvider() {
  const pathname = usePathname()
  const { trackPageView } = useAnalytics()

  useEffect(() => {
    if (pathname) trackPageView(pathname)
  }, [pathname, trackPageView])

  return null
}
