"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, AlertTriangle } from "lucide-react"
import { deleteCollection } from "@/lib/api/collections"
import { toast } from "@/lib/toast"

interface DeleteCollectionModalProps {
    isOpen: boolean
    onClose: () => void
    collection: {
        id: string
        name: string
        count?: number
    } | null
}

export function DeleteCollectionModal({
    isOpen,
    onClose,
    collection,
}: DeleteCollectionModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteBookmarks, setDeleteBookmarks] = useState(false)

    const handleDelete = async () => {
        if (!collection) return

        setIsDeleting(true)
        try {
            await deleteCollection(collection.id, deleteBookmarks)
            console.log("✅ Collection deleted successfully")
            onClose()
        } catch (error: any) {
            console.error("❌ Error deleting collection:", error)
            toast.error(error.message || "Failed to delete collection")
        } finally {
            setIsDeleting(false)
        }
    }

    if (!collection) return null

    const hasBookmarks = (collection.count || 0) > 0

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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                        <Trash2 className="h-5 w-5 text-destructive" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-foreground">Delete Collection</h2>
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
                                <div className="mb-4 flex items-start gap-3 rounded-lg bg-amber-500/10 p-4">
                                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Are you sure you want to delete "{collection.name}"?
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                {hasBookmarks && (
                                    <div className="mb-4">
                                        <p className="mb-3 text-sm text-muted-foreground">
                                            This collection contains <strong>{collection.count} bookmark{collection.count !== 1 ? 's' : ''}</strong>. What would you like to do with them?
                                        </p>

                                        <div className="space-y-2">
                                            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
                                                <input
                                                    type="radio"
                                                    name="delete-option"
                                                    checked={!deleteBookmarks}
                                                    onChange={() => setDeleteBookmarks(false)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Keep bookmarks</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Move bookmarks to "All Bookmarks" (no collection)
                                                    </p>
                                                </div>
                                            </label>

                                            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
                                                <input
                                                    type="radio"
                                                    name="delete-option"
                                                    checked={deleteBookmarks}
                                                    onChange={() => setDeleteBookmarks(true)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">Delete bookmarks</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Permanently delete all bookmarks in this collection
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Delete Collection
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
