
// Supabase configuration with fallback values for development
export const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
export const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
export const cookiePrefix = import.meta.env.PUBLIC_SUPABASE_COOKIE_PRE || 'supabase'

export const appMailRedirects  = import.meta.env.PUBLIC_APP_URL || 'http://localhost:3000'

export const accessTokenName = `${cookiePrefix}-access-token`
export const refreshTokenName = `${cookiePrefix}-refresh-token`

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  import.meta.env.PUBLIC_SUPABASE_URL &&
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY &&
  import.meta.env.PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
)
