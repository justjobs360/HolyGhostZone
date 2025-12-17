"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

export default function EventsPage() {
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Upcoming Events',
      subtitle: 'Join us for meaningful gatherings, inspiring worship, and community-building events that strengthen our faith and deepen our connections.',
      backgroundImage: '/images/services.jpg'
    },
    reflection: {
      title: 'What If Community Changes Everything?',
      backgroundImage: '/images/carousel.jpg'
    },
    specialEventsTitle: 'Special Events',
    specialEventsSubtitle: 'Don\'t miss these upcoming special gatherings and community events',
    categoriesTitle: 'Event Categories',
    categoriesSubtitle: 'Explore different types of events and find what interests you most',
    categories: [
      {
        title: 'Worship Services',
        description: 'Regular Sunday services and special worship events',
        icon: 'Users'
      },
      {
        title: 'Community Events',
        description: 'Fellowship gatherings and social activities',
        icon: 'Calendar'
      },
      {
        title: 'Outreach Programs',
        description: 'Service projects and community involvement',
        icon: 'MapPin'
      },
      {
        title: 'Bible Studies',
        description: 'Weekly studies and spiritual growth opportunities',
        icon: 'Clock'
      }
    ],
    specialEvents: [
      {
        id: 1,
        title: 'Easter Celebration Service',
        date: 'March 31, 2024',
        time: '9:00 AM & 11:00 AM',
        location: 'Main Sanctuary',
        category: 'Worship',
        attendees: '350',
        image: '/images/fillerevents.jpg',
        description: 'Join us for a powerful Easter celebration as we rejoice in the resurrection of our Lord Jesus Christ. Special music, drama presentation, and communion service.'
      }
    ]
  })

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages/events', { cache: 'no-store' });
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

  const upcomingEvents = (pageData.specialEvents || []).map(event => ({
    ...event,
    attendees: typeof event.attendees === 'string' ? parseInt(event.attendees, 10) : event.attendees
  }))

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
              <h1 className="font-bold text-balance mb-8 leading-[0.9] tracking-tight text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {pageData.hero.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 text-pretty mb-12 leading-relaxed font-light">
                {pageData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Special Events */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.specialEventsTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.specialEventsSubtitle}
              </p>
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
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
              <h2 className="font-bold text-balance leading-[0.9] tracking-tight text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {pageData.reflection.title}
              </h2>
            </div>
          </div>
        </section>


        {/* Event Categories */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-bold text-balance mb-6 leading-[0.9] tracking-tight text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{pageData.categoriesTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed font-light">
                {pageData.categoriesSubtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageData.categories.map((category, index) => {
                const IconMap: { [key: string]: any } = {
                  Users,
                  Calendar,
                  MapPin,
                  Clock
                };
                const Icon = IconMap[category.icon] || Users;
                return (
                  <Card
                    key={index}
                    className="glass-effect border-white/20 premium-shadow hover:premium-shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-8 text-center">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-6" />
                      <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{category.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
