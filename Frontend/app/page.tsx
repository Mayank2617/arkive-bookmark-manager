"use client"

import { LandingNavbar } from "@/components/landing/landing-navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { BentoGrid } from "@/components/landing/bento-grid"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PreviewSection } from "@/components/landing/preview-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="noise-overlay min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <BentoGrid />
      <HowItWorks />
      <PreviewSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
