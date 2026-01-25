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
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-semibold text-green-700">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information.
        </p>
      </div>

      <div className="bg-white border border-green-100 rounded-lg p-6 space-y-6">

      <AvatarUploader
  userId={user.id}
  avatarUrl={profile?.avatar_url}
  role="customer"
/>


        <ProfileForm
          userId={user.id}
          initialName={profile?.full_name}
        />

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
    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
      <span className="text-gray-500 text-sm">
        {label}
      </span>
      <span className="text-green-700 font-medium text-sm">
        {value}
      </span>
    </div>
  )
}
