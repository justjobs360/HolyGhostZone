"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [headerData, setHeaderData] = useState({
    mainLogo: '/images/holy-ghost-zone-logo.png',
    affiliateLogo: '/images/affchurch.avif',
    affiliateLink: 'https://www.rccg.org/',
    navItems: [
      { href: "/", label: "Home", visible: true },
      { href: "/about", label: "About", visible: true },
      { href: "/events", label: "Events", visible: true },
      { href: "/teachings", label: "Teachings", visible: true },
      { href: "/gallery", label: "Gallery", visible: true },
    ],
  })

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const response = await fetch('/api/pages/header');
        if (!response.ok) {
          console.error('Failed to load header data');
          return;
        }
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setHeaderData(data);
        }
      } catch (error) {
        console.error('Error loading header data:', error);
      }
    };

    loadHeaderData();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white premium-shadow-lg border-b border-gray-200" : "bg-transparent "
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Main Logo - Left Side */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-all duration-300 hover:scale-105 group"
            aria-label="Holy Ghost Zone MK Homepage"
          >
            <Image
              src={headerData.mainLogo}
              alt="Holy Ghost Zone MK"
              width={120}
              height={40}
              className="h-14 sm:h-14 lg:h-20 w-auto group-hover:drop-shadow-lg transition-all duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            {headerData.navItems.filter(item => item.visible !== false).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-all duration-300 font-medium text-base xl:text-lg group ${
                  isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side - Affiliate Logo and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Affiliate Logo - Hidden on very small screens, visible on sm and up */}
            <Link
              href={headerData.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center hover:opacity-80 transition-all duration-300 hover:scale-105 group"
              aria-label="Visit Affiliated Church"
            >
              <Image
                src={headerData.affiliateLogo}
                alt="Affiliated Church"
                width={100}
                height={32}
                className="h-6 sm:h-8 lg:h-20 w-auto group-hover:drop-shadow-lg transition-all duration-300"
                priority
              />
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl hover:bg-primary/10 transition-all duration-300 ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-xl">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200/20">
                <Link
                  href="/"
                  className="flex items-center hover:opacity-80 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src={headerData.mainLogo}
                    alt="Holy Ghost Zone MK"
                    width={120}
                    height={40}
                    className="h-16 w-auto"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 rounded-lg hover:bg-gray-200/50"
                  onClick={toggleMenu}
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="px-4 py-6">
                <div className="flex flex-col space-y-1">
                  {headerData.navItems.filter(item => item.visible !== false).map((item, index) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-4 text-lg font-medium text-gray-900 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Affiliate Section */}
                <div className="mt-8 pt-6 border-t border-gray-200/20">
                  <div className="flex flex-col space-y-3">
                    <span className="text-sm text-gray-600 font-medium px-4">Partner Church</span>
                    <Link
                      href={headerData.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image
                        src={headerData.affiliateLogo}
                        alt="Affiliated Church"
                        width={60}
                        height={20}
                        className="h-5 w-auto group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="text-sm font-medium text-primary">Visit RCCG Website</span>
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
