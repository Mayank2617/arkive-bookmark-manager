"use client"

import { motion } from "framer-motion"
import { ArrowRight, Command } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: false,
        },
      })

      if (error) {
        console.error('Error signing in:', error)
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setIsLoading(false)
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="glass glow-sm flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Now in public beta</span>
          <span className="font-medium text-foreground">v2.0</span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl text-balance text-center text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
      >
        Your web, <span className="gradient-text">beautifully</span>{" "}
        archived
      </motion.h1>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-6 max-w-2xl text-balance text-center text-lg leading-relaxed text-muted-foreground md:text-xl"
      >
        A premium, real-time bookmark manager for the modern power user.
        Rich previews, smart collections, and instant search &mdash; all synced across every device.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="group flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLoading ? 'Redirecting...' : 'Continue with Google'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button
          className="glass flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
        >
          <Command className="h-4 w-4" />
          <span>Press</span>
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            {"Cmd + K"}
          </kbd>
          <span>to explore</span>
        </button>
      </motion.div>

      {/* App Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-20 w-full max-w-5xl"
      >
        <div className="glass glow rounded-2xl p-1.5">
          <div className="overflow-hidden rounded-xl bg-card">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-chart-2/60" />
              </div>
              <div className="mx-auto flex items-center gap-2 rounded-lg bg-muted px-4 py-1.5 text-xs text-muted-foreground">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                app.arkive.io/dashboard
              </div>
            </div>
            {/* Mock dashboard content */}
            <div className="flex h-[340px] md:h-[420px]">
              {/* Sidebar mock */}
              <div className="hidden w-56 shrink-0 border-r border-border bg-muted/30 p-4 md:block">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary/20" />
                  <div className="h-3 w-24 rounded-md bg-muted-foreground/20" />
                </div>
                <div className="space-y-1.5">
                  {["All Bookmarks", "Recent", "Starred"].map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${item === "All Bookmarks" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${item === "All Bookmarks" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      {item}
                    </div>
                  ))}
                  <div className="my-3 border-t border-border" />
                  <p className="px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">Collections</p>
                  {["Design Inspiration", "Dev Resources", "AI & ML"].map((c, i) => (
                    <div key={c} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: ["hsl(280,65%,60%)", "hsl(160,60%,45%)", "hsl(220,90%,56%)"][i] }} />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              {/* Main content mock */}
              <div className="flex-1 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-8 flex-1 rounded-lg bg-muted/50" />
                  <div className="h-8 w-8 rounded-lg bg-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg border border-border bg-muted/20">
                      <div className="h-20 bg-muted/40 md:h-24" style={{
                        background: `linear-gradient(135deg, hsl(${200 + i * 25}, 40%, ${20 + i * 5}%), hsl(${220 + i * 20}, 50%, ${15 + i * 3}%))`
                      }} />
                      <div className="p-2.5">
                        <div className="mb-1.5 h-2.5 w-3/4 rounded bg-foreground/10" />
                        <div className="h-2 w-full rounded bg-muted-foreground/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reflection glow */}
        <div className="pointer-events-none absolute -bottom-20 left-1/2 h-40 w-3/4 -translate-x-1/2 bg-primary/5 blur-[80px]" />
      </motion.div>
    </section>
  )
}
