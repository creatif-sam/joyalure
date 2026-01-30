"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function subscribeToNewsletter(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email." };
  }

  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  });

  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: email.toLowerCase().trim() }]);

    if (error) {
      // Check for Postgres Unique Constraint Violation (duplicate email)
      if (error.code === '23505') {
        return { isDuplicate: true }; 
      }
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Supabase Error:", error);
    return { error: "Database connection failed." };
  }
}