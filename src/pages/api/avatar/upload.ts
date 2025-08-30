import { supabase, getUser } from '../../../utils/supabaseServer'
import { accessTokenName, refreshTokenName, isSupabaseConfigured } from '../../../utils/config'

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
    try {
        // If Supabase isn't configured, return a graceful error
        if (!isSupabaseConfigured) {
            return new Response(JSON.stringify({
                error: 'Avatar upload not available - Supabase storage not configured',
                configured: false
            }), {
                status: 503, // Service Unavailable
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

        const formData = await request.formData()
        const file = formData.get('avatar') as File

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Validate file exists and is actually a file
        if (!(file instanceof File) || file.size === 0) {
            return new Response(JSON.stringify({ error: 'Invalid file' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return new Response(JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
            return new Response(JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Validate filename
        if (!file.name || file.name.length > 255) {
            return new Response(JSON.stringify({ error: 'Invalid filename' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${userData.id}/${fileName}`

        // Convert File to Uint8Array for Supabase upload
        const arrayBuffer = await file.arrayBuffer()
        const fileData = new Uint8Array(arrayBuffer)

        if (!supabase) {
            return new Response(JSON.stringify({ error: 'Supabase client not available' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, fileData, {
                contentType: file.type,
                upsert: false
            })

        if (error) {
            console.error('Avatar upload error:', error)
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        return new Response(JSON.stringify({
            success: true,
            path: data.path,
            fullPath: filePath
        }), {
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
