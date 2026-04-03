"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowLeft, Play } from "lucide-react"
import Link from "next/link"
import { logos } from "@/lib/data"
import { galleryItems } from "@/lib/gallery-data"
import { MediaLightbox } from "@/components/media-lightbox"

// Intersection Observer hook for fade-in animations
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

// Lazy gallery item - only mounts <img>/<video> when near viewport
function LazyGalleryItem({
  index,
  onOpen,
}: {
  index: number
  onOpen: (index: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isNear, setIsNear] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const item = galleryItems[index]
  const isVideo = item.type === "video"

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="gallery-item relative overflow-hidden rounded-lg group cursor-zoom-in bg-[#111]"
      onClick={() => onOpen(index)}
      role="button"
      tabIndex={0}
      aria-label={`View ${isVideo ? "video" : "photo"} ${index + 1}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen(index)
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {isNear ? (
          <>
            {isVideo ? (
              <>
                <video
                  src={item.src}
                  preload="metadata"
                  muted
                  playsInline
                  className={`object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadedMetadata={() => setIsLoaded(true)}
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="rounded-full bg-black/60 backdrop-blur-sm p-3 transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white" />
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
                className={`object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setIsLoaded(true)}
              />
            )}
            {/* Loading skeleton */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-[#111] animate-pulse" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[#111]" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const heroSection = useInView(0.2)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleOpen = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const handleIndexChange = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const totalImages = galleryItems.filter((i) => i.type === "image").length
  const totalVideos = galleryItems.filter((i) => i.type === "video").length

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
              <Link href="/" className="flex items-center gap-[18px]">
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
              href="/recap"
              className="group flex items-center gap-2 font-mono text-[12px] text-[#737373] tracking-[2.4px] transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              RECAP
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        ref={heroSection.ref}
        className="relative pt-[140px] lg:pt-[180px] pb-12 lg:pb-16 px-6 lg:px-0 mx-auto max-w-[1400px]"
      >
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden">
            <p
              className={`font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              GALLERY
            </p>
          </div>

          <h1
            className={`text-[36px] md:text-[52px] lg:text-[68px] font-normal leading-[1.05] tracking-[-0.04em] text-white transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
          >
            Moments from
            <br />
            the event
          </h1>

          <p
            className={`font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {totalImages} PHOTOS &middot; {totalVideos} VIDEOS
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="mx-auto max-w-[1400px] px-6 lg:px-0 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {galleryItems.map((_, index) => (
            <LazyGalleryItem
              key={galleryItems[index].src}
              index={index}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <MediaLightbox
          items={galleryItems}
          currentIndex={lightboxIndex}
          isOpen={true}
          onClose={handleClose}
          onIndexChange={handleIndexChange}
        />
      )}

      <style jsx global>{`
        .gallery-item {
          content-visibility: auto;
          contain-intrinsic-size: 0 auto;
        }
      `}</style>
    </div>
  )
}
