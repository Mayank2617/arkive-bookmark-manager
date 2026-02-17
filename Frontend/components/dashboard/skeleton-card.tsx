"use client"

import { motion } from "framer-motion"

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <motion.div
        className="h-36 bg-muted sm:h-40"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <motion.div
            className="h-5 w-5 rounded bg-muted"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div
            className="h-3 w-20 rounded bg-muted"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          />
        </div>
        <motion.div
          className="mb-2 h-4 w-3/4 rounded bg-muted"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="h-3 w-full rounded bg-muted"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
        />
        <motion.div
          className="mt-1 h-3 w-2/3 rounded bg-muted"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>
    </div>
  )
}
