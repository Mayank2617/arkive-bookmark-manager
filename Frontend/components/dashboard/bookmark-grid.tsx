"use client"

import { AnimatePresence, motion } from "framer-motion"
import { BookmarkCard } from "./bookmark-card"
import { SkeletonCard } from "./skeleton-card"
import { EmptyState } from "./empty-state"
import type { Bookmark } from "@/lib/mock-data"
import { ExternalLink, Star, Trash2 } from "lucide-react"

interface BookmarkGridProps {
  bookmarks: Bookmark[]
  isLoading?: boolean
  viewMode: "grid" | "list"
  onDelete?: (id: string) => void
  onToggleStar?: (id: string) => void
  onMove?: (bookmark: Bookmark) => void
  onOpenAddModal?: () => void
  searchQuery?: string
}

export function BookmarkGrid({
  bookmarks,
  isLoading,
  viewMode,
  onDelete,
  onToggleStar,
  onMove,
  onOpenAddModal,
  searchQuery = "",
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        type={searchQuery ? "no-search-results" : "no-bookmarks"}
        searchQuery={searchQuery}
        onAdd={onOpenAddModal}
      />
    )
  }

  if (viewMode === "list") {
    return (
      <div className="p-4 md:p-6">
        <div className="overflow-hidden rounded-xl border border-border">
          <AnimatePresence mode="popLayout">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center gap-4 border-b border-border bg-card p-4 transition-colors last:border-b-0 hover:bg-accent/50"
              >
                {/* Favicon / Color block */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${bookmark.dominantColor}20` }}
                >
                  <span className="text-sm font-bold" style={{ color: bookmark.dominantColor }}>
                    {bookmark.domain.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {bookmark.title}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {bookmark.domain} &middot; {bookmark.description}
                  </p>
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-1">
                  {bookmark.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                  {bookmark.starred && (
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={`Open ${bookmark.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => onToggleStar?.(bookmark.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Toggle star"
                  >
                    <Star className={`h-4 w-4 ${bookmark.starred ? "fill-amber-500 text-amber-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => onDelete?.(bookmark.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDelete}
            onToggleStar={onToggleStar}
            onMove={onMove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
