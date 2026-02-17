"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ExternalLink,
  FolderInput,
  Trash2,
  Star,
  MoreHorizontal,
  GripVertical,
} from "lucide-react"
import type { Bookmark } from "@/lib/mock-data"

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete?: (id: string) => void
  onToggleStar?: (id: string) => void
  onMove?: (bookmark: Bookmark) => void
}

export function BookmarkCard({
  bookmark,
  onDelete,
  onToggleStar,
  onMove,
}: BookmarkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showActions, setShowActions] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowActions(false)
      }}
    >
      {/* Drag handle (visual only) */}
      <div className="absolute left-1.5 top-1.5 z-20 flex h-7 w-7 cursor-grab items-center justify-center rounded-md bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Cover image */}
      <div className="relative h-36 overflow-hidden sm:h-40">
        {bookmark.image && !imgError ? (
          <img
            src={bookmark.image}
            alt={`Preview of ${bookmark.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            style={{ background: bookmark.dominantColor }}
          >
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt={`${bookmark.domain} icon`}
                className="h-16 w-16 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
              />
            ) : (
              <span className="text-3xl font-bold text-white/30">
                {bookmark.domain.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}

        {/* Hover overlay with actions */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-background/60 backdrop-blur-sm"
        >
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
            aria-label={`Open ${bookmark.title}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => onToggleStar?.(bookmark.id)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-md transition-transform hover:scale-105 ${bookmark.starred
              ? "bg-amber-500 text-white"
              : "bg-card text-foreground"
              }`}
            aria-label={bookmark.starred ? "Unstar bookmark" : "Star bookmark"}
          >
            <Star className={`h-4 w-4 ${bookmark.starred ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-foreground shadow-md transition-transform hover:scale-105"
            aria-label="More actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </motion.div>

        {/* More actions dropdown */}
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-2 top-2 z-30 min-w-[160px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-xl"
          >
            <button
              onClick={() => {
                onMove?.(bookmark)
                setShowActions(false)
              }}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <FolderInput className="h-3.5 w-3.5" />
              Move to folder
            </button>
            <button
              onClick={() => onDelete?.(bookmark.id)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </motion.div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt={`${bookmark.domain} favicon`}
              className="h-5 w-5 shrink-0 rounded"
              onError={(e) => {
                // Fallback to letter if favicon fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ background: `${bookmark.dominantColor}30` }}>
              <span className="text-[10px] font-bold" style={{ color: bookmark.dominantColor }}>
                {bookmark.domain.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="truncate text-xs text-muted-foreground">{bookmark.domain}</span>
          {bookmark.unread && (
            <div
              className="ml-auto h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: bookmark.dominantColor }}
            />
          )}
          {bookmark.starred && (
            <Star className="ml-auto h-3 w-3 shrink-0 fill-amber-500 text-amber-500" />
          )}
        </div>
        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {bookmark.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {bookmark.description}
        </p>
      </div>
    </motion.div>
  )
}
