import { useCallback } from "react"

// Generates or retrieves a persistent session ID for this browser tab
function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let sid = sessionStorage.getItem("_jy_sid")
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem("_jy_sid", sid)
  }
  return sid
}

async function send(payload: Record<string, unknown>) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Non-blocking fire-and-forget
      keepalive: true,
    })
  } catch {
    // Never let analytics errors affect the user experience
  }
}

export function useAnalytics() {
  const trackPageView = useCallback((page: string) => {
    send({
      event_type: "page_view",
      page,
      session_id: getSessionId(),
    })
  }, [])

  const trackClick = useCallback((element: string, page?: string, metadata?: Record<string, unknown>) => {
    send({
      event_type: "click",
      element,
      page: page || (typeof window !== "undefined" ? window.location.pathname : ""),
      session_id: getSessionId(),
      metadata,
    })
  }, [])

  const trackAddToCart = useCallback((productName: string, price?: number) => {
    send({
      event_type: "add_to_cart",
      element: "add_to_cart_button",
      page: typeof window !== "undefined" ? window.location.pathname : "",
      session_id: getSessionId(),
      metadata: { product_name: productName, price },
    })
  }, [])

  const trackCheckoutStart = useCallback(() => {
    send({
      event_type: "checkout_start",
      page: "/public/check-out",
      session_id: getSessionId(),
    })
  }, [])

  const trackCheckoutComplete = useCallback(() => {
    send({
      event_type: "checkout_complete",
      page: "/public/check-out",
      session_id: getSessionId(),
    })
  }, [])

  return { trackPageView, trackClick, trackAddToCart, trackCheckoutStart, trackCheckoutComplete }
}
