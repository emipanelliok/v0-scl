"use client"

import { useEffect, useRef, useState } from "react"
import { Dithering } from "@paper-design/shaders-react"
import { ExternalLink, ArrowLeft, Trophy, Award, Sparkles, Play } from "lucide-react"
import { MediaLightbox } from "@/components/media-lightbox"
import { galleryItems } from "@/lib/gallery-data"
import { logos } from "@/lib/data"
import Link from "next/link"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

const winners = {
  gailChallenge: [
    {
      place: "1st",
      name: "Gail Insights (TalkTik Analytics)",
      team: "Anand and Monty",
      link: "https://youtu.be/xW3of8MAxFo?si=IVXMJYb-LOK60Kg5",
      linkLabel: "Watch Video",
    },
    {
      place: "2nd",
      name: "Violet Verse",
      team: "Melissa Henderson",
      link: "https://violetverse.io/agent",
      linkLabel: "View Live",
    },
  ],
  kurzo: [
    {
      name: "Course Forge",
      team: "Burhanuddin Jinwala & Keerthana Srinivasan",
      link: "https://v0-course-forge-7u81s9apr-burhanj888s-projects.vercel.app/",
      linkLabel: "View Project",
    },
  ],
  judgesChoice: [
    {
      category: "Marketing Excellence",
      projects: [
        {
          name: "Maildrop.me",
          team: "Lisa Oberst & Nima Hosseinzadeh",
          link: "http://www.maildrop.me/",
          linkLabel: "View Live",
        },
        {
          name: "Virality OS",
          team: "Ana Snakina",
          link: "https://v0-virality-os-dashboard.vercel.app/",
          linkLabel: "View Project",
        },
      ],
    },
    {
      category: "Craft & Visual Taste",
      projects: [
        {
          name: "Open Bands + The Listener",
          team: "Katherine Burge",
          link: "https://v0-open-bands-visualization.vercel.app/",
          linkLabel: "View Project",
        },
      ],
    },
  ],
}

// Show a curated subset of 6 items from the gallery for the recap preview
const recapPreviewItems = galleryItems.slice(0, 6)

