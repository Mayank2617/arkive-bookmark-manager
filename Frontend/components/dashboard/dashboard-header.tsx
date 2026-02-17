"use client"

import { Search, Plus, Menu, LayoutGrid, List, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

interface DashboardHeaderProps {
  title: string
  count: number
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onOpenCommandPalette: () => void
  onOpenAddModal: () => void
  onToggleSidebar: () => void
  searchQuery: string
  onSearch: (query: string) => void
}

export function DashboardHeader({
  title,
  count,
  viewMode,
  onViewModeChange,
  onOpenCommandPalette,
  onOpenAddModal,
  onToggleSidebar,
  searchQuery,
  onSearch,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="mr-auto min-w-0">
        <h1 className="truncate text-lg font-semibold text-foreground">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "bookmark" : "bookmarks"}
        </p>
      </div>

      {/* Search input */}
      <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 md:flex flex-1 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={searchQuery || ""}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {searchQuery && (
          <button
            onClick={() => onSearch("")}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* View mode toggle */}
      <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5 sm:flex">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "grid"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === "list"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
            }`}
          aria-label="List view"
        >
          <List className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>

      {/* Add button */}
      <button
        onClick={onOpenAddModal}
        className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Bookmark</span>
      </button>
    </header>
  )
}
