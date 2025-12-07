import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: return a dummy object that won't be used
    return null as never
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

