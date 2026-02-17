import { createClient } from '@/lib/supabase/client'

export interface Bookmark {
    id: string
    user_id: string
    collection_id: string | null
    url: string
    title: string
    description: string
    image: string | null
    favicon: string | null
    domain: string
    dominant_color: string
    starred: boolean
    unread: boolean
    created_at: string
    updated_at: string
}

interface EnrichedMetadata {
    title: string
    description: string
    image: string | null
    favicon: string | null
    domain: string
    dominantColor: string
}

interface CreateBookmarkData {
    url: string
    collection_id?: string | null
    // Optional pre-fetched metadata from client
    title?: string
    description?: string
    image?: string | null
    favicon?: string
    dominant_color?: string
}

const supabase = createClient()

/**
 * Fetch all bookmarks for the current user
 */
export async function getBookmarks(
    filter?: 'all' | 'starred' | 'unread' | 'recent',
    collectionId?: string | null
): Promise<Bookmark[]> {
    let query = supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

    if (collectionId) {
        query = query.eq('collection_id', collectionId)
    } else if (filter === 'starred') {
        query = query.eq('starred', true)
    } else if (filter === 'unread') {
        query = query.eq('unread', true)
    } else if (filter === 'recent') {
        query = query.limit(20)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching bookmarks:', error)
        throw new Error(error.message)
    }

    return data || []
}

// Alias for backward compatibility
export const fetchBookmarks = getBookmarks

/**
 * Enrich metadata from URL using Edge Function
 * TODO: Phase 10 - Deploy Edge Function and enable this
 */
export async function enrichMetadata(url: string): Promise<EnrichedMetadata> {
    try {
        // Extract domain from URL
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace('www.', '')

        // For now, use basic metadata extraction
        // Phase 10 will implement full Edge Function with OpenGraph scraping
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors', // This prevents CORS errors but limits what we can read
            })

            return {
                title: extractTitleFromUrl(url),
                description: `Bookmark from ${domain}`,
                image: null,
                favicon: `https://${domain}/favicon.ico`,
                domain: domain,
                dominantColor: generateColorFromDomain(domain),
            }
        } catch {
            // If fetch fails, return basic info
            return {
                title: extractTitleFromUrl(url),
                description: `Bookmark from ${domain}`,
                image: null,
                favicon: `https://${domain}/favicon.ico`,
                domain: domain,
                dominantColor: generateColorFromDomain(domain),
            }
        }
    } catch (error) {
        console.error('Error enriching metadata:', error)
        // Fallback to basic metadata
        try {
            const urlObj = new URL(url)
            const domain = urlObj.hostname.replace('www.', '')
            return {
                title: url,
                description: '',
                image: null,
                favicon: null,
                domain: 'unknown',
                dominantColor: 'hsl(0, 0%, 50%)',
            }
        } catch {
            return {
                title: url,
                description: '',
                image: null,
                favicon: null,
                domain: 'unknown',
                dominantColor: 'hsl(0, 0%, 50%)',
            }
        }
    }
}

/**
 * Generate a consistent color based on domain name
 */
function generateColorFromDomain(domain: string): string {
    // Simple hash function
    let hash = 0
    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash % 360)
    const saturation = 60 + (Math.abs(hash % 20))
    const lightness = 45 + (Math.abs(hash % 15))

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function extractTitleFromUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace('www.', '')
        const pathParts = urlObj.pathname.split('/').filter(Boolean)

        if (pathParts.length > 0) {
            const lastPart = pathParts[pathParts.length - 1]
            const cleaned = lastPart.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
            if (cleaned.length > 3) {
                return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
            }
        }

        return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
    } catch {
        return url
    }
}

/**
 * Create a new bookmark with enriched metadata
 */
export async function createBookmark(
    data: CreateBookmarkData
): Promise<Bookmark> {
    // Validate and fix URL (add protocol if missing)
    let url = data.url.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('User not authenticated')
    }

    // Check if client provided pre-fetched metadata
    let metadata: EnrichedMetadata
    if (data.title && data.description) {
        console.log('✅ Using pre-fetched client metadata!')
        const urlObj = new URL(url)
        metadata = {
            title: data.title,
            description: data.description,
            image: data.image || null,
            favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`,
            domain: urlObj.hostname.replace('www.', ''),
            dominantColor: data.dominant_color || generateColorFromDomain(urlObj.hostname.replace('www.', '')),
        }
        console.log('📦 Client metadata being used:', metadata)
    } else {
        console.log('🔄 No client metadata, enriching from URL...')
        metadata = await enrichMetadata(url)
    }

    // If bookmark is in a collection, get the collection's color
    let dominantColor = metadata.dominantColor
    if (data.collection_id) {
        const { data: collection } = await supabase
            .from('collections')
            .select('color')
            .eq('id', data.collection_id)
            .single()

        if (collection?.color) {
            dominantColor = collection.color
        }
    }

    // Check for duplicates
    const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('url', url)
        .single()

    if (existing) {
        throw new Error('Bookmark already exists')
    }

    // Insert bookmark with enriched metadata
    const { data: bookmark, error } = await supabase
        .from('bookmarks')
        .insert({
            user_id: user.id,  // CRITICAL: Set user_id for RLS policy
            url: url,
            collection_id: data.collection_id || null,
            title: metadata.title,
            description: metadata.description,
            image: metadata.image,
            favicon: metadata.favicon,
            domain: metadata.domain,
            dominant_color: dominantColor,  // Use collection color if available
            starred: false,
            unread: true,
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating bookmark:', error)
        throw new Error(error.message)
    }

    return bookmark
}

/**
 * Update an existing bookmark
 */
export async function updateBookmark(
    id: string,
    updates: Partial<Bookmark>
): Promise<Bookmark> {
    const { data, error } = await supabase
        .from('bookmarks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating bookmark:', error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Delete a bookmark
 */
export async function deleteBookmark(id: string): Promise<void> {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
        console.error('Error deleting bookmark:', error)
        throw new Error(error.message)
    }
}

/**
 * Toggle bookmark starred status
 */
export async function toggleBookmarkStar(id: string, starred: boolean): Promise<void> {
    const { error } = await supabase
        .from('bookmarks')
        .update({ starred })
        .eq('id', id)

    if (error) {
        console.error('Error toggling bookmark star:', error)
        throw new Error(error.message)
    }
}

/**
 * Mark bookmark as read/unread
 */
export async function markBookmarkRead(id: string, unread: boolean): Promise<void> {
    const { error } = await supabase.from('bookmarks').update({ unread }).eq('id', id)

    if (error) {
        console.error('Error marking bookmark read:', error)
        throw new Error(error.message)
    }
}

/**
 * Move bookmark to a different collection
 */
export async function moveBookmark(
    id: string,
    collectionId: string | null
): Promise<void> {
    const { error } = await supabase
        .from('bookmarks')
        .update({ collection_id: collectionId })
        .eq('id', id)

    if (error) {
        console.error('Error moving bookmark:', error)
        throw new Error(error.message)
    }
}

/**
 * Subscribe to real-time bookmark changes
 */
export function subscribeToBookmarks(
    callback: (payload: any) => void
): () => void {
    const channel = supabase
        .channel('bookmarks-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bookmarks',
            },
            callback
        )
        .subscribe()

    // Return unsubscribe function
    return () => {
        supabase.removeChannel(channel)
    }
}
