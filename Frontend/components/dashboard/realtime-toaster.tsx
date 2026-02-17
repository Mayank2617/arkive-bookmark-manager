"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wifi, X } from "lucide-react"

interface Toast {
  id: string
  message: string
}

export function RealtimeToaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Simulate a realtime notification after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setToasts([
        {
          id: "1",
          message: "Bookmark synced from another device",
        },
      ])
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (toasts.length === 0) return
    const timer = setTimeout(() => {
      setToasts([])
    }, 3000)
    return () => clearTimeout(timer)
  }, [toasts])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass glow-sm flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Wifi className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-sm text-foreground">{toast.message}</p>
            <button
              onClick={() => setToasts([])}
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
