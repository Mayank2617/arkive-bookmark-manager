"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { fetchBookmarks, createBookmark, deleteBookmark, updateBookmark, subscribeToBookmarks } from "@/lib/api/bookmarks"
import { fetchCollections, subscribeToCollections } from "@/lib/api/collections"
import type { Bookmark } from "@/lib/mock-data"
import { WorkspaceSidebar } from "@/components/dashboard/workspace-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BookmarkGrid } from "@/components/dashboard/bookmark-grid"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { AddBookmarkModal } from "@/components/dashboard/add-bookmark-modal"
import { AddCollectionModal } from "@/components/dashboard/add-collection-modal"
import { DeleteCollectionModal } from "@/components/dashboard/delete-collection-modal"
import { MoveBookmarkModal } from "@/components/dashboard/move-bookmark-modal"
import { EditCollectionModal } from "@/components/dashboard/edit-collection-modal"
import { RealtimeToaster } from "@/components/dashboard/realtime-toaster"
import { ToastContainer } from "@/components/ui/toast-container"
import { toast } from "@/lib/toast"

export default function DashboardPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [collectionToDelete, setCollectionToDelete] = useState<any>(null)
  const [bookmarkToMove, setBookmarkToMove] = useState<any>(null)
  const [collectionToEdit, setCollectionToEdit] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Check authentication and load data
  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  async function checkAuthAndLoadData() {
    const supabase = createClient()

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      console.log('No session found, redirecting to home')
      router.push('/')
      return
    }

    setUser(session.user)
    console.log('✅ Authenticated user:', session.user.email)

    // Load bookmarks and collections
    await loadData()
  }

  async function loadData() {
    try {
      setIsLoading(true)
      console.log('📡 Fetching bookmarks and collections...')

      const [bookmarksData, collectionsData] = await Promise.all([
        fetchBookmarks(),
        fetchCollections()
      ])

      console.log('✅ Loaded:', {
        bookmarks: bookmarksData.length,
        collections: collectionsData.length
      })

      setBookmarks(bookmarksData as any)
      setCollections(collectionsData)
      setIsLoading(false)
    } catch (error) {
      console.error('❌ Error loading data:', error)
      setIsLoading(false)
    }
  }

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    console.log('🔄 Setting up real-time subscriptions')

    // Subscribe to bookmarks
    const bookmarksChannel = subscribeToBookmarks((payload) => {
      console.log('🔄 Bookmark change:', payload)

      if (payload.eventType === 'INSERT') {
        setBookmarks(prev => [payload.new as any, ...prev])
      } else if (payload.eventType === 'DELETE') {
        setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
      } else if (payload.eventType === 'UPDATE') {
        setBookmarks(prev => prev.map(b =>
          b.id === payload.new.id ? payload.new as any : b
        ))
      }
    })

    // Subscribe to collections
    const collectionsChannel = subscribeToCollections((payload) => {
      console.log('🔄 Collection change:', payload)

      if (payload.eventType === 'INSERT') {
        setCollections(prev => [...prev, payload.new])
      } else if (payload.eventType === 'DELETE') {
        setCollections(prev => prev.filter(c => c.id !== payload.old.id))
      } else if (payload.eventType === 'UPDATE') {
        setCollections(prev => prev.map(c =>
          c.id === payload.new.id ? payload.new : c
        ))
      }
    })

    return () => {
      const supabase = createClient()
      supabase.removeChannel(bookmarksChannel)
      supabase.removeChannel(collectionsChannel)
      console.log('🔌 Unsubscribed from real-time channels')
    }
  }, [user])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        setIsAddModalOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Filter bookmarks
  const filteredBookmarks = useCallback(() => {
    let filtered = [...bookmarks]

    // Apply search filter first if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((b: any) =>
        b.title?.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query) ||
        b.url?.toLowerCase().includes(query) ||
        b.domain?.toLowerCase().includes(query)
      )
      return filtered
    }

    if (activeFolderId) {
      filtered = filtered.filter((b: any) => b.folderId === activeFolderId || b.collection_id === activeFolderId)
    } else {
      switch (activeFilter) {
        case "recent":
          filtered = filtered.slice(0, 5)
          break
        case "unread":
          filtered = filtered.filter((b) => b.unread)
          break
        case "starred":
          filtered = filtered.filter((b) => b.starred)
          break
      }
    }

    return filtered
  }, [bookmarks, activeFolderId, activeFilter, searchQuery])

  const currentBookmarks = filteredBookmarks()

  // Get current title
  const getTitle = () => {
    if (activeFolderId) {
      return collections.find((c) => c.id === activeFolderId)?.name ?? "Collection"
    }
    switch (activeFilter) {
      case "recent":
        return "Recent"
      case "unread":
        return "Unread"
      case "starred":
        return "Starred"
      default:
        return "All Bookmarks"
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark(id)
      // Optimistic update
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
      toast.success("Bookmark deleted successfully")
    } catch (error: any) {
      console.error('Error deleting bookmark:', error)
      toast.error(error.message || "Failed to delete bookmark")
    }
  }

  const handleToggleStar = async (id: string) => {
    const bookmark = bookmarks.find(b => b.id === id)
    if (!bookmark) return

    try {
      // Optimistic update
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, starred: !b.starred } : b))
      )

      await updateBookmark(id, { starred: !bookmark.starred })
    } catch (error: any) {
      console.error('Error toggling star:', error)
      toast.error(error.message || "Failed to update bookmark")
      // Revert on error
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, starred: bookmark.starred } : b))
      )
    }
  }

  const handleAddBookmark = async (data: { url: string; folderId: string | null; metadata?: any }) => {
    try {
      console.log('➕ Adding bookmark:', data)
      console.log('📦 Metadata received:', data.metadata)

      const newBookmark = await createBookmark({
        url: data.url,
        collection_id: data.folderId,
        // Pass pre-fetched metadata if available
        ...(data.metadata && {
          title: data.metadata.title,
          description: data.metadata.description,
          image: data.metadata.image,
          favicon: data.metadata.favicon,
          dominant_color: data.metadata.dominantColor,
        })
      })

      console.log('✅ Bookmark added:', newBookmark)
      // Real-time will handle the state update
    } catch (error: any) {
      console.error('❌ Error adding bookmark:', error)
      toast.error(error.message || 'Failed to add bookmark. Please try again.')
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <WorkspaceSidebar
        activeFolderId={activeFolderId}
        onFolderSelect={setActiveFolderId}
        activeFilter={activeFilter}
        onFilterSelect={setActiveFilter}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collections={collections}
        bookmarks={bookmarks}
        onAddCollection={() => setIsAddCollectionModalOpen(true)}
        onDeleteCollection={(collection) => setCollectionToDelete(collection)}
        onEditCollection={(collection) => setCollectionToEdit(collection)}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          title={getTitle()}
          count={currentBookmarks.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <div className="flex-1 overflow-y-auto">
          <BookmarkGrid
            bookmarks={currentBookmarks}
            isLoading={isLoading}
            viewMode={viewMode}
            onDelete={handleDelete}
            onToggleStar={handleToggleStar}
            onMove={(bookmark) => setBookmarkToMove(bookmark)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            searchQuery={searchQuery}
          />
        </div>
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBookmark}
        collections={collections}
        defaultCollectionId={activeFolderId}
      />

      <AddCollectionModal
        isOpen={isAddCollectionModalOpen}
        onClose={() => setIsAddCollectionModalOpen(false)}
      />

      <DeleteCollectionModal
        isOpen={!!collectionToDelete}
        onClose={() => setCollectionToDelete(null)}
        collection={collectionToDelete}
      />

      <EditCollectionModal
        isOpen={!!collectionToEdit}
        onClose={() => setCollectionToEdit(null)}
        collection={collectionToEdit}
      />

      <MoveBookmarkModal
        isOpen={!!bookmarkToMove}
        onClose={() => setBookmarkToMove(null)}
        bookmark={bookmarkToMove}
        collections={collections}
      />

      <ToastContainer />
      <RealtimeToaster />
    </div>
  )
}
