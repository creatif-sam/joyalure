"use client"

import { useState } from "react"

export default function ToggleRecent({ productId, initialValue }) {
  const [isRecent, setIsRecent] = useState(initialValue)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const res = await fetch("/api/products/toggle-recent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, isRecent: !isRecent })
    })
    if (res.ok) {
      setIsRecent(!isRecent)
    }
    setLoading(false)
  }

  return (
    <button
      className={`px-2 py-1 rounded ${isRecent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
      onClick={handleToggle}
      disabled={loading}
    >
      {isRecent ? "Recent" : "Not Recent"}
    </button>
  )
}
