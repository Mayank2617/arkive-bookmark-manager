"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Link2,
  Globe,
  FolderOpen,
  ChevronDown,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react"
import { extractUrlMetadata, fetchUrlMetadataViaProxy } from "@/lib/metadata"
import { toast } from "@/lib/toast"
import { AddCollectionModal } from "./add-collection-modal"

interface Collection {
  id: string
  name: string
  icon: string
  color: string
  count?: number
}

interface AddBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd?: (data: { url: string; folderId: string | null; metadata?: any }) => void
  collections?: Collection[]
  defaultCollectionId?: string | null
}

type PreviewState = "idle" | "loading" | "success" | "error"

const sampleMetadata = {
  title: "React - The Library for Web and Native User Interfaces",
  description:
    "React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.",
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop",
  domain: "react.dev",
  favicon: "https://react.dev/favicon.ico",
}

export function AddBookmarkModal({
  isOpen,
  onClose,
  onAdd,
  collections = [],
  defaultCollectionId = null,
}: AddBookmarkModalProps) {
  const [url, setUrl] = useState("")
  const [previewState, setPreviewState] = useState<PreviewState>("idle")
  const [metadata, setMetadata] = useState<any>(null)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showFolderPicker, setShowFolderPicker] = useState(false)
  const [showAddCollection, setShowAddCollection] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setUrl("")
      setPreviewState("idle")
      setSelectedFolder(defaultCollectionId)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, defaultCollectionId])

  // Fetch URL metadata when valid URL is entered
  useEffect(() => {
    if (!url || url.length < 10) {
      setPreviewState("idle")
      setMetadata(null)
      return
    }

    // Normalize URL - add https:// if missing for metadata fetch
    let normalizedUrl = url.trim()
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`
      console.log('🔧 [Metadata useEffect] Auto-prepending https:// for fetch:', normalizedUrl)
    }

    console.log('🚀 [AddBookmark] Starting metadata fetch for:', normalizedUrl)

    setPreviewState("loading")

    // Debounce metadata fetching
    const timer = setTimeout(async () => {
      try {
        console.log('⏳ [AddBookmark] Fetching metadata via proxy...')
        // Try proxy method first for rich metadata
        const data = await fetchUrlMetadataViaProxy(normalizedUrl)
        console.log('✅ [AddBookmark] Metadata fetched successfully:', data)
        setMetadata(data)
        setPreviewState("success")
      } catch (error) {
        console.error('❌ [AddBookmark] Proxy fetch failed:', error)
        // Fallback to basic extraction
        try {
          const basicData = await extractUrlMetadata(normalizedUrl)
          setMetadata(basicData)
          setPreviewState("success")
        } catch {
          console.error('❌ [AddBookmark] All metadata fetch methods failed')
          setPreviewState("error")
        }
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [url])

  const selectedCollection = collections.find(
    (c) => c.id === selectedFolder
  )

  const handleSubmit = async () => {
    // Normalize URL - add https:// if missing
    let normalizedUrl = url.trim()
    if (!normalizedUrl.match(/^https?:\/\//)) {
      console.log('🔧 [handleSubmit] Auto-prepending https:// to:', normalizedUrl)
      normalizedUrl = `https://${normalizedUrl}`
    }

    console.log('📤 [handleSubmit] Submitting bookmark with URL:', normalizedUrl)
    console.log('📦 [handleSubmit] Metadata to save:', metadata)

    try {
      await onAdd?.({
        url: normalizedUrl,
        folderId: selectedFolder,
        metadata: metadata
      })
      onClose()
    } catch (error: any) {
      console.error('❌ [handleSubmit] Error adding bookmark:', error)
      // Show user-friendly error message
      if (error.message?.includes('already exists')) {
        toast.error('This bookmark already exists in your collection')
      } else {
        toast.error(error.message || 'Failed to add bookmark. Please try again.')
      }
    }
  }

  const handleCollectionCreated = () => {
    // Refresh will be handled by parent component's real-time subscription
    setShowAddCollection(false)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal Container - centers on all screen sizes */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-popover shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-popover z-10">
                  <h2 className="text-base font-semibold text-foreground">
                    Add Bookmark
                  </h2>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* URL Input */}
                  <div className="mb-4">
                    <label
                      htmlFor="url-input"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      URL
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2.5">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <input
                        id="url-input"
                        ref={inputRef}
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      {previewState === "loading" && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      {previewState === "success" && (
                        <Check className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {/* Collection Picker */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Collection (optional)
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowFolderPicker(!showFolderPicker)}
                        className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm transition-colors hover:border-primary/30"
                      >
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <span className={selectedCollection ? "text-foreground" : "text-muted-foreground"}>
                          {selectedCollection?.name ?? "Choose a collection"}
                        </span>
                        <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                      </button>

                      <AnimatePresence>
                        {showFolderPicker && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl"
                          >
                            <button
                              onClick={() => {
                                setSelectedFolder(null)
                                setShowFolderPicker(false)
                              }}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${!selectedFolder ? "text-primary" : "text-foreground"
                                }`}
                            >
                              <Globe className="h-4 w-4" />
                              No collection
                            </button>
                            {collections.map((collection) => (
                              <button
                                key={collection.id}
                                onClick={() => {
                                  setSelectedFolder(collection.id)
                                  setShowFolderPicker(false)
                                }}
                                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${selectedFolder === collection.id
                                  ? "text-primary"
                                  : "text-foreground"
                                  }`}
                              >
                                <div
                                  className="h-3 w-3 rounded"
                                  style={{ background: collection.color }}
                                />
                                {collection.name}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {collection.count || 0}
                                </span>
                              </button>
                            ))}

                            {/* Create New Collection Button */}
                            <div className="my-1 border-t border-border" />
                            <button
                              onClick={() => {
                                setShowFolderPicker(false)
                                setShowAddCollection(true)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent text-primary font-medium"
                            >
                              <div className="flex h-4 w-4 items-center justify-center">
                                <span className="text-lg leading-none">+</span>
                              </div>
                              Create New Collection
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Preview */}
                  <AnimatePresence mode="wait">
                    {previewState === "loading" && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden rounded-xl border border-border"
                      >
                        <div className="h-32 animate-pulse bg-muted" />
                        <div className="p-3">
                          <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
                          <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        </div>
                      </motion.div>
                    )}

                    {previewState === "success" && (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden rounded-xl border border-border bg-card"
                      >
                        <div className="relative h-32 overflow-hidden">
                          {metadata?.image ? (
                            <img
                              src={metadata.image}
                              alt="URL preview"
                              className="h-full w-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div
                              className="h-full w-full flex items-center justify-center"
                              style={{ backgroundColor: metadata?.dominantColor || 'hsl(0, 0%, 90%)' }}
                            >
                              {metadata?.favicon ? (
                                <img
                                  src={metadata.favicon}
                                  alt="Site favicon"
                                  className="h-16 w-16 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
                                />
                              ) : (
                                <Globe className="h-12 w-12 text-white/50" />
                              )}
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                            {metadata?.favicon ? (
                              <img src={metadata.favicon} alt="favicon" className="h-3 w-3 rounded-sm" />
                            ) : (
                              <Globe className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span className="text-foreground">{metadata?.domain || (url && new URL(url).hostname)}</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="mb-1 text-sm font-semibold text-foreground">
                            {metadata?.title || "Fetching title..."}
                          </h4>
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {metadata?.description || "Loading preview..."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
                  <button
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!url || previewState === "loading"}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Bookmark
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Add Collection Modal */}
      <AddCollectionModal
        isOpen={showAddCollection}
        onClose={() => setShowAddCollection(false)}
      />
    </>
  )
}

