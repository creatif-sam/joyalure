import { createClient } from "@supabase/supabase-js"

let _client: ReturnType<typeof createClient> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseAdmin = (): any => {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }

  _client = createClient(url, key)
  return _client
}
