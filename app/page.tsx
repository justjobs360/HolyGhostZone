import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"

// Load below-the-fold sections after initial paint to reduce TBT and improve LCP
const AboutPreview = dynamic(() => import("@/components/about-preview").then((m) => ({ default: m.AboutPreview })), { ssr: true })
const EventLanding = dynamic(() => import("@/components/eventlanding").then((m) => ({ default: m.EventLanding })), { ssr: true })
const Location = dynamic(() => import("@/components/location").then((m) => ({ default: m.Location })), { ssr: true })

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutPreview />
        <EventLanding />
        <Location />
      </main>
      <Footer />
    </div>
  )
}
