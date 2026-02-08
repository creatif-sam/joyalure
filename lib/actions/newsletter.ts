"use server";

import { createClient } from "@supabase/supabase-js"; // Or your custom supabase admin/client helper

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role for server-side bypass if needed

const supabase = createClient(supabaseUrl, supabaseKey);

export async function subscribeToNewsletter(email: string) {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      // Check for unique constraint violation (Duplicate Email)
      if (error.code === "23505") {
        return { success: false, isDuplicate: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Internal Server Error" };
  }
}