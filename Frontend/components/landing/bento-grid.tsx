"use client"

import { motion } from "framer-motion"
import {
  Zap,
  FolderOpen,
  Search,
  Globe,
  Smartphone,
  Shield,
} from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Rich Visual Previews",
    description:
      "Automatically fetches OpenGraph images, favicons, and metadata to create beautiful, visual bookmark cards.",
    className: "md:col-span-2 md:row-span-1",
    accent: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "Powered by Supabase Realtime. Add a bookmark in one tab, watch it appear everywhere instantly.",
    className: "md:col-span-1 md:row-span-2",
    accent: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Search,
    title: "Command Palette",
    description:
      "Lightning-fast fuzzy search with Cmd+K. Navigate, search, and manage bookmarks entirely from the keyboard.",
    className: "md:col-span-1 md:row-span-1",
    accent: "from-violet-500/10 to-purple-500/10",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: FolderOpen,
    title: "Smart Collections",
    description:
      "Organize bookmarks into dynamic collections with drag-and-drop. Create nested folders with color-coded categories.",
    className: "md:col-span-1 md:row-span-1",
    accent: "from-emerald-500/10 to-teal-500/10",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description:
      "Looks stunning on every screen. A fully adaptive layout from mobile to ultrawide monitors.",
    className: "md:col-span-1 md:row-span-1",
    accent: "from-pink-500/10 to-rose-500/10",
    iconBg: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Row Level Security ensures your bookmarks are always private. Only you can see your data.",
    className: "md:col-span-1 md:row-span-1",
    accent: "from-sky-500/10 to-indigo-500/10",
    iconBg: "bg-sky-500/10 text-sky-500",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export function BentoGrid() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Everything you need, nothing you don't
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Built for speed, designed for clarity. Every feature is crafted to
            make bookmarking feel effortless.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid auto-rows-[minmax(180px,1fr)] gap-4 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20 ${feature.className}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
