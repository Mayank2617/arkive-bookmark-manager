"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FolderInput, Globe, Check } from "lucide-react"
import { updateBookmark } from "@/lib/api/bookmarks"
import { toast } from "@/lib/toast"

interface Collection {
    id: string
    name: string
    icon: string
    color: string
    count?: number
}

interface MoveBookmarkModalProps {
    isOpen: boolean
    onClose: () => void
    bookmark: {
        id: string
        title: string
        collection_id?: string | null
    } | null
    collections: Collection[]
}

export function MoveBookmarkModal({
    isOpen,
    onClose,
    bookmark,
    collections,
}: MoveBookmarkModalProps) {
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)
    const [isMoving, setIsMoving] = useState(false)

    // Set selected collection when modal opens
    useState(() => {
        if (bookmark) {
            setSelectedCollectionId(bookmark.collection_id || null)
        }
    })

    const handleMove = async () => {
        if (!bookmark) return

        setIsMoving(true)
        try {
            await updateBookmark(bookmark.id, {
                collection_id: selectedCollectionId,
            })
            console.log("✅ Bookmark moved successfully")
            onClose()
        } catch (error: any) {
            console.error("❌ Error moving bookmark:", error)
            toast.error(error.message || "Failed to move bookmark")
        } finally {
            setIsMoving(false)
        }
    }

    if (!bookmark) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <FolderInput className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-foreground">Move Bookmark</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Move <strong className="text-foreground">"{bookmark.title}"</strong> to:
                                </p>

                                <div className="space-y-2">
                                    {/* No Collection Option */}
                                    <button
                                        onClick={() => setSelectedCollectionId(null)}
                                        className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${selectedCollectionId === null
                                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                            : "border-border hover:bg-accent"
                                            }`}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <span className="flex-1 text-sm font-medium text-foreground">
                                            No Collection
                                        </span>
                                        {selectedCollectionId === null && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </button>

                                    {/* Collections */}
                                    {collections.map((collection) => (
                                        <button
                                            key={collection.id}
                                            onClick={() => setSelectedCollectionId(collection.id)}
                                            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${selectedCollectionId === collection.id
                                                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                                : "border-border hover:bg-accent"
                                                }`}
                                        >
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded"
                                                style={{ backgroundColor: `${collection.color}20` }}
                                            >
                                                <div
                                                    className="h-3 w-3 rounded"
                                                    style={{ backgroundColor: collection.color }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-foreground">{collection.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {collection.count || 0} bookmark{collection.count !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            {selectedCollectionId === collection.id && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                                <button
                                    onClick={onClose}
                                    disabled={isMoving}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMove}
                                    disabled={isMoving}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isMoving ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Moving...
                                        </>
                                    ) : (
                                        <>
                                            <FolderInput className="h-4 w-4" />
                                            Move Bookmark
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
