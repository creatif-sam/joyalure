import { createBrowserClient } from "@supabase/ssr"

const createClient = () => {
  // Capture the variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During the build phase on Vercel, these variables might be missing.
  // If they are missing, we provide placeholder strings so the 
  // createBrowserClient function doesn't crash the build.
  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient(
      "https://placeholder.supabase.co",
      "placeholder-key"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export { createClient }