export default function RecapPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const introSection = useInView(0.2)
  const gallerySection = useInView(0.1)
  const winnersSection = useInView(0.1)
  const judgesSection = useInView(0.1)
  const closingSection = useInView(0.2)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      setIsAtBottom(scrollTop + windowHeight >= documentHeight - 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-0 py-8 lg:py-[49px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[18px] group cursor-pointer">
              <Link href="/events/2026/prompt-to-prod" className="flex items-center gap-[18px]">
                <img
                  src={logos.v0 || "/placeholder.svg"}
                  alt="v0"
                  className="h-[24px] w-[50px] transition-opacity duration-300 group-hover:opacity-80"
                />
                <span className="font-mono text-[12px] text-[#737373] tracking-[2.4px] [text-shadow:0px_0px_4px_black] transition-colors duration-300 group-hover:text-white">
                  IRL - MIAMI
                </span>
              </Link>
            </div>
            <Link
              href="/events/2026/prompt-to-prod"
              className="group flex items-center gap-2 font-mono text-[12px] text-[#737373] tracking-[2.4px] transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              BACK
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] lg:h-[700px] flex flex-col items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1500 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <Dithering
            colorBack="#000000"
            colorFront="#99999921"
            shape="warp"
            type="4x4"
            size={2.5}
            speed={0.45}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[204px] bg-gradient-to-b from-transparent to-black pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1383px] px-6 lg:px-0 flex flex-col gap-[30px]">
          <div className="px-0 lg:px-5 overflow-hidden">
            <p
              className={`font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              FEBRUARY 7, 2026 - RECAP
            </p>
          </div>

          <h1 className="text-[48px] md:text-[80px] lg:text-[110px] font-normal leading-[1] lg:leading-[100px] tracking-[-0.04em] lg:tracking-[-4.4px] text-white overflow-hidden px-0 lg:px-5">
            <span
              className={`block transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
            >
              Prompt to
            </span>
            <span
              className={`block transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
            >
              Prod Miami
            </span>
          </h1>

          <div
            className={`px-0 lg:px-5 transition-all duration-1000 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              THE DOCK, WYNWOOD
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] bg-black">
        {/* Intro Message */}
        <section
          ref={introSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] min-h-[200px] flex items-center justify-center px-6 lg:px-16 py-16 lg:py-24"
        >
          <div
            className={`max-w-[774px] flex flex-col gap-8 transition-all duration-1000 ${introSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <p className="text-[20px] lg:text-[26px] font-light leading-[1.6] lg:leading-[42px] tracking-[-0.2px] text-white">
              Huge thank you for coming out and making the first-ever v0 IRL
              Miami such an electric day. From the moment doors opened at The
              Dock in Wynwood to the final demos and community votes - the
              energy, the ships, the collabs, and the beats from DJ PARINI were
              next level.
            </p>
            <p className="text-[16px] lg:text-[18px] font-light leading-[1.6] text-[#999]">
              Miami absolutely showed up for Vercel&apos;s global Prompt to
              Production tour. Your projects are now live in the global v0
              gallery and community submissions page.
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          ref={gallerySection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16"
        >
          <div
            className={`flex items-center transition-all duration-700 ${gallerySection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              MOMENTS
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
            {recapPreviewItems.map((item, index) => (
              <div
                key={item.src}
                className="relative overflow-hidden rounded-lg group cursor-zoom-in bg-[#111] transition-all duration-1000"
                style={{
                  transitionDelay: `${200 + index * 150}ms`,
                  opacity: gallerySection.isInView ? 1 : 0,
                  transform: gallerySection.isInView
                    ? "translateY(0)"
                    : "translateY(40px)",
                }}
                onClick={() => setLightboxIndex(index)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.type === "video" ? "video" : "photo"} ${index + 1}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setLightboxIndex(index)
                  }
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  {item.type === "video" ? (
                    <>
                      <video
                        src={item.src}
                        preload="metadata"
                        muted
                        playsInline
                        className="object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="rounded-full bg-black/60 backdrop-blur-sm p-2.5">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.src}
                      alt={`Event photo ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                </div>
              </div>
            ))}
          </div>

          {/* See full gallery button */}
          <div
            className={`flex justify-center transition-all duration-1000 delay-[1000ms] ${gallerySection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-colors duration-300 hover:text-white"
            >
              SEE THE FULL GALLERY
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>

          {/* Lightbox */}
          {lightboxIndex !== null && (
            <MediaLightbox
              items={recapPreviewItems}
              currentIndex={lightboxIndex}
              isOpen={true}
              onClose={() => setLightboxIndex(null)}
              onIndexChange={(index) => setLightboxIndex(index)}
            />
          )}
        </section>

        {/* Winners Section - Gail Challenge & Kurzo */}
        <section
          ref={winnersSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${winnersSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              WINNERS
            </p>
          </div>

          <div className="w-full lg:w-[685px] flex flex-col gap-12">
            {/* Gail Challenge */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#737373]" />
                <h3 className="text-[18px] lg:text-[22px] text-white font-medium">
                  Gail Challenge
                </h3>
                <span className="font-mono text-[12px] text-[#737373] tracking-wider">
                  $1,000 POOL
                </span>
              </div>
              {winners.gailChallenge.map((winner, index) => (
                <WinnerCard
                  key={index}
                  place={winner.place}
                  name={winner.name}
                  team={winner.team}
                  link={winner.link}
                  linkLabel={winner.linkLabel}
                  delay={index * 100}
                  isVisible={winnersSection.isInView}
                />
              ))}
            </div>

            {/* Kurzo */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#737373]" />
                <h3 className="text-[18px] lg:text-[22px] text-white font-medium">
                  Kurzo
                </h3>
                <span className="font-mono text-[12px] text-[#737373] tracking-wider">
                  $250
                </span>
              </div>
              {winners.kurzo.map((winner, index) => (
                <WinnerCard
                  key={index}
                  name={winner.name}
                  team={winner.team}
                  link={winner.link}
                  linkLabel={winner.linkLabel}
                  delay={index * 100}
                  isVisible={winnersSection.isInView}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Judge's Choice Section */}
        <section
          ref={judgesSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${judgesSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              {"JUDGE'S CHOICE"}
            </p>
          </div>

          <div className="w-full lg:w-[685px] flex flex-col gap-12">
            {winners.judgesChoice.map((category, catIndex) => (
              <div key={catIndex} className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#737373]" />
                  <h3 className="text-[18px] lg:text-[22px] text-white font-medium">
                    {category.category}
                  </h3>
                </div>
                {category.projects.map((project, index) => (
                  <WinnerCard
                    key={index}
                    name={project.name}
                    team={project.team}
                    link={project.link}
                    linkLabel={project.linkLabel}
                    delay={(catIndex * 2 + index) * 100}
                    isVisible={judgesSection.isInView}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Submissions Link */}
        <section className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-12 lg:py-16 flex items-center justify-center">
          <Link
            href="/submissions"
            className="group flex items-center gap-3 text-[#737373] hover:text-white transition-colors duration-300"
          >
            <span className="font-mono text-[14px] tracking-[2.8px]">
              VIEW ALL THE SUBMISSIONS
            </span>
            <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Closing CTA */}
        <section
          ref={closingSection.ref}
          className="relative border-t lg:border border-[#262626] min-h-[200px] lg:h-[300px] px-6 lg:px-[88px] py-12 flex flex-col items-center justify-center gap-8 overflow-hidden lg:mb-16"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Dithering
              colorBack="#000000"
              colorFront="#99999921"
              shape="warp"
              type="4x4"
              size={2.5}
              speed={0.45}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <h2
            className={`relative z-10 text-[28px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.04em] text-white text-center transition-all duration-1000 ${closingSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            Keep shipping. See you at the next one.
          </h2>
          <p
            className={`relative z-10 font-mono text-[14px] text-[#737373] tracking-[2.8px] text-center transition-all duration-1000 delay-200 ${closingSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            QUESTIONS?{" "}
            <a
              href="mailto:agnel@kurzo.com"
              className="text-white hover:underline transition-colors duration-300"
            >
              AGNEL@KURZO.COM
            </a>
          </p>
        </section>
      </main>

      {/* Fixed Bottom Gradient */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-40 transition-opacity duration-500 ${isAtBottom ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  )
}

function WinnerCard({
  place,
  name,
  team,
  link,
  linkLabel,
  delay = 0,
  isVisible = true,
}: {
  place?: string
  name: string
  team: string
  link: string
  linkLabel: string
  delay?: number
  isVisible?: boolean
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-[#262626] p-6 lg:p-8 transition-all duration-700 hover:bg-white/[0.03] hover:border-[#404040]"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {place && (
              <span className="font-mono text-[12px] text-[#737373] tracking-wider bg-white/[0.05] px-3 py-1 rounded-full">
                {place}
              </span>
            )}
            <h4 className="text-[18px] lg:text-[20px] text-white leading-[28px] transition-all duration-300 group-hover:translate-x-1">
              {name}
            </h4>
          </div>
          <ExternalLink className="w-4 h-4 text-[#737373] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-white" />
        </div>
        <p className="text-[13px] lg:text-[14px] text-[#737373] leading-[24px] transition-colors duration-300 group-hover:text-[#999]">
          {team}
        </p>
        <span className="font-mono text-[11px] text-[#737373] tracking-[2px] transition-colors duration-300 group-hover:text-white">
          {linkLabel.toUpperCase()}
        </span>
      </div>
    </a>
  )
}
