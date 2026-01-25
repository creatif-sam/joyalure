"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

export default function ProfileForm({
  userId,
  initialName
}: {
  userId: string
  initialName?: string | null
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [fullName, setFullName] = useState(initialName || "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSuccess(false)

    await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId)

    setSaving(false)
    setSuccess(true)
  }

  return (
    <div className="space-y-3">

      <div>
        <label className="text-sm text-gray-500">
          Full name
        </label>
        <input
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="mt-1 w-full border border-green-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          placeholder="Enter your full name"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-700 text-white text-sm px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>

      {success && (
        <p className="text-sm text-green-700">
          Profile updated successfully.
        </p>
      )}

    </div>
  )
}
