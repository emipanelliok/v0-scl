"use client"

import React from "react"
import { Dithering } from "@paper-design/shaders-react"
import { useEffect, useRef, useState } from "react"
import {
  zeroToAgentData,
  zeroToAgentAgendaItems,
  zeroToAgentExperienceItems,
  zeroToAgentPrizes,
  judgingCriteria,
  zeroToAgentSponsors,
} from "@/lib/zero-to-agent-data"
import { formatIndex, logos, type Sponsor } from "@/lib/data"
import { ExternalLink, Trophy, MapPin, Send } from "lucide-react"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"
import Link from "next/link"

// Custom hook for scroll-triggered animations
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

// Gallery images from past events
const galleryImages = [
  {
    src: "/img/BuenosAires.png",
    alt: "Zero to Agent Buenos Aires",
    width: 1280,
    height: 960,
  },
  {
    src: "/img/Rosario.png",
    alt: "Zero to Agent Rosario",
    width: 1280,
    height: 960,
  },
  {
    src: "/img/Mendoza.png",
    alt: "Zero to Agent Mendoza",
    width: 1280,
    height: 960,
  },
]

export default function ZeroToAgentPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const descriptionSection = useInView(0.3)
  const agendaSection = useInView(0.2)
  const experienceSection = useInView(0.2)
  const prizesSection = useInView(0.2)
  const judgingSection = useInView(0.2)
  const sponsorSection = useInView(0.2)
  const gallerySection = useInView(0.15)
  const ctaSection = useInView(0.3)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      // Check if at bottom of page
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const isBottom = scrollTop + windowHeight >= documentHeight - 10
      setIsAtBottom(isBottom)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        {/* Blur and gradient background - only visible when scrolled */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"}`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-0 py-8 lg:py-[49px]">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-[18px] group cursor-pointer">
              <img
                src={logos.v0 || "/placeholder.svg"}
                alt="v0"
                className="h-[24px] w-[50px] transition-opacity duration-300 group-hover:opacity-80"
              />
              <span className="font-mono text-[12px] text-[#737373] tracking-[2.4px] [text-shadow:0px_0px_4px_black] transition-colors duration-300 group-hover:text-white">
                ZERO TO AGENT
              </span>
            </a>
            <div className="flex items-center gap-3">
              <Link
                href="/enviar"
                className="group flex items-center gap-2 border border-white/20 text-white px-5 py-3 rounded-full text-[14px] font-mono tracking-[1px] transition-all duration-300 hover:border-white hover:bg-white/5"
              >
                <Send className="w-3.5 h-3.5" />
                ENVIAR MI PROYECTO
              </Link>
              <a
                href="https://luma.com/r6h41ax8"
                className="luma-checkout--button group bg-white text-[#0f172a] px-6 py-3 rounded-full text-[16px] font-medium leading-[24px] transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center"
                data-luma-action="checkout"
                data-luma-event-id="r6h41ax8"
              >
                Registrate
                <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-6 group-hover:opacity-100">
                  <ExternalLink className="w-4 h-4 ml-2" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-dvh lg:h-[948px] flex flex-col items-center justify-center overflow-hidden">
        {/* Dithering Shader Background */}
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

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[204px] bg-gradient-to-b from-transparent to-black pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1383px] px-6 lg:px-0 flex flex-col gap-[30px]">
          <div className="px-0 lg:px-5 overflow-hidden">
            <p
              className={`font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {zeroToAgentData.greeting}
            </p>
          </div>

          <h1 className="text-[60px] md:text-[100px] lg:text-[137px] font-normal leading-[1] lg:leading-[110px] tracking-[-0.04em] lg:tracking-[-5.48px] text-white">
            <span
              className={`block overflow-hidden transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
            >
              Zero{" "}
            </span>
            <span
              className={`block pb-4 transition-all duration-1000 delay-700 font-pixel ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
            >
              to Agent
            </span>
          </h1>

          <div
            className={`flex flex-col sm:flex-row gap-6 sm:gap-[44px] px-0 lg:px-5 transition-all duration-1000 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex flex-col gap-4 group cursor-default">
              <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-colors duration-300 group-hover:text-[#999]">
                CUÁNDO
              </p>
              <p className="font-mono text-[16px] text-white tracking-[-0.64px] font-extralight transition-all duration-300 group-hover:translate-x-1">
                {zeroToAgentData.date}
              </p>
            </div>
            <a
              href={zeroToAgentData.venueAddress}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-4 group cursor-pointer"
            >
              <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-colors duration-300 group-hover:text-[#999]">
                {zeroToAgentData.locationLabel}
              </p>
              <p className="font-mono text-[16px] text-white tracking-[-0.64px] font-extralight transition-all duration-300 group-hover:translate-x-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {zeroToAgentData.venue}
              </p>
            </a>
            <div className="flex flex-col gap-4 group cursor-default">
              <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-colors duration-300 group-hover:text-[#999]">
                PREMIOS
              </p>
              <p className="font-mono text-[16px] text-white tracking-[-0.64px] font-extralight transition-all duration-300 group-hover:translate-x-1 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                $6.000+ en premios
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-[40px] left-0 right-0 z-20 transition-all duration-1000 delay-1200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="w-full max-w-[1383px] mx-auto px-6 lg:px-5">
            <button
              onClick={() => {
                const mainContent = document.querySelector("main")
                if (mainContent) {
                  mainContent.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="font-mono text-[14px] text-[#737373] tracking-[2.8px] flex items-center gap-3 group cursor-pointer hover:text-[#999] transition-colors duration-300"
            >
              <span>DESLIZÁ PARA VER MÁS</span>
              <span className="inline-block animate-bounce">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] bg-black">
        {/* Description Section */}
        <section
          ref={descriptionSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] min-h-[300px] lg:h-[402px] flex items-center justify-center px-6 lg:px-12 py-12 lg:py-0"
        >
          <p
            className={`text-[22px] lg:text-[30px] font-light leading-[1.5] lg:leading-[46px] tracking-[-0.225px] text-white max-w-[774px] transition-all duration-1000 ${descriptionSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            {zeroToAgentData.description}
          </p>
        </section>

        {/* Timeline/Agenda Section */}
        <section
          ref={agendaSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${agendaSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              AGENDA
            </p>
          </div>
          <div className="flex flex-col w-full lg:w-auto">
            {zeroToAgentAgendaItems.map((item, index) => (
              <AgendaItem
                key={index}
                number={formatIndex(index)}
                title={item.title}
                description={item.time}
                delay={index * 100}
                isVisible={agendaSection.isInView}
                isLast={index === zeroToAgentAgendaItems.length - 1}
              />
            ))}
          </div>
        </section>

        {/* The Experience Section */}
        <section
          ref={experienceSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${experienceSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              LA EXPERIENCIA
            </p>
          </div>
          <div className="w-full lg:w-[685px] flex flex-wrap">
            {zeroToAgentExperienceItems.map((item, index) => (
              <ExperienceCard
                key={index}
                number={formatIndex(index)}
                title={item.title}
                description={item.description}
                delay={index * 100}
                isVisible={experienceSection.isInView}
              />
            ))}
          </div>
        </section>

        {/* Prizes Section */}
        <section
          ref={prizesSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${prizesSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              PREMIOS
            </p>
          </div>
          <div className="w-full lg:w-[685px] flex flex-col gap-4">
            {zeroToAgentPrizes.map((prize, index) => (
              <PrizeCard
                key={index}
                place={prize.place}
                emoji={prize.emoji}
                prize={prize.prize}
                extra={prize.extra}
                delay={index * 100}
                isVisible={prizesSection.isInView}
              />
            ))}
          </div>
        </section>

        {/* Judging Criteria Section */}
        <section
          ref={judgingSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${judgingSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              CRITERIOS
            </p>
          </div>
          <div className="w-full lg:w-[685px] flex flex-wrap">
            {judgingCriteria.map((item, index) => (
              <ExperienceCard
                key={index}
                number={formatIndex(index)}
                title={item.title}
                description={item.description}
                delay={index * 100}
                isVisible={judgingSection.isInView}
              />
            ))}
          </div>
        </section>

        {/* Sponsors Section */}
        <section
          ref={sponsorSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center"
        >
          <div
            className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start transition-all duration-700 ${sponsorSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
          >
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
              CON EL APOYO DE
            </p>
          </div>
          <div className="w-full lg:w-[685px] flex flex-wrap">
            {zeroToAgentSponsors.map((sponsor, index) => (
              <SponsorCard
                key={index}
                sponsor={sponsor as Sponsor}
                delay={index * 100}
                isVisible={sponsorSection.isInView}
              />
            ))}
          </div>
        </section>

        {/* Gallery Section - Past Events */}
        <section
          ref={gallerySection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16"
        >
          {/* Headline */}
          <div className="max-w-[900px]">
            <h2
              className={`text-[28px] md:text-[36px] lg:text-[44px] font-light leading-[1.3] lg:leading-[56px] tracking-[-0.02em] text-white transition-all duration-1000 ${
                gallerySection.isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              De nuestros eventos anteriores: developers construyendo con y para IA, en talleres prácticos, demos y shipeando en tiempo real.
            </h2>
          </div>

          {/* Staggered Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg group cursor-zoom-in ${
                  index === 0
                    ? "md:mt-0"
                    : index === 1
                      ? "md:mt-12 lg:mt-16"
                      : "md:-mt-4 lg:-mt-8"
                } transition-all duration-1000`}
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
                aria-label={`View ${image.alt}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setLightboxIndex(index)
                  }
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                </div>
              </div>
            ))}

            {/* Lightbox */}
            {lightboxIndex !== null && (
              <ImageLightbox
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                width={galleryImages[lightboxIndex].width}
                height={galleryImages[lightboxIndex].height}
                isOpen={true}
                onClose={() => setLightboxIndex(null)}
              />
            )}
          </div>
        </section>

        {/* CTA Footer with Dithering Background */}
        <section
          ref={ctaSection.ref}
          className="relative border-t lg:border border-[#262626] min-h-[200px] lg:h-[245px] px-6 lg:px-[88px] py-12 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-[30px] overflow-hidden lg:mb-16"
        >
          {/* Dithering Background - Same as Hero */}
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

          {/* Content */}
          <h2
            className={`relative z-10 flex-1 text-[36px] lg:text-[68px] font-semibold leading-[1.1] lg:leading-[72px] tracking-[-0.04em] lg:tracking-[-2.72px] text-white text-center lg:text-left transition-all duration-1000 ${ctaSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            {zeroToAgentData.ctaText}
          </h2>
          <div
            className={`relative z-10 transition-all duration-1000 delay-200 ${ctaSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            <a
              href="https://luma.com/r6h41ax8"
              className="luma-checkout--button group bg-white text-[#0f172a] px-6 py-3 rounded-full text-[16px] font-medium leading-[24px] transition-all duration-300 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center"
              data-luma-action="checkout"
              data-luma-event-id="r6h41ax8"
            >
              Registrate
              <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-6 group-hover:opacity-100">
                <ExternalLink className="w-4 h-4 ml-2" />
              </span>
            </a>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Gradient - hidden when at bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-40 transition-opacity duration-500 ${isAtBottom ? "opacity-0" : "opacity-100"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  )
}

function AgendaItem({
  number,
  title,
  description,
  delay = 0,
  isVisible = true,
  isLast = false,
}: {
  number: string
  title: string
  description: string
  delay?: number
  isVisible?: boolean
  isLast?: boolean
}) {
  return (
    <div
      className={`w-full lg:w-[685px] flex items-center gap-[10px] py-6 border-b border-[#262626] ${isLast ? "border-b-0" : ""} group cursor-default transition-all duration-700 hover:bg-white/[0.02] hover:pl-2`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <span className="font-mono text-[10px] text-[#737373] tracking-[-0.4px] font-extralight transition-all duration-300 group-hover:text-white">
        {number}
      </span>
      <span className="text-[18px] lg:text-[20px] text-white leading-[28px] transition-all duration-300 group-hover:translate-x-1">
        {title}
      </span>
      <div className="flex-1 flex items-center justify-end">
        <span className="text-[12px] lg:text-[14px] text-[#737373] leading-[24px] text-right transition-all duration-300 group-hover:text-[#999]">
          {description}
        </span>
      </div>
    </div>
  )
}

function ExperienceCard({
  number,
  title,
  description,
  delay = 0,
  isVisible = true,
}: {
  number: string
  title: string
  description: string
  delay?: number
  isVisible?: boolean
}) {
  return (
    <div
      className="w-full sm:w-[calc(50%-0.5px)] lg:w-[342px] border border-[#262626] p-6 lg:p-8 flex flex-col gap-[10px] justify-center -mr-px -mb-px group cursor-default transition-all duration-700 hover:bg-white/[0.03] hover:border-[#404040]"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <p className="font-mono text-[10px] text-[#737373] tracking-[-0.4px] font-extralight transition-colors duration-300 group-hover:text-white">
        {number}
      </p>
      <h3 className="text-[20px] lg:text-[24px] text-white leading-[28px] transition-all duration-300 group-hover:translate-x-1">
        {title}
      </h3>
      <p className="text-[13px] lg:text-[14px] text-[#737373] leading-[24px] transition-colors duration-300 group-hover:text-[#999]">
        {description}
      </p>
    </div>
  )
}

function PrizeCard({
  place,
  emoji,
  prize,
  extra,
  delay = 0,
  isVisible = true,
}: {
  place: string
  emoji: string
  prize: string
  extra: string
  delay?: number
  isVisible?: boolean
}) {
  return (
    <div
      className="w-full border border-[#262626] p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 group cursor-default transition-all duration-700 hover:bg-white/[0.03] hover:border-[#404040]"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="flex items-center gap-4 min-w-[140px]">
        <span className="text-[28px]">{emoji}</span>
        <span className="text-[20px] lg:text-[24px] text-white leading-[28px] font-medium">
          {place}
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[16px] lg:text-[18px] text-white leading-[24px] transition-all duration-300 group-hover:translate-x-1">
          {prize}
        </p>
        <p className="text-[12px] lg:text-[14px] text-[#737373] leading-[20px] transition-colors duration-300 group-hover:text-[#999]">
          {extra}
        </p>
      </div>
    </div>
  )
}

function SponsorCard({
  sponsor,
  delay = 0,
  isVisible = true,
}: {
  sponsor: Sponsor
  delay?: number
  isVisible?: boolean
}) {
  const renderAsset = () => {
    const { assetType, logo, name, height } = sponsor

    // Handle SVG
    if (assetType === "svg") {
      return (
        <img
          src={logo || "/placeholder.svg"}
          alt={name}
          className="w-auto max-w-[184px] transition-opacity duration-300 group-hover:opacity-80"
          style={{ height: height || "auto" }}
        />
      )
    }

    // Handle PNG/JPG with Next.js Image
    if (assetType === "png" || assetType === "jpg" || assetType === "jpeg") {
      return (
        <Image
          src={logo || "/placeholder.svg"}
          alt={name}
          width={184}
          height={height || 50}
          className="w-auto max-w-[184px] transition-opacity duration-300 group-hover:opacity-80"
          style={{ height: height || "auto" }}
        />
      )
    }

    // Handle remote URLs
    if (assetType === "remote") {
      return (
        <img
          src={logo || "/placeholder.svg"}
          alt={name}
          className="w-auto max-w-[184px] transition-opacity duration-300 group-hover:opacity-80"
          style={{ height: height || "auto" }}
        />
      )
    }

    return null
  }

  const content = (
    <div
      className="relative w-full sm:w-[calc(50%-0.5px)] lg:w-[342px] h-[140px] lg:h-[173px] border border-[#262626] p-6 lg:p-8 flex flex-col items-center justify-center -mr-px -mb-px group cursor-pointer transition-all duration-700 hover:bg-white/[0.03] hover:border-[#404040]"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* External link icon - top right */}
      <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 translate-x-2 -translate-y-2 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
      {renderAsset()}
    </div>
  )

  return (
    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="contents">
      {content}
    </a>
  )
}
