"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TeachingCard } from "@/components/teaching-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Play, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function TeachingsPage() {
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Teachings & Sermons',
      subtitle: 'Dive deeper into God\'s Word with our collection of inspiring messages, practical teachings, and transformative biblical insights.',
      backgroundImage: '/pastor-preaching-faith-sermon.jpg'
    },
    recentTitle: 'Recent Messages',
    recentSubtitle: 'Catch up on our latest Sunday messages and special teachings',
    reflection: {
      title: 'What If Truth Transforms You?',
      backgroundImage: '/purpose-calling-ministry-teaching.jpg'
    },
    seriesTitle: 'Teaching Series',
    seriesSubtitle: 'Explore our comprehensive teaching series on various biblical topics',
    resourcesTitle: 'Additional Resources',
    resourcesSubtitle: 'Tools and materials to support your spiritual growth and study',
    recentTeachings: [
      {
        id: 1,
        title: 'Walking in Faith',
        speaker: 'Pastor John Smith',
        date: 'March 10, 2024',
        duration: '45 min',
        series: 'Foundations of Faith',
        thumbnail: '/pastor-preaching-faith-sermon.jpg',
        description: 'Discover what it means to live by faith and trust God\'s plan for your life, even in uncertain times.'
      }
    ],
    teachingSeries: [
      {
        title: 'Foundations of Faith',
        description: 'Essential truths for every believer\'s spiritual journey',
        lessons: '8',
        image: '/pastor-preaching-faith-sermon.jpg'
      }
    ],
    resources: [
      {
        icon: 'BookOpen',
        title: 'Study Guides',
        description: 'Downloadable guides to accompany our teaching series'
      },
      {
        icon: 'Download',
        title: 'Audio Downloads',
        description: 'Take our messages with you wherever you go'
      },
      {
        icon: 'Play',
        title: 'Video Library',
        description: 'Complete archive of all our recorded teachings'
      }
    ]
  })

  const [pageDataReady, setPageDataReady] = useState(false)

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages/teachings', { cache: 'no-store' });
      if (!response.ok) {
        console.error('Failed to load page data');
      } else {
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setPageData(prevData => ({ ...prevData, ...data }));
        }
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setPageDataReady(true);
    }
  };

  const recentTeachings = pageData.recentTeachings || []
  const teachingSeries = pageData.teachingSeries || []

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
            <section className="py-12"><div className="max-w-2xl mx-auto h-14 bg-gray-100 rounded animate-pulse" /></section>
            <section className="py-20 lg:py-24">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </section>
            <section className="py-24 lg:py-48 bg-gray-800" />
            <section className="py-20 lg:py-24 bg-muted/30">
              <div className="container mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
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

        {/* Search Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search teachings by topic, speaker, or series..."
                  className="pl-12 h-14 text-lg glass-effect border-white/20 premium-shadow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Teachings */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.recentTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.recentSubtitle}
              </p>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {recentTeachings.map((teaching) => (
                <TeachingCard key={teaching.id} {...teaching} />
              ))}
            </div>
          </div>
        </section>

        {/* Philosophical Reflection */}
        <section className="relative py-24 lg:py-48 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${pageData.reflection.backgroundImage}')` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-bold text-balance leading-[0.9] tracking-tight text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {pageData.reflection.title}
              </h2>
            </div>
          </div>
        </section>

        {/* Teaching Series */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.seriesTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.seriesSubtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachingSeries.map((series, index) => (
                <Card
                  key={index}
                  className="glass-effect border-white/20 premium-shadow hover:premium-shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={series.image || "/placeholder.svg"}
                        alt={series.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white/90 text-sm font-medium mb-1">{series.lessons} Lessons</div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{series.title}</h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{series.description}</p>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Series
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.resourcesTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.resourcesSubtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageData.resources.map((resource, index) => {
                const IconMap: { [key: string]: any } = {
                  BookOpen,
                  Download,
                  Play
                };
                const Icon = IconMap[resource.icon] || BookOpen;
                return (
                  <Card
                    key={index}
                    className="glass-effect border-white/20 premium-shadow hover:premium-shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8 text-center">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-6" />
                      <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{resource.description}</p>
                      <Button variant="outline">Access Resource</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
