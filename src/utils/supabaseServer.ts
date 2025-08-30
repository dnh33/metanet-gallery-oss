import { createClient } from "@supabase/supabase-js"

import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./config"

// to be used on server
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {auth: { persistSession: false } })
  : null

export const getUser = async (arg: {
    accessToken: string | undefined,
    refreshToken: string | undefined,
}) => {
    // If Supabase is not configured, return undefined
    if (!supabase) {
        console.log('Supabase not configured, skipping authentication')
        return undefined
    }

    const {accessToken, refreshToken } = arg

    try {
        if (!accessToken) throw "No accessToken"
        if (!refreshToken) throw "No refreshToken"

        await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        })

        const sessionReq = await supabase.auth.getSession()
        const user = sessionReq?.data?.session?.user

        if (!user) throw "No user"

        // Get user profile data
        const { data, error } = await supabase
            .from("profiles")
            .select("username, website, avatar_url")
            .eq("id", user.id)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.log('Profile fetch error:', error)
            throw error
        }

        const { id, email, phone } = user
        return {
            ...data,
            id,
            email,
            phone
        }
    } catch (e) {
        console.log(e)
        return undefined
    }
}

