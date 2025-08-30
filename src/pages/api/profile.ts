import { supabase, getUser } from '../../utils/supabaseServer'
import { accessTokenName, refreshTokenName } from '../../utils/config'

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
    try {
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
        const { username, website, avatar_url } = body

        // Input validation
        if (username && (typeof username !== 'string' || username.length > 50)) {
            return new Response(JSON.stringify({ error: 'Invalid username' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (website && (typeof website !== 'string' || website.length > 200)) {
            return new Response(JSON.stringify({ error: 'Invalid website URL' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Update the profile using the authenticated server-side client
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userData.id,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            })

        if (error) {
            console.error('Profile update error:', error)
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        return new Response(JSON.stringify({ success: true, data }), {
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
