"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

export default function RemoveWishlistButton({
  wishlistId
}: {
  wishlistId: string
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const router = useRouter()

  async function handleRemove() {
    await supabase
      .from("wishlist")
      .delete()
      .eq("id", wishlistId)

    router.refresh()
  }

  return (
    <button
      onClick={handleRemove}
      className="text-xs text-red-600 hover:underline"
    >
      Remove
    </button>
  )
}
