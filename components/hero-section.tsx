"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useSpring } from "framer-motion"

interface HeroData {
  title: string
  subtitle: string
  backgroundImage: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export function HeroSection() {
  // Smooth spring animations for cursor follower
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  // Hero data state
  const [heroData, setHeroData] = useState<HeroData>({
    title: 'Experience the Power of Faith',
    subtitle: 'Join our vibrant community where modern worship meets timeless truth. Discover your purpose, grow in faith, and make lasting connections.',
    backgroundImage: '/images/bgimg.jpeg',
    primaryButtonText: 'Teachings',
    primaryButtonLink: '/teachings',
    secondaryButtonText: 'About',
    secondaryButtonLink: '/about',
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 160)
      cursorY.set(e.clientY - 160)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cursorX, cursorY])

  // Load hero data from API
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const response = await fetch('/api/pages/home')
        if (!response.ok) {
          console.error('Failed to load hero data')
          return
        }
        const data = await response.json()
        if (data.hero) {
          setHeroData(data.hero)
        }
      } catch (error) {
        console.error('Error loading hero data:', error)
      }
    }

    loadHeroData()
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Cursor Follower - Smooth Spring Animation with Radiant Glow (Only in Hero Section) */}
      <motion.div
        className="pointer-events-none absolute z-30 w-80 h-80 rounded-full blur-3xl"
        style={{
          left: cursorX,
          top: cursorY,
          background: "radial-gradient(circle, rgba(246,160,35,0.35) 0%, rgba(13,163,230,0.25) 50%, transparent 70%)",
          boxShadow: "0 0 50px rgba(246,160,35,0.4), 0 0 80px rgba(13,163,230,0.2)",
        }}
      />
      
      {/* Secondary Cursor Follower - Smaller, More Intense */}
      <motion.div
        className="pointer-events-none absolute z-30 w-48 h-48 rounded-full blur-2xl"
        style={{
          left: cursorX,
          top: cursorY,
          background: "radial-gradient(circle, rgba(246,160,35,0.5) 0%, rgba(255,165,0,0.3) 40%, transparent 70%)",
          boxShadow: "0 0 30px rgba(246,160,35,0.6)",
        }}
        transition={{ delay: 0.05 }}
      />
      
      <div className="absolute inset-0">
        {/* Cover: responsive hero — smaller image on mobile (faster LCP), full quality on desktop; always displays */}
        {heroData.backgroundImage.startsWith('/images/') ? (
          <picture className="absolute inset-0 block w-full h-full">
            <source
              media="(max-width: 768px)"
              srcSet={`/api/hero-image?url=${encodeURIComponent(heroData.backgroundImage)}&w=828&q=65`}
            />
            <img
              src={`/api/hero-image?url=${encodeURIComponent(heroData.backgroundImage)}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center bg-gray-900"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
        ) : (
          <img
            src={heroData.backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center bg-gray-900"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        )}

        {/* Super Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/98" />
        
        {/* Additional dramatic overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        {/* Sophisticated animated elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/12 to-primary/12 rounded-full blur-3xl"
            animate={{
              y: [0, 40, 0],
              x: [0, -25, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-3xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const xOffset = ((i * 37) % 50) - 25; // Deterministic x offset
            const duration = 3 + ((i * 17) % 40) / 10; // Deterministic duration 3-7s
            const delay = (i * 23) % 30 / 10; // Deterministic delay 0-3s
            const left = ((i * 47) % 100); // Deterministic left position
            const top = ((i * 67) % 100); // Deterministic top position
            
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/40 rounded-full"
                animate={{
                  y: [0, -100, 0],
                  x: [0, xOffset, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
              />
            );
          })}
        </div>

        {/* Premium mesh pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Subtle noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>
        
        {/* Additional polish - subtle vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl"
          >
            <div className="w-full text-left">
              <motion.h1 
                className="font-bold text-balance mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tight text-white"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>
                  {"Experience".split('').map((char, index) => (
                    <motion.span
                      key={`exp-${index}`}
                      className="inline-block cursor-default"
                      whileHover={{
                        textShadow: "0 0 20px rgba(246,160,35,1), 0 0 40px rgba(246,160,35,0.8)",
                        scale: 1.1,
                        color: "#f6a023",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>
                  {"the".split('').map((char, index) => (
                    <motion.span
                      key={`the-${index}`}
                      className="inline-block cursor-default"
                      whileHover={{
                        textShadow: "0 0 20px rgba(246,160,35,1), 0 0 40px rgba(246,160,35,0.8)",
                        scale: 1.1,
                        color: "#f6a023",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>{' '}
                <motion.span 
                  className="gradient-text font-black"
                  style={{ whiteSpace: 'nowrap' }}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  {"Power".split('').map((char, index) => (
                    <motion.span
                      key={`power-${index}`}
                      className="inline-block cursor-default"
                      whileHover={{
                        textShadow: "0 0 20px rgba(246,160,35,1), 0 0 40px rgba(246,160,35,0.8)",
                        scale: 1.15,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                {' '}
                <span style={{ whiteSpace: 'nowrap' }}>
                  {"of".split('').map((char, index) => (
                    <motion.span
                      key={`of-${index}`}
                      className="inline-block cursor-default"
                      whileHover={{
                        textShadow: "0 0 20px rgba(246,160,35,1), 0 0 40px rgba(246,160,35,0.8)",
                        scale: 1.1,
                        color: "#f6a023",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>{' '}
                <span className="text-primary font-black" style={{ whiteSpace: 'nowrap' }}>
                  {"Faith".split('').map((char, index) => (
                    <motion.span
                      key={`faith-${index}`}
                      className="inline-block cursor-default"
                      whileHover={{
                        textShadow: "0 0 20px rgba(246,160,35,1), 0 0 40px rgba(246,160,35,0.8)",
                        scale: 1.2,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>

              <motion.p 
                className="text-gray-200 text-pretty mb-8 md:mb-12 leading-relaxed font-light max-w-4xl"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {heroData.subtitle}
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 md:gap-6 items-stretch sm:items-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href={heroData.primaryButtonLink} className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-full"
                  >
                    <button className="w-full sm:w-auto border-2 border-primary text-white bg-primary hover:bg-primary/90 px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide transition-all duration-300">
                      {heroData.primaryButtonText}
                    </button>
                  </motion.div>
                </Link>
                <Link href={heroData.secondaryButtonLink} className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="w-full"
                  >
                    <button className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide transition-all duration-300">
                      {heroData.secondaryButtonText}
                    </button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  )
}
