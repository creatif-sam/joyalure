"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function AvatarUploader({
  userId,
  avatarUrl,
  role = "customer"
}: {
  userId: string
  avatarUrl?: string | null
  role?: "customer" | "admin"
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const router = useRouter()

  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    setErrorMsg(null)

    const fileExt = file.name.split(".").pop()
    const filePath = `${role}/${userId}.${fileExt}`

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      })

    if (error) {
      console.error("Avatar upload failed:", error.message)
      setErrorMsg(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", userId)

    // 🔴 Cache bust + persist after refresh
    const freshUrl = `${data.publicUrl}?t=${Date.now()}`
    setPreview(freshUrl)

    // 🔴 Forces Next.js to refetch server data
    router.refresh()

    setUploading(false)
  }

  return (
    <div className="flex items-center gap-4">

      <img
        src={preview || avatarUrl || "/avatar-placeholder.png"}
        alt="Profile avatar"
        className="h-20 w-20 rounded-full object-cover border border-green-200"
      />

      <div className="flex flex-col gap-1">
        <label className="cursor-pointer w-fit">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0])
              }
            }}
          />
          <span className="text-sm text-green-700 hover:underline">
            {uploading ? "Uploading..." : "Change photo"}
          </span>
        </label>

        {errorMsg && (
          <span className="text-xs text-red-600">
            {errorMsg}
          </span>
        )}
      </div>

    </div>
  )
}
