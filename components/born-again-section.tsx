"use client"

import { useState, useEffect } from 'react'

const DEFAULT_STEPS = [
  {
    title: "Acknowledge all your sins Acts 2:36 - 38",
    content: "Therefore let all the house of Israel know assuredly, that God hath made the same Jesus, whom ye have crucified, both Lord and Christ. 37 Now when they heard this, they were pricked in their heart, and said unto Peter and to the rest of the apostles, Men and brethren, what shall we do? 38 Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost."
  },
  {
    title: "Confess those sins. Galatians 5:19 - 21",
    content: "Now the works of the flesh are manifest, which are these; Adultery, fornication, uncleanness, lasciviousness, Idolatry, witchcraft, hatred, variance, emulations, wrath, strife, seditions, heresies, Envyings, murders, drunkenness, revellings, and such like: of the which I tell you before, as I have also told you in time past, that they which do such things shall not inherit the kingdom of God."
  },
  {
    title: "Ask for forgiveness of sin. I John 1:9",
    content: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness."
  },
  {
    title: "Repent of those sins. Act 3:19",
    content: "Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord."
  },
  {
    title: "Forsake all your old ways and sinful habit Luke 14: 33",
    content: "So likewise, whosoever he be of you that forsaketh not all that he hath, he cannot be my disciple."
  },
  {
    title: "Join a Bible believing Church around. Hebrew 10:25",
    content: "Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching."
  }
]

interface FollowJesusPageData {
  title: string
  subtitle: string
  backgroundImage: string
  steps: { title: string; content: string }[]
}

export default function BornAgainSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const [pageData, setPageData] = useState<FollowJesusPageData | null>(null)
  const [dataReady, setDataReady] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/pages/follow-jesus', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data && (data.title || data.steps?.length)) {
          setPageData({
            title: data.title ?? 'Do You Want To Give Your Life To Christ?',
            subtitle: data.subtitle ?? 'Please Follow The Steps Below.',
            backgroundImage: data.backgroundImage ?? '/images/services.jpg',
            steps: Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : DEFAULT_STEPS,
          })
        } else {
          setPageData({
            title: 'Do You Want To Give Your Life To Christ?',
            subtitle: 'Please Follow The Steps Below.',
            backgroundImage: '/images/services.jpg',
            steps: DEFAULT_STEPS,
          })
        }
      } catch (e) {
        setPageData({
          title: 'Do You Want To Give Your Life To Christ?',
          subtitle: 'Please Follow The Steps Below.',
          backgroundImage: '/images/services.jpg',
          steps: DEFAULT_STEPS,
        })
      } finally {
        setDataReady(true)
      }
    }
    load()
  }, [])

  const title = pageData?.title ?? 'Do You Want To Give Your Life To Christ?'
  const subtitle = pageData?.subtitle ?? 'Please Follow The Steps Below.'
  const backgroundImage = pageData?.backgroundImage ?? '/images/services.jpg'
  const steps = pageData?.steps?.length ? pageData.steps : DEFAULT_STEPS

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Image — only show after fetch to avoid flash of old content */}
      <div className="absolute inset-0">
        {dataReady ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-purple-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {dataReady ? (
              <>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90">
                  {subtitle}
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="h-12 w-3/4 mx-auto bg-white/20 rounded animate-pulse" />
                <div className="h-6 w-1/2 mx-auto bg-white/10 rounded animate-pulse" />
              </div>
            )}
          </div>

          {dataReady && (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white/95 rounded-lg overflow-hidden shadow-lg"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-3 font-semibold text-gray-900">
                      <span className="text-2xl">
                        {openIndex === index ? '−' : '+'}
                      </span>
                      {step.title}
                    </span>
                  </button>

                  {openIndex === index && (
                    <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">
                        {step.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
