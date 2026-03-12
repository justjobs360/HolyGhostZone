"use client"

import { Button } from "@/components/ui/button"
import { Church, BookOpen, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import NewToTown from "@/components/newtotown"
import FollowJesus from "@/components/followjesus"

interface WhoWeAreData {
  description: string;
  locationText: string;
  serviceTimes: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
}

interface WhatWeBelieveData {
  title: string;
  description: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

interface OurServicesData {
  description: string;
  serviceTabs: string[];
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

export function AboutPreview() {
  const [activeServiceTab, setActiveServiceTab] = useState(0)
  const [whoWeAreData, setWhoWeAreData] = useState<WhoWeAreData>({
    description: "We are a community based church with a keen interest in impacting our community through transformational Christ-centered activities and programs.",
    locationText: "Delta Hotels Milton Keynes, Timbold Drive, Kents Hill, Milton Keynes, MK7 6HL, United Kingdom",
    serviceTimes: "Sunday 11:00 AM, Tuesday 7:30 PM (Zoom), Thursday 7:00 PM (Zoom)",
    buttonText: "Learn More",
    buttonLink: "/events",
    images: ["/images/rccg.JPG", "/images/2hgz.JPG", "/images/3hgz.png"]
  });
  const [whatWeBelieveData, setWhatWeBelieveData] = useState<WhatWeBelieveData>({
    title: "What We Believe",
    description: "Our faith is grounded in the Bible and centered on Jesus Christ. We believe in the power of God's love to transform lives and communities.",
    backgroundImage: "/images/whoweare.jpg",
    buttonText: "Learn More",
    buttonLink: "/about"
  });
  const [ourServicesData, setOurServicesData] = useState<OurServicesData>({
    description: "Join us for worship, fellowship, and spiritual growth. We offer multiple service times to accommodate different schedules.",
    serviceTabs: [
      "Sunday Worship: 11:00 AM",
      "Tuesday House Fellowship & Bible Study: 7:30 PM (Zoom)",
      "Thursday Shiloh Hour: 7:00 PM (Zoom)",
      "Special events and community programs"
    ],
    backgroundImage: "/images/services.jpg",
    buttonText: "View All Events",
    buttonLink: "/events"
  });

  const [homeDataReady, setHomeDataReady] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await fetch('/api/pages/home', { cache: 'no-store' });
        if (!response.ok) {
          console.error('Failed to load page data');
        } else {
          const data = await response.json();
          if (data.whoWeAre) setWhoWeAreData(data.whoWeAre);
          if (data.whatWeBelieve) setWhatWeBelieveData(data.whatWeBelieve);
          if (data.ourServices) setOurServicesData(data.ourServices);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setHomeDataReady(true);
      }
    };
    loadPageData();
  }, []);

  const sections = [
    {
      title: "Who We Are",
      icon: Church,
      backgroundImage: "/church-worship.png",
      content: {
        description: whoWeAreData.description,
        details: [
          "A welcoming community of believers",
          "Committed to serving our local area",
          "Focused on transformational change through Christ",
          "Building lasting relationships with our neighbors"
        ]
      }
    },
    {
      title: "What We Believe",
      icon: BookOpen,
      backgroundImage: whatWeBelieveData.backgroundImage,
      content: {
        description: whatWeBelieveData.description,
        details: [
          "The Bible as the inspired Word of God",
          "Jesus Christ as Lord and Savior",
          "The power of prayer and community",
          "Serving others as an expression of faith"
        ]
      }
    },
    {
      title: "Our Services",
      icon: Calendar,
      backgroundImage: ourServicesData.backgroundImage,
      content: {
        description: ourServicesData.description,
        details: ourServicesData.serviceTabs
      }
    },
  ]

  if (!homeDataReady) {
    /* Skeleton — no text/images until fetch completes to avoid flash of old content */
    return (
      <div id="about">
        <section className="py-12 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 aspect-[2/1] bg-gray-200 rounded-lg animate-pulse" />
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="h-96 bg-gray-200 animate-pulse" />
        </section>
      </div>
    )
  }

  return (
    <div id="about">
      {sections.map((section, index) => {
        // Special layout for "Who We Are" section
        if (section.title === "Who We Are") {
          return (
            <section key={index} className="py-12 md:py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                  {/* Left Column - Image Grid — only show after fetch to avoid flash of old images */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="col-span-2 aspect-[2/1] rounded-lg overflow-hidden relative">
                      {homeDataReady ? (
                        <Image
                          src={whoWeAreData.images[0] || "/images/rccg.JPG"}
                          alt="RCCG Church"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      )}
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      {homeDataReady ? (
                        <Image
                          src={whoWeAreData.images[1] || "/images/2hgz.JPG"}
                          alt="Community service"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      )}
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      {homeDataReady ? (
                        <Image
                          src={whoWeAreData.images[2] || "/images/3hgz.png"}
                          alt="Pastor preaching"
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Right Column - Content */}
                  <div>
                     <h2 className="font-bold text-gray-900 mb-6 md:mb-8" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
                       {section.title}
                     </h2>
                    
                    <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}>
                      {section.content.description}
                    </p>
                    
                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      <div className="text-sm md:text-base text-gray-700">
                        <strong>Times:</strong> {whoWeAreData.serviceTimes}
                      </div>
                      <div className="text-sm md:text-base text-gray-700">
                        <strong>Location:</strong> {whoWeAreData.locationText}
                      </div>
                    </div>

                    <Link href={whoWeAreData.buttonLink}>
                      <button className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300">
                        {whoWeAreData.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )
        }
         // Special layout for "Our Services" section
         if (section.title === "Our Services") {
           return (
             <section key={index} className="py-12 md:py-20 bg-white">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                   {/* Left Column - Tabs */}
                   <div>
                     <h2 className="font-bold text-gray-900 mb-6 md:mb-8" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
                       {section.title}
                     </h2>
                     
                     <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}>
                       {section.content.description}
                     </p>

                     {/* Tabs */}
                     <div className="space-y-2 mb-6 md:mb-8">
                       {ourServicesData.serviceTabs.map((tab, tabIndex) => (
                         <button
                           key={tabIndex}
                           onClick={() => setActiveServiceTab(tabIndex)}
                           className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-300 ${
                             activeServiceTab === tabIndex
                               ? 'bg-primary/10 text-primary border-l-4 border-primary'
                               : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                           }`}
                         >
                           <div className="font-medium text-lg">{tab}</div>
                           {activeServiceTab === tabIndex && (
                             <div className="w-full h-0.5 bg-primary mt-2"></div>
                           )}
                         </button>
                       ))}
                     </div>

                     <Link href={ourServicesData.buttonLink}>
                       <button className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300">
                         {ourServicesData.buttonText}
                       </button>
                     </Link>
                   </div>

                   {/* Right Column - Image — only show after fetch to avoid flash of old image */}
                   <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                     {homeDataReady ? (
                       <Image
                         src={ourServicesData.backgroundImage}
                         alt="Church service"
                         fill
                         className="object-cover"
                         sizes="(max-width: 1024px) 100vw, 50vw"
                       />
                     ) : (
                       <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                     )}
                   </div>
                 </div>
               </div>
             </section>
           )
         }

        // Special layout for "What We Believe" section
        if (section.title === "What We Believe") {
          // Ensure the button always goes to the Our Beliefs section on the About page
          const whatWeBelieveHref =
            whatWeBelieveData.buttonLink && whatWeBelieveData.buttonLink.startsWith("/about")
              ? "/about#our-beliefs"
              : (whatWeBelieveData.buttonLink || "/about#our-beliefs");

          return (
            <div key={index}>
               <section className="relative min-h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
                 {/* Background Image — only show after fetch to avoid flash of old image */}
                 <div className="absolute inset-0 relative">
                   {homeDataReady ? (
                     <Image src={section.backgroundImage} alt="" fill className="object-cover object-center" sizes="100vw" />
                   ) : (
                     <div className="absolute inset-0 bg-gray-800" />
                   )}
                 </div>
                 
                 {/* Dark Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/75" />

                 {/* Content */}
                 <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                   <div className="max-w-4xl mx-auto text-center">
                     <h2 className="font-bold text-white mb-6 md:mb-8" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
                       {section.title}
                     </h2>
                     
                    <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto mb-8 md:mb-12" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
                      {section.content.description}
                    </p>

                    <Link href={whatWeBelieveHref}>
                     <button className="w-full sm:w-auto border-2 border-white text-white px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-300">
                       {whatWeBelieveData.buttonText}
                     </button>
                   </Link>
                   </div>
                 </div>
               </section>
               <NewToTown />
               <FollowJesus />
             </div>
           )
         }

         // Default layout for other sections
         return (
           <section key={index} className="relative min-h-screen flex items-center justify-center overflow-hidden">
             {/* Background Image — only show after fetch to avoid flash of old image */}
             <div className="absolute inset-0 relative">
               {homeDataReady ? (
                 <Image src={section.backgroundImage} alt="" fill className="object-cover object-center" sizes="100vw" />
               ) : (
                 <div className="absolute inset-0 bg-gray-800" />
               )}
             </div>
             
             {/* Dark Overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80" />

             {/* Content */}
             <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="max-w-4xl mx-auto text-center">
                 <div className="flex justify-center mb-8">
                   <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                     <section.icon className="w-10 h-10 text-white" />
                   </div>
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                   {section.title}
                 </h2>
                 
                 <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                   {section.content.description}
                 </p>
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {section.content.details.map((detail, detailIndex) => (
                    <div key={`detail-${index}-${detailIndex}`} className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-white text-lg">{detail}</span>
                    </div>
                  ))}
                </div>
               </div>
             </div>
           </section>
         )
      })}
    </div>
  )
}
