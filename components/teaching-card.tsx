"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Calendar, User, Clock, X } from "lucide-react"

interface TeachingCardProps {
  title: string
  description: string
  speaker: string
  date: string
  duration: string
  thumbnail: string
  videoUrl?: string
  audioUrl?: string
  series?: string
  buttonText?: string
  buttonLink?: string
}

export function TeachingCard({
  title,
  description,
  speaker,
  date,
  duration,
  thumbnail,
  videoUrl,
  audioUrl,
  series,
  buttonText = 'Watch Now',
  buttonLink,
}: TeachingCardProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  }

  const getVimeoEmbedUrl = (url: string) => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  const handleButtonClick = () => {
    if (buttonLink) {
      window.open(buttonLink, '_blank', 'noopener,noreferrer');
      return;
    }
    
    if (videoUrl || audioUrl) {
      setIsPlayerOpen(true);
    }
  }

  const renderPlayer = () => {
    if (!videoUrl && !audioUrl) return null;

    // Check for YouTube
    if (videoUrl) {
      const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);
      if (youtubeEmbed) {
        return (
          <iframe
            src={youtubeEmbed}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // Check for Vimeo
      const vimeoEmbed = getVimeoEmbedUrl(videoUrl);
      if (vimeoEmbed) {
        return (
          <iframe
            src={vimeoEmbed}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // Direct video URL
      if (videoUrl.match(/\.(mp4|webm|ogg)$/i) || videoUrl.startsWith('/')) {
        return (
          <video controls className="w-full h-full">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }

      // External video URL (redirect)
      return (
        <div className="w-full h-full flex items-center justify-center">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-lg"
          >
            Click to watch on external site
          </a>
        </div>
      );
    }

    // Audio
    if (audioUrl) {
      return (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
          <source src={audioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      );
    }

    return null;
  }

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border/50">
      {/* Video Thumbnail Container */}
      <div className="relative overflow-hidden">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Series Badge */}
        {series && (
          <div className="absolute top-4 left-4">
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {series}
            </span>
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">{duration}</span>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Teaching Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium">{speaker}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-secondary" />
            <span>{date}</span>
            <Clock className="w-4 h-4 ml-4 mr-2 text-accent" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold mb-3 text-balance group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-pretty mb-6 line-clamp-3">{description}</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleButtonClick}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all duration-300 group-hover:shadow-lg"
            size="lg"
          >
            <Play className="w-4 h-4 mr-2" />
            {buttonText}
          </Button>
          {(videoUrl || audioUrl) && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const url = videoUrl || audioUrl;
                if (url) {
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = title;
                  link.click();
                }
              }}
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-full font-semibold transition-all duration-300 bg-transparent"
            >
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Video/Audio Player Modal */}
    {isPlayerOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setIsPlayerOpen(false)}>
        <div className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsPlayerOpen(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="aspect-video w-full">
            {renderPlayer()}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
