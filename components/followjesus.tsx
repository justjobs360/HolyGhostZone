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
  const [practiceJesusData, setPracticeJesusData] = useState<PracticeJesusData | null>(null);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await fetch('/api/pages/home', { cache: 'no-store' });
        if (!response.ok) {
          setPracticeJesusData({
            title: "Practice the way of Jesus",
            backgroundImage: "/images/followjesus.jpg",
            buttonText: "Follow Jesus",
            buttonLink: "/follow-jesus"
          });
        } else {
          const data = await response.json();
          setPracticeJesusData(data.practiceJesus ?? {
            title: "Practice the way of Jesus",
            backgroundImage: "/images/followjesus.jpg",
            buttonText: "Follow Jesus",
            buttonLink: "/follow-jesus"
          });
        }
      } catch (error) {
        console.error('Error loading page data:', error);
        setPracticeJesusData({
          title: "Practice the way of Jesus",
          backgroundImage: "/images/followjesus.jpg",
          buttonText: "Follow Jesus",
          buttonLink: "/follow-jesus"
        });
      } finally {
        setDataReady(true);
      }
    };
    loadPageData();
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image — only show after fetch to avoid flash of old image */}
      <div className="absolute inset-0">
        {dataReady && practiceJesusData ? (
          <Image
            src={practiceJesusData.backgroundImage}
            alt="Practice the way of Jesus"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1342px"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 md:mb-12 leading-tight">
          {practiceJesusData?.title ?? ''}
        </h2>

        {practiceJesusData && (
          <Link href={practiceJesusData.buttonLink}>
            <button className="border-2 border-white text-white px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-300">
              {practiceJesusData.buttonText}
            </button>
          </Link>
        )}
      </div>
    </section>
  )
}

