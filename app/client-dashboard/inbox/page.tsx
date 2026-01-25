export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export default async function InboxPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: messages } = await supabase
    .from("inbox_messages")
    .select("id, title, body, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          Inbox
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your messages, order updates, and notifications.
        </p>
      </div>

      {!messages || messages.length === 0 && (
        <EmptyInbox />
      )}

      <div className="space-y-3">
        {messages?.map(message => (
          <InboxItem key={message.id} message={message} />
        ))}
      </div>

    </div>
  )
}

function InboxItem({ message }: { message: any }) {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer ${
        message.is_read
          ? "bg-white border-green-100"
          : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-green-700">
          {message.title}
        </h3>
        <span className="text-xs text-gray-500">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {message.body}
      </p>

      {!message.is_read && (
        <span className="inline-block mt-2 text-xs text-green-700">
          New
        </span>
      )}
    </div>
  )
}

function EmptyInbox() {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-6 text-center">
      <p className="text-sm text-gray-500">
        Your inbox is empty.
      </p>
    </div>
  )
}
