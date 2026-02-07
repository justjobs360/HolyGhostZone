"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, BookOpen, Globe } from "lucide-react"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const [activeValueTab, setActiveValueTab] = useState(0)
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([])
  const [pageData, setPageData] = useState({
    hero: {
      title: 'About Holy Ghost Zone MK',
      subtitle: 'A vibrant community where faith meets modern life, creating space for authentic worship, meaningful relationships, and spiritual growth in the heart of our city.',
      backgroundImage: '/images/about.jpg'
    },
    mission: {
      title: 'Our Mission',
      description: 'To create an authentic community where people can encounter God, grow in faith, and discover their purpose. We believe in the transformative power of the Gospel and its ability to bring hope, healing, and restoration to every life.',
      image: '/church-worship.png',
      stat1: '500+',
      stat1Label: 'Community Members',
      stat2: '15+',
      stat2Label: 'Years Serving'
    },
    reflection: {
      title: 'What If You Belong Here?',
      backgroundImage: '/images/shakespear.jpg'
    },
    values: {
      title: 'Our Core Values',
      subtitle: 'These values guide everything we do as a community of faith',
      image: '/images/aboutus2.jpg',
      tabs: [
        'Authentic Love',
        'Genuine Community',
        'Biblical Truth',
        'Global Impact'
      ]
    },
    reflection2: {
      backgroundImage: '/images/aboutus3.jpg'
    },
    leadership: {
      title: 'Our Leadership Team',
      subtitle: 'Passionate leaders committed to serving our community with integrity and love',
      teams: [
        {
          title: 'Senior Leadership',
          description: 'Our senior pastors and executive team who provide spiritual guidance and overall church direction.'
        },
        {
          title: 'Ministry Directors',
          description: 'Leaders who oversee specific ministries including worship, youth, children, and community outreach.'
        },
        {
          title: 'Elders & Deacons',
          description: 'Spiritual leaders who provide pastoral care, counseling, and support to our church family.'
        },
        {
          title: 'Volunteer Coordinators',
          description: 'Dedicated volunteers who organize events, manage programs, and ensure smooth church operations.'
        },
        {
          title: 'Administrative Team',
          description: 'Support staff who handle church administration, communications, and day-to-day operations.'
        }
      ]
    }
  })

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages/about');
      if (!response.ok) {
        console.error('Failed to load page data');
        return;
      }
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setPageData(prevData => ({
          ...prevData,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    }
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${pageData.hero.backgroundImage}')`
            }}
          />
          
          {/* Very Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/80 to-black/90" />
          
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-8 text-white">
                {pageData.hero.title}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 text-balance leading-relaxed">
                {pageData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-balance">{pageData.mission.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {pageData.mission.description}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{pageData.mission.stat1}</div>
                    <div className="text-sm text-muted-foreground">{pageData.mission.stat1Label}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{pageData.mission.stat2}</div>
                    <div className="text-sm text-muted-foreground">{pageData.mission.stat2Label}</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src={pageData.mission.image}
                  alt="Church community worship"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

         {/* Philosophical Reflection */}
         <section className="relative py-24 lg:py-48 overflow-hidden">
           {/* Background Image */}
           <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{
               backgroundImage: `url('${pageData.reflection.backgroundImage}')`
             }}
           />
           
           {/* Dark Overlay */}
           <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />

           {/* Content */}
           <div className="relative z-10 container mx-auto px-6 lg:px-8">
             <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                 {pageData.reflection.title}
               </h2>
             </div>
           </div>
         </section>

         {/* Values */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Right Column - Image */}
              <div className="aspect-[4/3]">
                <img 
                  src={pageData.values.image}
                  alt="Church community values" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Left Column - Tabs */}
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                  {pageData.values.title}
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {pageData.values.subtitle}
                </p>

                {/* Tabs */}
                <div className="space-y-2">
                  {pageData.values.tabs.map((tab, tabIndex) => (
                    <button
                      key={tabIndex}
                      onClick={() => setActiveValueTab(tabIndex)}
                      className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-300 ${
                        activeValueTab === tabIndex
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-lg">{tab}</div>
                      {activeValueTab === tabIndex && (
                        <div className="w-full h-0.5 bg-primary mt-2"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

         {/* Philosophical Reflection */}
         <section className="relative py-24 lg:py-60 overflow-hidden">
           {/* Background Image */}
           <div 
             className="absolute inset-0 bg-cover bg-center bg-no-repeat"
             style={{
               backgroundImage: `url('${pageData.reflection2.backgroundImage}')`
             }}
           />
           
           {/* Dark Overlay */}
           <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />

          
         </section>

        {/* Leadership */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">{pageData.leadership.title}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                {pageData.leadership.subtitle}
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-0">
                {pageData.leadership.teams.map((team, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full text-left py-6 px-0 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-lg font-medium text-gray-900">{team.title}</span>
                      </div>
                      <div className={`text-gray-400 transition-transform duration-200 ${
                        openDropdowns.includes(index) ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {openDropdowns.includes(index) && (
                      <div className="pb-6 pl-6 animate-fadeIn">
                        <p className="text-gray-600 leading-relaxed">{team.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

       
      </main>
      <Footer />
    </div>
  )
}
