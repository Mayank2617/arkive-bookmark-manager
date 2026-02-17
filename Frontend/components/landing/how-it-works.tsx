"use client"

import { motion } from "framer-motion"
import { Link2, Sparkles, FolderSync } from "lucide-react"

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Paste any URL",
    description:
      "Drop in a link and Arkive instantly scrapes rich metadata, images, and favicons to build a visual preview card.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Auto-enrich",
    description:
      "OpenGraph data, dominant colors, and descriptions are extracted automatically. No manual tagging required.",
  },
  {
    icon: FolderSync,
    step: "03",
    title: "Organize & sync",
    description:
      "Drag bookmarks into smart collections. Everything syncs in real-time across all your devices and tabs.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Three steps to a better web
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative"
            >
              <div className="glass rounded-2xl p-6 transition-all hover:glow-sm">
                <span className="mb-4 block font-mono text-xs font-bold tracking-widest text-primary">
                  {step.step}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-4 top-1/2 hidden h-px w-8 bg-border md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
