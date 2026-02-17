"use client"

import { motion } from "framer-motion"
import { Star, Clock, FolderOpen, Bookmark, Zap, Users } from "lucide-react"

const stats = [
  { label: "Active Users", value: "12,000+", icon: Users },
  { label: "Bookmarks Saved", value: "2.4M+", icon: Bookmark },
  { label: "Avg. Sync Time", value: "<50ms", icon: Zap },
]

export function PreviewSection() {
  return (
    <section id="preview" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Trusted by power users
          </p>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Built for performance
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Arkive is designed to be the fastest, most beautiful bookmark manager
            you've ever used. Here's what that looks like in numbers.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-20 grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass flex items-center gap-4 rounded-2xl p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature detail cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Starred & Quick Access
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Star your most important bookmarks for instant access. Your
                starred items stay pinned at the top of your library.
              </p>
            </div>
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex flex-col gap-2">
                {["Linear Issue Tracker", "Figma Design System", "Vercel Docs"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg bg-background p-3"
                  >
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm text-foreground">{item}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      Starred
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <FolderOpen className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Dynamic Collections
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Create custom collections and organize with drag-and-drop. Nest
                folders to build your perfect knowledge structure.
              </p>
            </div>
            <div className="border-t border-border bg-muted/30 p-4">
              <div className="flex flex-col gap-2">
                {[
                  { name: "Design Inspiration", color: "hsl(280, 65%, 60%)", count: 12 },
                  { name: "Dev Resources", color: "hsl(160, 60%, 45%)", count: 24 },
                  { name: "AI & Machine Learning", color: "hsl(220, 90%, 56%)", count: 8 },
                ].map((folder) => (
                  <div
                    key={folder.name}
                    className="flex items-center gap-3 rounded-lg bg-background p-3"
                  >
                    <div
                      className="h-3 w-3 rounded"
                      style={{ background: folder.color }}
                    />
                    <span className="text-sm text-foreground">{folder.name}</span>
                    <span className="ml-auto rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {folder.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
