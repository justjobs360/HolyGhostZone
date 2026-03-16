"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

const ZOOM_SERVICE_URL =
  "https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1"

export default function ServicePage() {
  useEffect(() => {
    // Automatically redirect visitors to the live service on Zoom
    if (typeof window !== "undefined") {
      window.location.href = ZOOM_SERVICE_URL
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Joining our online service
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            We&apos;re redirecting you to our live Zoom service now.
            If nothing happens after a few seconds, please use the button below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button asChild size="lg">
              <a
                href={ZOOM_SERVICE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Service on Zoom
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

