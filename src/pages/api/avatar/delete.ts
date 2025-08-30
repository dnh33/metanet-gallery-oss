import { supabase, getUser } from '../../../utils/supabaseServer'
import { accessTokenName, refreshTokenName, isSupabaseConfigured } from '../../../utils/config'

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
    try {
        // If Supabase isn't configured, just return success (no-op)
        if (!isSupabaseConfigured) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Avatar delete skipped - Supabase not configured'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const accessToken = cookies.get(accessTokenName)?.value
        const refreshToken = cookies.get(refreshTokenName)?.value

        if (!accessToken || !refreshToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const userData = await getUser({ accessToken, refreshToken })
        if (!userData) {
            return new Response(JSON.stringify({ error: 'Invalid session' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const body = await request.json()
        const { avatarPath } = body

        if (!avatarPath || typeof avatarPath !== 'string') {
            return new Response(JSON.stringify({ error: 'Valid avatar path is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Basic path validation
        if (avatarPath.length > 500 || !avatarPath.includes('/')) {
            return new Response(JSON.stringify({ error: 'Invalid avatar path format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Verify the avatar path belongs to the current user for security
        const pathParts = avatarPath.split('/')
        if (pathParts[0] !== userData.id) {
            return new Response(JSON.stringify({ error: 'Unauthorized to delete this avatar' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (!supabase) {
            return new Response(JSON.stringify({ error: 'Supabase client not available' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const { error } = await supabase.storage
            .from('avatars')
            .remove([avatarPath])

        if (error) {
            console.error('Avatar delete error:', error)
            // Don't return error for delete failures, just log them
            // This allows the upload to continue even if old avatar deletion fails
            console.warn('Failed to delete old avatar, continuing with upload')
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
