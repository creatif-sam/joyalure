"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * 1. Subscribe to Newsletter
 * Added: revalidatePath to ensure admin dashboard updates immediately.
 */
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
      if (error.code === '23505') {
        return { isDuplicate: true }; 
      }
      throw error;
    }

    // Optional: Refresh the admin subscriber list if they are on that page
    revalidatePath("/admin/mail");
    return { success: true };
  } catch (error: any) {
    console.error("Supabase Error:", error);
    return { error: "Database connection failed." };
  }
}

/**
 * 2. Create Email Template
 * Improvement: Wrapped in try/catch for consistent error handling.
 */
export async function createEmailTemplate(formData: {
  name: string;
  category: string;
  subject: string;
  body: string;
}) {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({
    cookies: cookieStore,
  });

  try {
    const { error } = await supabase
      .from("email_templates")
      .insert([
        {
          name: formData.name,
          category: formData.category,
          subject: formData.subject,
          body: formData.body,
        },
      ]);

    if (error) throw error;

    revalidatePath("/admin/mail");
    return { success: true };
  } catch (error: any) {
    console.error("Template Creation Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 3. Delete Email Template
 * Note: revalidatePath is correctly placed.
 */
export async function deleteEmailTemplate(id: number) {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  try {
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/mail");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 4. Update Email Template
 * Correction: Ensure the status has a fallback if not provided in the data object.
 */
export async function updateEmailTemplate(id: number, data: any) {
  const cookieStore = await cookies();
  const supabase = createServerSupabaseClient({ cookies: cookieStore });

  try {
    const { error } = await supabase
      .from("email_templates")
      .update({
        name: data.name,
        category: data.category,
        subject: data.subject,
        body: data.body,
        // Fallback to 'Active' or current status if data.status is undefined
        status: data.status || 'Active' 
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/mail");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}