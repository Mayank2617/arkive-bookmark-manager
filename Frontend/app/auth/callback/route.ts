// Google OAuth Callback Route
// Handles the OAuth callback after successful authentication

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                // Local development
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                // Production with reverse proxy
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                // Production without reverse proxy
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/error`)
}
