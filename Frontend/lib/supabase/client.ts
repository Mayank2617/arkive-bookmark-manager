// Supabase Client for Browser (Client Components)
// Use this in client components that need to interact with Supabase

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    console.log('🔧 Creating Supabase client with:', {
        url,
        hasKey: !!key,
        keyPrefix: key?.substring(0, 20) + '...'
    })

    if (!url || !key) {
        console.error('❌ Missing Supabase environment variables!')
        throw new Error('Missing Supabase URL or Anon Key')
    }

    return createBrowserClient(url, key)
}

// Export types for TypeScript
export type { User, Session } from '@supabase/supabase-js'
