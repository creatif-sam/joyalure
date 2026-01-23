"use client"

import { useState, useTransition } from "react"

export default function ToggleFeatured({
  productId,
  initialValue
}: {
  productId: string
  initialValue: boolean
}) {
  const [enabled, setEnabled] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      setEnabled(!enabled)

      const res = await fetch(
        "/api/admin/products/featured",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            value: !enabled
          })
        }
      )

      if (!res.ok) {
        setEnabled(enabled)
        alert("Failed to update featured status")
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={`px-3 py-1 rounded text-xs ${
        enabled
          ? "bg-green-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {enabled ? "Featured" : "Not featured"}
    </button>
  )
}
