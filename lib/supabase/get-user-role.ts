import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserRole() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  // Fetch profile to get role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role || null;
}
