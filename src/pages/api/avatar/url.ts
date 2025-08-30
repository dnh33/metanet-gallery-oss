import { supabase } from '../../../utils/supabaseServer'
import { isSupabaseConfigured } from '../../../utils/config'

export async function GET({ url }: { url: URL }) {
    try {
        const avatarPath = url.searchParams.get('path')

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

        // If Supabase isn't configured, return a graceful error
        if (!isSupabaseConfigured) {
            console.log('Supabase not configured, cannot generate avatar URL')
            return new Response(JSON.stringify({
                error: 'Supabase not configured',
                configured: false
            }), {
                status: 503, // Service Unavailable
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Try to get a signed URL using Supabase's built-in method
        if (!supabase) {
            return new Response(JSON.stringify({ error: 'Supabase client not available' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // First try to get a signed URL (more secure)
        console.log('Attempting to create signed URL for:', avatarPath)
        const { data: signedUrlData, error: signedError } = await supabase.storage
            .from('avatars')
            .createSignedUrl(avatarPath, 3600) // 1 hour expiry

        if (!signedError && signedUrlData?.signedUrl) {
            console.log('Successfully created signed URL:', signedUrlData.signedUrl.substring(0, 100) + '...')
            return new Response(JSON.stringify({
                success: true,
                url: signedUrlData.signedUrl,
                type: 'signed'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // If signed URL fails, try public URL
        console.log('Signed URL failed, trying public URL:', signedError?.message)
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(avatarPath)

        console.log('Public URL data:', publicUrlData)

        if (publicUrlData?.publicUrl) {
            console.log('Successfully created public URL:', publicUrlData.publicUrl)
            return new Response(JSON.stringify({
                success: true,
                url: publicUrlData.publicUrl,
                type: 'public'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // If both fail, return an error with more details
        return new Response(JSON.stringify({
            error: 'Could not generate avatar URL',
            details: {
                signedError: signedError?.message,
                hasPublicUrl: !!publicUrlData?.publicUrl,
                avatarPath
            }
        }), {
            status: 500,
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
