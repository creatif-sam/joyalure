"use client"

import { useEffect, useState } from "react"

export function SpecialOfferCountdown({ endDate }: { endDate: string | null }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    if (!endDate) return

    const target = new Date(endDate).getTime()
    if (target <= Date.now()) return

    const compute = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft(null)
        return false
      }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      )
      return true
    }

    if (!compute()) return
    const timer = setInterval(() => { if (!compute()) clearInterval(timer) }, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  if (!timeLeft) return null

  return (
    <span className="mt-2 inline-block px-4 py-1 text-xs tracking-widest text-white bg-white/20 backdrop-blur rounded-full border border-white/10">
      Ends in {timeLeft}
    </span>
  )
}
