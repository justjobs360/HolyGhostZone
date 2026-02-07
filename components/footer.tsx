"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter, Heart } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [footerData, setFooterData] = useState({
    logo: '/images/holy-ghost-zone-logo.png',
    description: 'We are a community based church with a keen interest in impacting our community through transformational Christ-centered activities and programs.',
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: '',
    },
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '#events' },
      { label: 'Teachings', href: '#teachings' },
    ],
    serviceTimes: [
      { title: 'Sunday Worship', time: '11:00 AM' },
      { title: 'Tuesday House Fellowship & Bible Study', time: '7:30 PM (Zoom)' },
      { title: 'Thursday Shiloh Hour', time: '7:00 PM (Zoom)' },
    ],
    contactInfo: {
      address: 'Delta Hotels Milton Keynes\nTimbold Drive, Kents Hill\nMilton Keynes, MK7 6HL\nUnited Kingdom',
      phone: '+44 7445 423178',
      email: 'info@holyghostzonemk.org',
    },
    copyright: 'Holy Ghost Zone MK. All rights reserved.',
    developerCredit: {
      text: 'Developed by',
      link: 'https://www.sillylittletools.com',
      linkText: 'SillyLittleTools',
    },
  })

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const response = await fetch('/api/pages/footer');
        if (!response.ok) {
          console.error('Failed to load footer data');
          return;
        }
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setFooterData(data);
        }
      } catch (error) {
        console.error('Error loading footer data:', error);
      }
    };

    loadFooterData();
  }, []);

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 md:mb-6">
              <Image
                src={footerData.logo}
                alt="Holy Ghost Zone MK"
                width={200}
                height={150}
                className="mr-3 w-40 md:w-48 lg:w-52 h-auto"
              />
              
            </div>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 text-pretty">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              {footerData.socialMedia.facebook && (
                <Link href={footerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 p-2">
                <Facebook className="w-5 h-5" />
              </Button>
                </Link>
              )}
              {footerData.socialMedia.instagram && (
                <Link href={footerData.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 p-2">
                <Instagram className="w-5 h-5" />
              </Button>
                </Link>
              )}
              {footerData.socialMedia.youtube && (
                <Link href={footerData.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 p-2">
                <Youtube className="w-5 h-5" />
              </Button>
                </Link>
              )}
              {footerData.socialMedia.twitter && (
                <Link href={footerData.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 p-2">
                <Twitter className="w-5 h-5" />
              </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.label}
                </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Service Times</h4>
            <div className="space-y-4">
              {footerData.serviceTimes.map((service, index) => (
                <div key={index} className="flex items-start">
                <Clock className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-gray-300 text-sm">{service.time}</p>
              </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm whitespace-pre-line">
                    {footerData.contactInfo.address}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{footerData.contactInfo.phone}</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{footerData.contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {currentYear} {footerData.copyright}
            </p>
            <div className="flex items-center text-gray-400 text-xs md:text-sm">
              <span>{footerData.developerCredit.text} </span>
              {footerData.developerCredit.link && (
                <Link href={footerData.developerCredit.link} target="_blank" rel="noopener noreferrer">
                  <span className="hover:text-primary transition-colors cursor-pointer">&nbsp;{footerData.developerCredit.linkText}</span>
              </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
