"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"

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

const galleryImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v0-prod-miami-prezi-BarKiBdk5j3MUw5synBuAYRfCmmbLU.png",
    alt: "Prompt to Production presentation at The Lab Miami with audience working on laptops",
    width: 1280,
    height: 960,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v0-prod-miami-group-kzJ8lOWAJ4gdm1zxKgfQCmnKzknhMb.png",
    alt: "Group photo of Prompt to Production Miami attendees",
    width: 1280,
    height: 960,
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v0-prod-miami-full-QPTgdUpId1TFlZpUEejxH7NBjQBWEF.png",
    alt: "Developers building at The Lab Miami during the Prompt to Production event",
    width: 1280,
    height: 960,
  },
]

export function Gallery() {
  const section = useInView(0.15)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section
      ref={section.ref}
      className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16"
    >
      {/* Headline */}
      <div className="max-w-[900px]">
        <h2
          className={`text-[28px] md:text-[36px] lg:text-[44px] font-light leading-[1.3] lg:leading-[56px] tracking-[-0.02em] text-white transition-all duration-1000 ${
            section.isInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          We brought together developers actively building with and for AI
          through hands-on workshops, demos, and skill-based tracks.
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
              opacity: section.isInView ? 1 : 0,
              transform: section.isInView
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
  )
}
