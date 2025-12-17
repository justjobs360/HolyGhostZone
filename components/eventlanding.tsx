"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react"

interface EventsData {
  title: string;
  buttonText: string;
  buttonLink: string;
  cardsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function EventLanding() {
  const [currentEvent, setCurrentEvent] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [eventsData, setEventsData] = useState<EventsData>({
    title: "Upcoming Events",
    buttonText: "View All Events",
    buttonLink: "/events",
    cardsPerView: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  });
  const [eventsList, setEventsList] = useState<Array<{
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
  }> | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadPageData = async () => {
      try {
        // Fetch events data from the events page API
        const eventsResponse = await fetch('/api/pages/events');
        const homeResponse = await fetch('/api/pages/home');

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          if (Array.isArray(eventsData.specialEvents)) {
            // Convert events page format to EventLanding format
            const convertedEvents = eventsData.specialEvents.map((event: any) => ({
              title: event.title,
              date: event.date,
              time: event.time,
              location: event.location,
              description: event.description,
              image: event.image,
              buttonText: event.buttonText || 'Learn More',
              buttonLink: event.buttonLink || '#'
            }));
            setEventsList(convertedEvents);
          }
        }

        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          if (homeData.events) {
            setEventsData((prev) => ({
              ...prev,
              ...homeData.events,
              cardsPerView: {
                mobile: homeData.events?.cardsPerView?.mobile ?? prev.cardsPerView?.mobile ?? 1,
                tablet: homeData.events?.cardsPerView?.tablet ?? prev.cardsPerView?.tablet ?? 2,
                desktop: homeData.events?.cardsPerView?.desktop ?? prev.cardsPerView?.desktop ?? 3,
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, [])

  const fallbackEvents = [
    {
      title: "Sunday Worship",
      date: "Every Sunday",
      time: "11:00 AM",
      location: "Delta Hotels Milton Keynes",
      description: "Join us for our main worship services. We gather to worship together, learn from Scripture, pray for one another, and create space to hear from the Spirit.",
      image: "/images/events.jpeg",
      buttonText: "Join Us",
      buttonLink: "#"
    },
    {
      title: "Tuesday House Fellowship & Bible Study",
      date: "Every Tuesday",
      time: "7:30 PM",
      location: "Meeting ID: 858 914 272 | Passcode: 141507",
      description: "Mid-week house fellowship and Bible study sessions where we dive deeper into God's Word. Interactive study sessions with small group discussions.",
      image: "/images/events.jpeg",
      buttonText: "Join on Zoom",
      buttonLink: "https://zoom.us/j/858914272#success"
    },
    {
      title: "Thursday Shiloh Hour",
      date: "Every Thursday",
      time: "7:00 PM",
      location: "Meeting ID: 858 914 272 | Passcode: 141507",
      description: "Join us online for the Shiloh Hour - a powerful time of prayer, worship, and encountering God's presence.",
      image: "/images/events.jpeg",
      buttonText: "Join on Zoom",
      buttonLink: "https://zoom.us/j/858914272#success"
    },
    {
      title: "Community Outreach",
      date: "Monthly",
      time: "11:00 AM - 12:00 PM",
      location: "Local Community",
      description: "Community outreach programs and seasonal celebrations. Transformational Christ-centered activities that impact our local community.",
      image: "/images/temp.webp",
      buttonText: "Learn More",
      buttonLink: "#"
    }
  ]

  const getVisibleEvents = () => {
    const isMobile = windowWidth < 768
    const isTablet = windowWidth >= 768 && windowWidth < 1024
    const cards = isMobile
      ? (eventsData.cardsPerView?.mobile ?? 1)
      : isTablet
        ? (eventsData.cardsPerView?.tablet ?? 2)
        : (eventsData.cardsPerView?.desktop ?? 3)
    const list = eventsList && eventsList.length > 0 ? eventsList : fallbackEvents
    return list.slice(currentEvent, currentEvent + cards)
  }

  const getMaxIndex = () => {
    const isMobile = windowWidth < 768
    const isTablet = windowWidth >= 768 && windowWidth < 1024
    const cards = isMobile
      ? (eventsData.cardsPerView?.mobile ?? 1)
      : isTablet
        ? (eventsData.cardsPerView?.tablet ?? 2)
        : (eventsData.cardsPerView?.desktop ?? 3)
    const listLength = (eventsList && eventsList.length > 0 ? eventsList : fallbackEvents).length
    return Math.max(0, listLength - cards)
  }

  const nextEvent = () => {
    const maxIndex = getMaxIndex()
    setCurrentEvent((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevEvent = () => {
    const maxIndex = getMaxIndex()
    setCurrentEvent((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  return (
    <section className="relative pt-4 pb-8 bg-gray-900 overflow-hidden">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/carousel.jpg')`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gray-900/80" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
            {eventsData.title}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}>
            Join us for worship, fellowship, and spiritual growth.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            {/* Left Navigation Arrow */}
            <button
              onClick={prevEvent}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Event Cards Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getVisibleEvents().map((event, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 p-0 flex flex-col h-full">
                  <CardContent className="p-4 flex flex-col flex-grow">
                    {/* Event Image - Clickable for Zoom events */}
                    {/* Event Image - Clickable */}
                    <a
                      href={event.buttonLink}
                      target={event.buttonLink?.startsWith('http') ? '_blank' : undefined}
                      rel={event.buttonLink?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block aspect-[4/3] rounded-lg overflow-hidden mb-3 cursor-pointer"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </a>

                    {/* Event Details */}
                    <div className="text-white flex flex-col flex-grow">
                      <h3 className="text-base md:text-lg font-bold mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-gray-300 text-xs">{event.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-gray-300 text-xs">{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                          <span className="text-gray-300 text-xs line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-3 leading-relaxed text-xs line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex justify-center mt-auto">
                        <a
                          href={event.buttonLink}
                          target={event.buttonLink?.startsWith('http') ? '_blank' : undefined}
                          rel={event.buttonLink?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="w-full sm:w-auto"
                        >
                          <button className="w-full sm:w-auto border-2 border-primary bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide transition-all duration-300">
                            {event.buttonText}
                          </button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={nextEvent}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Event Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: getMaxIndex() + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEvent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentEvent
                  ? 'bg-primary scale-125'
                  : 'bg-white/30 hover:bg-white/50'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
