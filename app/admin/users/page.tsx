import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { unstable_noStore } from "next/cache"
import { cookies } from "next/headers"

type Profile = {
  id: string
  email: string
  full_name?: string | null
  avatar_url?: string | null
  created_at: string
  role?: string | null
}

export default async function AdminUsers() {
  unstable_noStore()

  const supabase = createServerSupabaseClient({
    cookies: cookies()
  })

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch users", error)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Users Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users && users.length > 0 ? (
          users.map((user: Profile) => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {user.full_name || "No name"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {user.email}
                </p>

                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {user.role || "user"}
                  </Badge>

                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              No users found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
