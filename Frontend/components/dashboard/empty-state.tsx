"use client"

import { motion } from "framer-motion"
import { Bookmark, Plus, Search, FolderOpen, Inbox } from "lucide-react"

interface EmptyStateProps {
  onAdd?: () => void
  type?: "no-bookmarks" | "no-search-results" | "no-collections" | "no-bookmarks-in-collection"
  searchQuery?: string
  collectionName?: string
}

export function EmptyState({ onAdd, type = "no-bookmarks", searchQuery, collectionName }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "no-search-results":
        return {
          icon: Search,
          title: "No results found",
          description: searchQuery
            ? `No bookmarks match "${searchQuery}". Try a different search term.`
            : "No bookmarks match your search. Try a different search term.",
          showButton: false,
        }

      case "no-collections":
        return {
          icon: FolderOpen,
          title: "No collections yet",
          description: "Create your first collection to organize your bookmarks into categories.",
          showButton: false,
        }

      case "no-bookmarks-in-collection":
        return {
          icon: Inbox,
          title: `No bookmarks in ${collectionName || "this collection"}`,
          description: "Add bookmarks to this collection to see them here.",
          showButton: true,
          buttonText: "Add bookmark",
        }

      default: // no-bookmarks
        return {
          icon: Bookmark,
          title: "No bookmarks yet",
          description: "Add your first bookmark to get started. Paste any URL and Arkive will automatically extract rich previews and metadata.",
          showButton: true,
          buttonText: "Add your first bookmark",
        }
    }
  }

  const content = getContent()
  const Icon = content.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center px-6 py-24"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-lg"
        >
          <Icon className="h-8 w-8 text-muted-foreground" />
        </motion.div>
        <div className="absolute -bottom-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-primary/10 blur-md" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {content.title}
      </h3>
      <p className="mb-8 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        {content.description}
      </p>

      {content.showButton && onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4" />
          {content.buttonText}
        </button>
      )}
    </motion.div>
  )
}
