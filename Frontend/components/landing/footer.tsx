"use client"

import { Bookmark } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Bookmark className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">Arkive</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </Link>
          <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </nav>

        <p className="text-sm text-muted-foreground">
          Built with Next.js & Supabase
        </p>
      </div>
    </footer>
  )
}
