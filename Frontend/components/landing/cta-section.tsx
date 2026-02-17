"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export function CtaSection() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    alert('Button clicked! Check console for details.')
    console.log('🔵 handleSignIn called')
    console.log('🔵 Environment check:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    })

    setIsLoading(true)

    try {
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
        // Don't set loading to false - user should be redirected
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      alert(`Unexpected error: ${err}`)
      setIsLoading(false)
    }
  }

  return (
    <section className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Ready to organize your web?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-lg text-muted-foreground">
          Join thousands of power users who have already upgraded their
          bookmarking experience. It's free to get started.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="group flex items-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirecting...' : 'Get started for free'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Learn more
          </a>
        </div>
      </motion.div>
    </section>
  )
}
