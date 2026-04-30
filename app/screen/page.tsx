"use client"

import { Dithering } from "@paper-design/shaders-react"
import { useEffect, useState } from "react"
import Image from "next/image"

const QR_BASE = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=ffffff&bgcolor=000000&data="

const qrItems = [
  {
    label: "Créditos v0",
    url: "https://zerotoagent.dev/event/8TB-4FRmxo8NO8YK",
  },
  {
    label: "Recursos",
    url: "https://vercel.notion.site/02agentresources",
  },
  {
    label: "Showcase",
    url: "https://community.vercel.com/hackathons/zero-to-agent/showcase",
  },
]

export default function ScreenPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white flex flex-col items-center justify-between pt-12 pb-12 px-12">

      {/* Dithering background */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}>
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

      {/* Gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent to-black pointer-events-none" />

      {/* Header */}
      <div className={`relative z-10 flex items-center gap-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <img src="/v0-logo.svg" alt="v0" className="h-6 w-auto" />
        <span className="font-mono text-xs text-[#737373] tracking-[2.4px]">ZERO TO AGENT</span>
      </div>

      {/* Main title */}
      <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="font-mono text-sm text-[#737373] tracking-[2.8px]">SANTIAGO DE CHILE · 2 DE MAYO DE 2026</p>
        <h1 className="text-[100px] lg:text-[130px] font-normal leading-none tracking-[-5px] text-white text-center">
          Zero <span className="font-pixel">to Agent</span>
        </h1>

        {/* Logos */}
        <div className="flex items-center gap-10 mt-2">
          <img src="/sponsors/vercel.svg" alt="Vercel" className="h-7 w-auto opacity-80" />
          <div className="w-px h-5 bg-[#333]" />
          <img src="/sponsors/aiwknd.svg" alt="AI Weekend" className="h-9 w-auto opacity-80" />
        </div>
      </div>

      {/* QR Codes */}
      <div className={`relative z-10 flex items-end gap-16 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {qrItems.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-4">
            <div className="border border-[#333] p-3 bg-black/60 backdrop-blur-sm">
              <Image
                src={`${QR_BASE}${encodeURIComponent(item.url)}`}
                alt={item.label}
                width={200}
                height={200}
                className="block"
                unoptimized
              />
            </div>
            <p className="font-mono text-sm text-[#737373] tracking-[2px] uppercase">{item.label}</p>
          </div>
        ))}
      </div>

      {/* WiFi */}
      <div className={`relative z-10 flex items-center gap-6 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <span className="font-mono text-[36px] text-[#737373] tracking-[2px]">RED <span className="text-white font-semibold">CasaWork</span></span>
        <div className="w-px h-8 bg-[#444]" />
        <span className="font-mono text-[36px] text-[#737373] tracking-[2px]">CLAVE <span className="text-white font-semibold">Casa.2025</span></span>
      </div>

    </div>
  )
}
