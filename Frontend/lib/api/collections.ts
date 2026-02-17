// Collections API Client
// Client-side wrapper for collection CRUD operations and real-time subscriptions

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient()

export interface Collection {
    id: string
    user_id: string
    name: string
    icon: string
    color: string
    created_at: string
    updated_at: string
    count?: number // Bookmark count (joined from bookmarks table)
}

export interface CreateCollectionData {
    name: string
    icon?: string
    color?: string
}

export interface UpdateCollectionData {
    name?: string
    icon?: string
    color?: string
}

/**
 * Fetch all collections for the current user with bookmark counts
 */
export async function fetchCollections(): Promise<Collection[]> {
    const { data: collections, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching collections:', error)
        throw new Error(error.message)
    }

    // Fetch bookmark counts for each collection
    const collectionsWithCounts = await Promise.all(
        (collections || []).map(async (collection: Collection) => {
            const { count } = await supabase
                .from('bookmarks')
                .select('*', { count: 'exact', head: true })
                .eq('collection_id', collection.id)

            return {
                ...collection,
                count: count || 0,
            }
        })
    )

    return collectionsWithCounts
}

/**
 * Create a new collection
 */
export async function createCollection(
    data: CreateCollectionData
): Promise<Collection> {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('User not authenticated')
    }

    const { data: collection, error } = await supabase
        .from('collections')
        .insert({
            user_id: user.id,  // CRITICAL: Set user_id for RLS policy
            name: data.name,
            icon: data.icon || 'folder',
            color: data.color || 'hsl(0, 0%, 50%)',
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating collection:', error)
        throw new Error(error.message)
    }

    return { ...collection, count: 0 }
}

/**
 * Update an existing collection
 */
export async function updateCollection(
    id: string,
    updates: UpdateCollectionData
): Promise<Collection> {
    const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating collection:', error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Delete a collection with cascade options
 * @param id - Collection ID
 * @param deleteBookmarks - If true, deletes all bookmarks in collection. If false, moves bookmarks to root
 */
export async function deleteCollection(
    id: string,
    deleteBookmarks: boolean = false
): Promise<void> {
    // Use the database function for cascade handling
    const { error } = await supabase.rpc('delete_collection_with_options', {
        p_collection_id: id,
        p_delete_bookmarks: deleteBookmarks,
    })

    if (error) {
        console.error('Error deleting collection:', error)
        throw new Error(error.message)
    }
}

/**
 * Get bookmark count for a collection
 */
export async function getCollectionBookmarkCount(id: string): Promise<number> {
    const { count, error } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', id)

    if (error) {
        console.error('Error getting collection count:', error)
        return 0
    }

    return count || 0
}

/**
 * Subscribe to real-time collection changes
 */
export function subscribeToCollections(
    callback: (payload: any) => void
): RealtimeChannel {
    const channel = supabase
        .channel('collections_changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'collections',
            },
            callback
        )
        .subscribe()

    return channel
}

/**
 * Unsubscribe from real-time updates
 */
export async function unsubscribeFromCollections(
    channel: RealtimeChannel
): Promise<void> {
    await supabase.removeChannel(channel)
}
