"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

const FALLBACK_ZOOM_URL =
  "https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1"

type ServiceContent = {
  title: string
  description: string
  zoomUrl: string
  autoRedirectSeconds: number
}

export default function ServicePage() {
  const [content, setContent] = useState<ServiceContent>({
    title: "Joining our online service",
    description:
      "We're redirecting you to our live Zoom service now. If nothing happens after a few seconds, please use the button below.",
    zoomUrl: FALLBACK_ZOOM_URL,
    autoRedirectSeconds: 2,
  })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const load = async () => {
      try {
        const res = await fetch("/api/pages/service", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()

        setContent((prev) => {
          const next: ServiceContent = {
            ...prev,
            ...data,
            zoomUrl: data.zoomUrl || prev.zoomUrl || FALLBACK_ZOOM_URL,
            autoRedirectSeconds:
              typeof data.autoRedirectSeconds === "number"
                ? data.autoRedirectSeconds
                : prev.autoRedirectSeconds,
          }

          const url = next.zoomUrl || FALLBACK_ZOOM_URL
          const delayMs =
            typeof next.autoRedirectSeconds === "number" && next.autoRedirectSeconds >= 0
              ? next.autoRedirectSeconds * 1000
              : 0

          if (typeof window !== "undefined" && url) {
            timer = setTimeout(() => {
              window.location.href = url
            }, delayMs)
          }

          return next
        })
      } catch (e) {
        console.error("Failed to load service content", e)
        if (typeof window !== "undefined") {
          window.location.href = FALLBACK_ZOOM_URL
        }
      }
    }

    load()

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  const zoomUrl = content.zoomUrl || FALLBACK_ZOOM_URL

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{content.title}</h1>
          <p className="text-base sm:text-lg text-muted-foreground">{content.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button asChild size="lg">
              <a href={zoomUrl} target="_blank" rel="noopener noreferrer">
                Join Service on Zoom
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    
    </div>
  )
}

