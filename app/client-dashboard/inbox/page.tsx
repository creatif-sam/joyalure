import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { MailOpen, Mail } from "lucide-react"

export const dynamic = "force-dynamic"

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
    <div className="space-y-6 max-w-3xl transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-500">
          Inbox
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Your messages, order updates, and notifications.
        </p>
      </div>

      {(!messages || messages.length === 0) ? (
        <EmptyInbox />
      ) : (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
          {messages.map(message => (
            <InboxItem key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  )
}

function InboxItem({ message }: { message: any }) {
  return (
    <div
      className={`border rounded-2xl p-5 cursor-pointer transition-all active:scale-[0.99] ${
        message.is_read
          ? "bg-white dark:bg-zinc-950 border-green-100 dark:border-zinc-800"
          : "bg-green-50/50 dark:bg-green-500/5 border-green-200 dark:border-green-500/20 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className={`mt-1 shrink-0 ${message.is_read ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>
             {message.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
          </div>
          <div>
            <h3 className={`font-bold leading-none ${
              message.is_read ? "text-gray-700 dark:text-zinc-300" : "text-green-800 dark:text-green-400"
            }`}>
              {message.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
              {message.body}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500 whitespace-nowrap">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
      </div>

      {!message.is_read && (
        <div className="flex items-center gap-2 mt-3">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-tighter text-green-700 dark:text-green-400">
            New Notification
          </span>
        </div>
      )}
    </div>
  )
}

function EmptyInbox() {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-zinc-900 text-gray-400 mb-4">
        <MailOpen size={20} />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
        Your inbox is empty.
      </p>
    </div>
  )
}