"use client"

import React from "react"
import { Dithering } from "@paper-design/shaders-react"
import { useEffect, useRef, useState } from "react"
import { zeroToAgentSponsors } from "@/lib/zero-to-agent-data"
import { logos, type Sponsor } from "@/lib/data"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"
import LocalSubmissionForm from "@/components/local-submission-form"

// ─── Gallery (event photos) ───────────────────────────────────────────────────
const galleryImages = [
  { src: "/img/BuenosAires.png", alt: "Zero to Agent Buenos Aires", width: 1280, height: 960 },
  { src: "/img/Rosario.png",     alt: "Zero to Agent Rosario",      width: 1280, height: 960 },
  { src: "/img/Mendoza.png",     alt: "Zero to Agent Mendoza",      width: 1280, height: 960 },
]

function getScreenshot(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`
}

// ─── Showcase tab (fetches projects client-side) ──────────────────────────────
function ShowcaseTab() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/local-submissions?ciudad=santiago")
      .then(r => r.json())
      .then(d => { setProjects(d.submissions || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono text-[12px] text-[#737373] tracking-[2px]">CARGANDO...</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center flex flex-col items-center gap-6">
        <p className="text-[#737373] font-mono text-sm">Todavía no hay proyectos enviados.</p>
        <p className="text-[#525252] text-[14px]">Sé el primero en mostrar lo que construiste.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#262626]">
      {projects.map((s: any) => (
        <div key={s.id} className="bg-black p-8 flex flex-col gap-4 group">
          <a href={s.live_url} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden bg-[#111]">
            <img
              src={getScreenshot(s.live_url)}
              alt={s.project_name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          </a>
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[20px] font-light text-white leading-tight">{s.project_name}</h2>
              <span className="font-mono text-[10px] text-[#525252] border border-[#262626] px-2 py-1 whitespace-nowrap mt-1">{s.track}</span>
            </div>
            <p className="text-[14px] text-[#737373] leading-[1.6] line-clamp-3">{s.description}</p>
            <p className="font-mono text-[11px] text-[#525252] mt-auto pt-2">por {s.your_name}</p>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-[#1a1a1a]">
            <a href={s.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[11px] text-[#737373] hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" /> Ver proyecto
            </a>
            {s.github_url && (
              <a href={s.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[11px] text-[#737373] hover:text-white transition-colors">
                <Github className="w-3 h-3" /> GitHub
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ZeroToAgentPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<"enviar" | "showcase">("showcase")
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      const isBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10
      setIsAtBottom(isBottom)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTabs = () => {
    tabsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">

      {/* ── Fixed Header ─────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-0 py-8 lg:py-[49px]">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-[18px] group cursor-pointer">
              <img src={logos.v0 || "/placeholder.svg"} alt="v0" className="h-[24px] w-[50px] transition-opacity duration-300 group-hover:opacity-80" />
              <span className="font-mono text-[12px] text-[#737373] tracking-[2.4px] [text-shadow:0px_0px_4px_black] transition-colors duration-300 group-hover:text-white">
                ZERO TO AGENT
              </span>
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab("enviar"); scrollToTabs() }}
                className="font-mono text-[12px] text-[#737373] tracking-[2px] hover:text-white transition-colors px-4 py-2 border border-transparent hover:border-[#333] rounded-full"
              >
                ENVIAR
              </button>
              <button
                onClick={() => { setActiveTab("showcase"); scrollToTabs() }}
                className="font-mono text-[12px] text-[#737373] tracking-[2px] hover:text-white transition-colors px-4 py-2 border border-transparent hover:border-[#333] rounded-full"
              >
                SHOWCASE
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative h-dvh lg:h-[948px] flex flex-col items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1500 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <Dithering colorBack="#000000" colorFront="#99999921" shape="warp" type="4x4" size={2.5} speed={0.45} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[204px] bg-gradient-to-b from-transparent to-black pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1383px] px-6 lg:px-0 flex flex-col gap-[30px]">
          <div className="px-0 lg:px-5 overflow-hidden">
            <p className={`font-mono text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              SANTIAGO DE CHILE · 2 DE MAYO DE 2026
            </p>
          </div>
          <h1 className="text-[60px] md:text-[100px] lg:text-[137px] font-normal leading-[1] lg:leading-[110px] tracking-[-0.04em] lg:tracking-[-5.48px] text-white">
            <span className={`block overflow-hidden transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>Zero </span>
            <span className={`block pb-4 transition-all duration-1000 delay-700 font-pixel ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>to Agent</span>
          </h1>

          {/* Tabs en el hero */}
          <div className={`px-0 lg:px-5 flex items-center gap-3 transition-all duration-1000 delay-900 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <button
              onClick={() => { setActiveTab("showcase"); scrollToTabs() }}
              className={`font-mono text-[13px] tracking-[2px] px-6 py-3 border transition-all duration-300 ${activeTab === "showcase" ? "border-white text-white bg-white/5" : "border-[#333] text-[#737373] hover:border-white/50 hover:text-white"}`}
            >
              SHOWCASE
            </button>
            <button
              onClick={() => { setActiveTab("enviar"); scrollToTabs() }}
              className={`font-mono text-[13px] tracking-[2px] px-6 py-3 border transition-all duration-300 ${activeTab === "enviar" ? "border-white text-white bg-white/5" : "border-[#333] text-[#737373] hover:border-white/50 hover:text-white"}`}
            >
              ENVIAR MI PROYECTO
            </button>
          </div>
        </div>
      </section>

      {/* ── Tabs section ─────────────────────────────────────────────────────── */}
      <div ref={tabsRef} className="mx-auto max-w-[1400px] bg-black">

        {/* Tab bar */}
        <div className="border-t border-[#262626] px-6 lg:px-16 flex items-center gap-0">
          {(["showcase", "enviar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-mono text-[13px] tracking-[2px] py-5 px-6 border-b-2 transition-all duration-300 ${
                activeTab === tab
                  ? "text-white border-white"
                  : "text-[#737373] border-transparent hover:text-[#999]"
              }`}
            >
              {tab === "showcase" ? "SHOWCASE" : "ENVIAR MI PROYECTO"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="border-t border-[#262626]">
          {activeTab === "showcase" ? (
            <ShowcaseTab />
          ) : (
            <div className="py-16">
              <LocalSubmissionForm ciudad="santiago" />
            </div>
          )}
        </div>

        {/* Sponsors */}
        <section className="border-t border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] lg:self-start">
            <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">CON EL APOYO DE</p>
          </div>
          <div className="w-full lg:w-[685px] flex flex-wrap">
            {zeroToAgentSponsors.map((sponsor, index) => (
              <SponsorCard key={index} sponsor={sponsor as Sponsor} />
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="border-t border-[#262626] px-6 lg:px-16 py-16 lg:py-24 flex flex-col gap-12 lg:gap-16">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-light leading-[1.3] lg:leading-[56px] tracking-[-0.02em] text-white max-w-[900px]">
            Del evento: developers construyendo con IA, demos y shipeando en tiempo real.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg group cursor-zoom-in ${index === 1 ? "md:mt-12 lg:mt-16" : index === 2 ? "md:-mt-4 lg:-mt-8" : ""}`}
                onClick={() => setLightboxIndex(index)}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxIndex(index) } }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="object-cover w-full h-full grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                </div>
              </div>
            ))}
            {lightboxIndex !== null && (
              <ImageLightbox src={galleryImages[lightboxIndex].src} alt={galleryImages[lightboxIndex].alt} width={galleryImages[lightboxIndex].width} height={galleryImages[lightboxIndex].height} isOpen={true} onClose={() => setLightboxIndex(null)} />
            )}
          </div>
        </section>
      </div>

      {/* Fixed bottom gradient */}
      <div className={`fixed bottom-0 left-0 right-0 h-[120px] pointer-events-none z-40 transition-opacity duration-500 ${isAtBottom ? "opacity-0" : "opacity-100"}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  )
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const { assetType, logo, name, height, url } = sponsor
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="contents">
      <div className="relative w-full sm:w-[calc(50%-0.5px)] lg:w-[342px] h-[140px] lg:h-[173px] border border-[#262626] p-6 lg:p-8 flex flex-col items-center justify-center -mr-px -mb-px group cursor-pointer transition-all duration-700 hover:bg-white/[0.03] hover:border-[#404040]">
        <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 translate-x-2 -translate-y-2 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
        {assetType === "svg" || assetType === "remote" ? (
          <img src={logo || "/placeholder.svg"} alt={name} className="w-auto max-w-[184px] transition-opacity duration-300 group-hover:opacity-80" style={{ height: height || "auto" }} />
        ) : (
          <Image src={logo || "/placeholder.svg"} alt={name} width={184} height={height || 50} className="w-auto max-w-[184px] transition-opacity duration-300 group-hover:opacity-80" style={{ height: height || "auto" }} />
        )}
      </div>
    </a>
  )
}
