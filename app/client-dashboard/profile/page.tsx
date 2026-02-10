import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import AvatarUploader from "./AvatarUploader"
import ProfileForm from "./ProfileForm"

export const dynamic = "force-dynamic"


export default async function ProfilePage() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-6 max-w-2xl transition-colors duration-300">

      <div>
        <h1 className="text-2xl font-black tracking-tight text-green-700 dark:text-green-500">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Manage your personal information.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-green-100 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-sm">

        <AvatarUploader
          userId={user.id}
          avatarUrl={profile?.avatar_url}
          role="customer"
        />


        <ProfileForm
          userId={user.id}
          initialName={profile?.full_name}
        />

        <div className="space-y-4">
          <ProfileRow
            label="Email Address"
            value={user.email}
          />

          <ProfileRow
            label="Account Type"
            value={profile?.role || "customer"}
          />

          <ProfileRow
            label="Member Since"
            value={
              profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "—"
            }
          />
        </div>

      </div>

    </div>
  )
}

function ProfileRow({
  label,
  value
}: {
  label: string
  value?: string | null
}) {
  return (
    <div className="flex justify-between items-center border-t border-gray-100 dark:border-zinc-800 pt-4">
      <span className="text-gray-500 dark:text-zinc-400 text-sm font-medium">
        {label}
      </span>
      <span className="text-green-700 dark:text-green-400 font-bold text-sm">
        {value}
      </span>
    </div>
  )
}