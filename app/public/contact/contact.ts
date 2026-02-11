"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function sendContactMessage(formData: FormData) {
  const cookieStore = await cookies()
  
  // 1. Extract data
  const full_name = formData.get("full_name") as string
  const email = formData.get("email") as string
  const message = formData.get("message") as string

  // 2. Initialize Supabase
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

  // 3. Insert into a 'contact_requests' table (ensure this table exists in Supabase)
  const { error } = await supabase
    .from("contact_requests")
    .insert([{ full_name, email, message }])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}