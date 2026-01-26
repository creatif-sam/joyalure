"use client"

import { useState } from "react"

interface ToggleRecentProps {
  productId: string
  initialValue: boolean
}

export default function ToggleRecent({
  productId,
  initialValue
}: ToggleRecentProps) {
  const [isRecent, setIsRecent] = useState<boolean>(initialValue)
  const [loading, setLoading] = useState<boolean>(false)

  async function handleToggle() {
    setLoading(true)

    const res = await fetch("/api/products/toggle-recent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        isRecent: !isRecent
      })
    })

    if (res.ok) {
      setIsRecent(prev => !prev)
    }

    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`px-2 py-1 rounded text-xs font-medium transition ${
        isRecent
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {isRecent ? "Recent" : "Not Recent"}
    </button>
  )
}
