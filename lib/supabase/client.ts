import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Not configured' } }),
        signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Not configured' } }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        exchangeCodeForSession: async () => ({ data: { user: null, session: null }, error: null }),
      },
    } as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

