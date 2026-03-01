"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface PracticeJesusData {
  title: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
}

export default function FollowJesus() {
  const [practiceJesusData, setPracticeJesusData] = useState<PracticeJesusData>({
    title: "Practice the way of Jesus",
    backgroundImage: "/images/followjesus.jpg",
    buttonText: "Follow Jesus",
    buttonLink: "/follow-jesus"
  });

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await fetch('/api/pages/home');
        if (!response.ok) {
          console.error('Failed to load page data');
          return;
        }
        const data = await response.json();
        if (data.practiceJesus) {
          setPracticeJesusData(data.practiceJesus);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={practiceJesusData.backgroundImage}
          alt="Practice the way of Jesus"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 md:mb-12 leading-tight">
          {practiceJesusData.title}
        </h2>

        <Link href={practiceJesusData.buttonLink}>
          <button className="border-2 border-white text-white px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300">
            {practiceJesusData.buttonText}
          </button>
        </Link>
      </div>
    </section>
  )
}

