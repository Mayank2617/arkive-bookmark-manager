"use client"

import { motion } from "framer-motion"
import {
  Bookmark,
  Clock,
  Star,
  Inbox,
  FolderOpen,
  Plus,
  Palette,
  Code,
  Brain,
  BookOpen,
  Briefcase,
  ChevronRight,
  Search,
  X,
  Trash2,
  Pencil,
} from "lucide-react"
import { UserButton } from "./user-button"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  code: Code,
  brain: Brain,
  book: BookOpen,
  briefcase: Briefcase,
  folder: FolderOpen,
}

interface Collection {
  id: string
  name: string
  icon: string
  color: string
  count?: number
}

interface WorkspaceSidebarProps {
  activeFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  activeFilter: string
  onFilterSelect: (filter: string) => void
  isOpen: boolean
  onClose: () => void
  collections?: Collection[]
  bookmarks?: any[]
  onAddCollection?: () => void
  onDeleteCollection?: (collection: Collection) => void
  onEditCollection?: (collection: Collection) => void
}

export function WorkspaceSidebar({
  activeFolderId,
  onFolderSelect,
  activeFilter,
  onFilterSelect,
  isOpen,
  onClose,
  collections = [],
  bookmarks = [],
  onAddCollection,
  onDeleteCollection,
  onEditCollection,
}: WorkspaceSidebarProps) {
  const totalBookmarks = bookmarks.length
  const maxBookmarks = 100

  const filters = [
    { id: "all", label: "All Bookmarks", icon: Bookmark, count: totalBookmarks },
    { id: "recent", label: "Recent", icon: Clock, count: Math.min(5, totalBookmarks) },
    { id: "unread", label: "Unread", icon: Inbox, count: bookmarks.filter((b) => b.unread).length },
    { id: "starred", label: "Starred", icon: Star, count: bookmarks.filter((b) => b.starred).length },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar lg:relative lg:z-auto ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-200 ease-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bookmark className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground">Arkive</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Quick Filters */}
          <div className="mb-1">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id && !activeFolderId
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    onFilterSelect(filter.id)
                    onFolderSelect(null)
                    onClose()
                  }}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                    ? "bg-sidebar-accent text-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                    }`}
                >
                  <filter.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                  <span className="flex-1 text-left">{filter.label}</span>
                  <span className={`text-xs tabular-nums ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {filter.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Collections */}
          <div className="mb-1 mt-6">
            <div className="mb-2 flex items-center justify-between px-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Collections
              </h3>
              <button
                onClick={onAddCollection}
                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                aria-label="New collection"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            {collections.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                No collections yet
              </div>
            ) : (
              collections.map((collection) => {
                const Icon = iconMap[collection.icon] || FolderOpen
                const isActive = activeFolderId === collection.id
                const bookmarkCount = bookmarks.filter(b =>
                  b.collection_id === collection.id || b.folderId === collection.id
                ).length

                return (
                  <div
                    key={collection.id}
                    className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer ${isActive
                      ? "bg-sidebar-accent text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    onClick={() => {
                      onFolderSelect(collection.id)
                      onClose()
                    }}
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded"
                      style={{ backgroundColor: `${collection.color}20` }}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    <span className="flex-1 truncate text-left">{collection.name}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {bookmarkCount}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEditCollection?.(collection)
                        }}
                        className="opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded hover:bg-primary/10 transition-all"
                        aria-label="Edit collection"
                      >
                        <Pencil className="h-3 w-3 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteCollection?.(collection)
                        }}
                        className="opacity-0 group-hover:opacity-100 flex h-5 w-5 items-center justify-center rounded hover:bg-destructive/10 transition-all"
                        aria-label="Delete collection"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Space usage */}
        <div className="border-t border-sidebar-border px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Space used</span>
            <span className="tabular-nums">{totalBookmarks} / {maxBookmarks}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalBookmarks / maxBookmarks) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        {/* User button */}
        <div className="border-t border-sidebar-border p-3">
          <UserButton />
        </div>
      </motion.aside>
    </>
  )
}
