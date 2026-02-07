"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users } from "lucide-react"

interface EventCardProps {
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
  attendees?: number
  category?: string
  buttonText?: string
  buttonLink?: string
}

export function EventCard({
  title,
  description,
  date,
  time,
  location,
  image,
  attendees,
  category = "Event",
  buttonText = "Learn More",
  buttonLink = "#",
}: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Show "Read More" if description is longer than approximately 3 lines (roughly 150 characters)
  const showReadMore = description.length > 150

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/50 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        {/* Event Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            <span>{date}</span>
            <Clock className="w-4 h-4 ml-4 mr-2 text-secondary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            <span>{location}</span>
          </div>
          {attendees && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>{attendees} attending</span>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold mb-3 text-balance group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className="mb-4 flex-grow">
          <p 
            className={`text-muted-foreground text-pretty whitespace-pre-line transition-all duration-300 ${
              isExpanded ? '' : 'line-clamp-3'
            }`}
          >
            {description}
          </p>
          {showReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 text-sm font-medium mt-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all duration-300 group-hover:shadow-lg mt-auto"
          size="lg"
        >
          <a href={buttonLink} target={buttonLink.startsWith('http') ? '_blank' : undefined} rel={buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {buttonText}
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
