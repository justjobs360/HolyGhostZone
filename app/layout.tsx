import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
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
      <body className="font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
