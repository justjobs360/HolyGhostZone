"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Users, Heart, Calendar } from "lucide-react"

export default function GalleryPage() {
  const [pageData, setPageData] = useState<{
    hero: { title: string; subtitle: string; backgroundImage: string }
    recentTitle: string
    recentSubtitle: string
    reflection: { title: string; backgroundImage: string }
    galleryImages: { id: number; src: string; alt: string; title: string; category: string }[]
  } | null>(null)
  const [pageDataReady, setPageDataReady] = useState(false)

  useEffect(() => {
    loadPageData()
  }, [])

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages/gallery', { cache: 'no-store' })
      if (!response.ok) {
        console.error('Failed to load page data')
        setPageDataReady(true)
        return
      }
      const data = await response.json()
      const defaultData = {
        hero: {
          title: 'Photo Gallery',
          subtitle: 'Capturing moments of worship, fellowship, and community life that showcase the heart and spirit of Holy Ghost Zone MK.',
          backgroundImage: '/prayer-worship-hands-raised.jpg'
        },
        recentTitle: 'Recent Highlights',
        recentSubtitle: 'A collection of our most recent and memorable moments',
        reflection: { title: 'What If Every Moment Matters?', backgroundImage: '/images/temp.webp' },
        galleryImages: [{ id: 1, src: '/images/fillerevents.jpg', alt: 'Sunday worship service with congregation in praise', title: 'Sunday Worship Service', category: 'Worship' }]
      }
      setPageData(Object.keys(data).length > 0 ? { ...defaultData, ...data } : defaultData)
    } catch (error) {
      console.error('Error loading page data:', error)
    } finally {
      setPageDataReady(true)
    }
  }

  const galleryImages = pageData?.galleryImages ?? []

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {!pageDataReady ? (
          /* Skeleton — no text/images until fetch completes to avoid flash of old content */
          <>
            <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
              <div className="absolute inset-0 bg-gray-900" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/80 to-black/90" />
              <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                  <div className="h-12 w-3/4 mx-auto bg-white/20 rounded animate-pulse" />
                  <div className="h-6 w-full max-w-2xl mx-auto bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </section>
            <section className="py-20 lg:py-24">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                  <div className="h-10 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-2/3 mx-auto bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </section>
            <section className="py-24 lg:py-48 bg-gray-800" />
          </>
        ) : pageData ? (
          <>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${pageData.hero.backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/80 to-black/90" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-bold text-balance mb-8 leading-[0.9] tracking-tight text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {pageData.hero.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 text-pretty mb-12 leading-relaxed font-light">
                {pageData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Main Gallery */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.recentTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.recentSubtitle}
              </p>
            </div>
            <GalleryGrid images={galleryImages} />
          </div>
        </section>

        {/* Philosophical Reflection */}
        <section className="relative py-24 lg:py-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${pageData.reflection.backgroundImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />
          <div className="relative z-10 container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-bold text-balance leading-[0.9] tracking-tight text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {pageData.reflection.title}
              </h2>
            </div>
          </div>
        </section>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
