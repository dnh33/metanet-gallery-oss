import { createClient } from "@supabase/supabase-js"
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./config"

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
