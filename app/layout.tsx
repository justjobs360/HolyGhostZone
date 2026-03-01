import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MobileDeferredAuth } from "@/components/mobile-deferred-auth"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Holy Ghost Zone MK - Modern Church Community",
  description:
    "Join our vibrant church community for worship, teachings, and fellowship. Experience the power of faith in a modern, welcoming environment.",
  generator: "v0.app",
  keywords: ["church", "worship", "community", "faith", "teachings", "events"],
  authors: [{ name: "Holy Ghost Zone MK" }],
  openGraph: {
    title: "Holy Ghost Zone MK - Modern Church Community",
    description: "Join our vibrant church community for worship, teachings, and fellowship.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload hero: mobile gets smaller image, desktop unchanged (media so only one request) */}
        <link
          rel="preload"
          as="image"
          href="/api/hero-image?url=%2Fimages%2Fbgimg.jpeg&w=828&q=65"
          media="(max-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/api/hero-image?url=%2Fimages%2Fbgimg.jpeg"
          media="(min-width: 769px)"
        />
        {/* Firebase only: preconnect for auth iframe (Maps deferred until map in view, so no preconnect) */}
        <link rel="preconnect" href="https://holyghostzonerccg.firebaseapp.com" crossOrigin="" />
      </head>
      <body className="font-sans antialiased">
        <MobileDeferredAuth>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </MobileDeferredAuth>
        <Analytics />
      </body>
    </html>
  )
}
