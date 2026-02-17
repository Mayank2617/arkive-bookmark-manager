"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, ChevronsUpDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function UserButton() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    setOpen(false)
  }

  // Show loading state while user is being fetched
  if (!user) {
    return (
      <div className="flex w-full items-center gap-3 rounded-lg p-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="hidden min-w-0 flex-1 lg:block space-y-2">
          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
          <div className="h-2 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userEmail = user.email || ''
  const userAvatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent"
      >
        <img
          src={userAvatar}
          alt={userName}
          className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
        />
        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="truncate text-sm font-medium text-foreground">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <ChevronsUpDown className="hidden h-4 w-4 text-muted-foreground lg:block" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[200px] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl"
            >
              <div className="border-b border-border px-3 py-2.5">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
