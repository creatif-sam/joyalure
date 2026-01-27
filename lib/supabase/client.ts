import { createBrowserClient } from "@supabase/ssr"

const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If variables are missing (like during build time), 
  // we return a client that won't crash the build process.
  if (!url || !anonKey) {
    return createBrowserClient(
      "https://placeholder.supabase.co", 
      "placeholder-key"
    );
  }

  return createBrowserClient(url, anonKey);
}

export { createClient }