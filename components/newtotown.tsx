"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface NewToMiltonData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export default function NewToTown() {
  const [newToMiltonData, setNewToMiltonData] = useState<NewToMiltonData>({
    title: "New to Milton Keynes?",
    subtitle: "Or Already Here, Visiting, and Looking to Connect?",
    description: "If you are new to our community, visiting, or have been here for a while, we would love to share more about our church family and the ways you can get involved.",
    image: "/images/newtomilton.jpg",
    buttonText: "Learn More",
    buttonLink: "/about"
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
        if (data.newToMilton) {
          setNewToMiltonData(data.newToMilton);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
            <Image
              src={newToMiltonData.image}
              alt="New to Holy Ghost Zone"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {newToMiltonData.title}
              <br />
              <span className="italic text-gray-600 font-normal">{newToMiltonData.subtitle}</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              {newToMiltonData.description}
            </p>

            <div>
              <Link 
                href={newToMiltonData.buttonLink}
              >
                <button className="border-2 border-black text-black px-6 md:px-8 py-3 text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-300">
                  {newToMiltonData.buttonText}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

