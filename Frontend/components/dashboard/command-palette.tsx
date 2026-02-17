"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ExternalLink,
  Star,
  Trash2,
  FolderPlus,
  Moon,
  Sun,
  Hash,
  ArrowRight,
} from "lucide-react"
import { mockBookmarks, mockCollections } from "@/lib/mock-data"
import { useTheme } from "next-themes"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

type ResultItem = {
  id: string
  type: "bookmark" | "collection" | "action"
  title: string
  subtitle: string
  icon: React.ReactNode
  color?: string
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme } = useTheme()

  // Build results
  const getResults = useCallback((): ResultItem[] => {
    const q = query.toLowerCase()

    const bookmarkResults: ResultItem[] = mockBookmarks
      .filter(
        (b) =>
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.domain.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        type: "bookmark" as const,
        title: b.title,
        subtitle: b.domain,
        icon: (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${b.dominantColor}20` }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: b.dominantColor }}
            >
              {b.domain.charAt(0).toUpperCase()}
            </span>
          </div>
        ),
      }))

    const collectionResults: ResultItem[] = mockCollections
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id: c.id,
        type: "collection" as const,
        title: c.name,
        subtitle: `${c.count} bookmarks`,
        icon: (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: `${c.color}20` }}
          >
            <Hash className="h-4 w-4" style={{ color: c.color }} />
          </div>
        ),
        color: c.color,
      }))

    const actions: ResultItem[] = [
      {
        id: "new-collection",
        type: "action" as const,
        title: "Create New Collection",
        subtitle: "Add a new folder to organize bookmarks",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FolderPlus className="h-4 w-4 text-primary" />
          </div>
        ),
      },
      {
        id: "toggle-theme",
        type: "action" as const,
        title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
        subtitle: "Toggle the application theme",
        icon: (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-amber-500" />
            )}
          </div>
        ),
      },
    ].filter(
      (a) => !q || a.title.toLowerCase().includes(q)
    )

    return [...bookmarkResults, ...collectionResults, ...actions]
  }, [query, theme])

  const results = getResults()

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            const item = results[selectedIndex]
            if (item.type === "bookmark") {
              const bookmark = mockBookmarks.find((b) => b.id === item.id)
              if (bookmark) window.open(bookmark.url, "_blank")
            } else if (item.id === "toggle-theme") {
              setTheme(theme === "dark" ? "light" : "dark")
            }
            onClose()
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose, theme, setTheme])

  return (
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

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[15%] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookmarks, collections, or actions..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <>
                  {/* Bookmarks section */}
                  {results.filter((r) => r.type === "bookmark").length > 0 && (
                    <div className="mb-2">
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Bookmarks
                      </p>
                      {results
                        .filter((r) => r.type === "bookmark")
                        .map((result) => {
                          const index = results.indexOf(result)
                          return (
                            <button
                              key={result.id}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                selectedIndex === index
                                  ? "bg-accent text-foreground"
                                  : "text-foreground hover:bg-accent"
                              }`}
                              onMouseEnter={() => setSelectedIndex(index)}
                              onClick={() => {
                                const bk = mockBookmarks.find((b) => b.id === result.id)
                                if (bk) window.open(bk.url, "_blank")
                                onClose()
                              }}
                            >
                              {result.icon}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{result.title}</p>
                                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                              </div>
                              {selectedIndex === index && (
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          )
                        })}
                    </div>
                  )}

                  {/* Collections section */}
                  {results.filter((r) => r.type === "collection").length > 0 && (
                    <div className="mb-2">
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Collections
                      </p>
                      {results
                        .filter((r) => r.type === "collection")
                        .map((result) => {
                          const index = results.indexOf(result)
                          return (
                            <button
                              key={result.id}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                selectedIndex === index
                                  ? "bg-accent text-foreground"
                                  : "text-foreground hover:bg-accent"
                              }`}
                              onMouseEnter={() => setSelectedIndex(index)}
                              onClick={onClose}
                            >
                              {result.icon}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{result.title}</p>
                                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                              </div>
                              {selectedIndex === index && (
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          )
                        })}
                    </div>
                  )}

                  {/* Actions section */}
                  {results.filter((r) => r.type === "action").length > 0 && (
                    <div>
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </p>
                      {results
                        .filter((r) => r.type === "action")
                        .map((result) => {
                          const index = results.indexOf(result)
                          return (
                            <button
                              key={result.id}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                                selectedIndex === index
                                  ? "bg-accent text-foreground"
                                  : "text-foreground hover:bg-accent"
                              }`}
                              onMouseEnter={() => setSelectedIndex(index)}
                              onClick={() => {
                                if (result.id === "toggle-theme") {
                                  setTheme(theme === "dark" ? "light" : "dark")
                                }
                                onClose()
                              }}
                            >
                              {result.icon}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{result.title}</p>
                                <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                              </div>
                              {selectedIndex === index && (
                                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                            </button>
                          )
                        })}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">{"↑↓"}</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">{"↵"}</kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
