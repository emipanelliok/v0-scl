"use client"

import { useEffect, useState } from "react"
import { logos } from "@/lib/data"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LocalSubmissionForm from "@/components/local-submission-form"

export default function EnviarPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-0 py-8 lg:py-[49px]">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-[18px] group">
              <img src={logos.v0 || "/placeholder.svg"} alt="v0" className="h-[24px] w-[50px] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[12px] text-[#737373] tracking-[2.4px] group-hover:text-white transition-colors">ZERO TO AGENT</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 font-mono text-[12px] text-[#737373] hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              VOLVER
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-40 pb-12 mx-auto max-w-[1400px] px-6 lg:px-16">
        <p className="font-mono text-[12px] text-[#525252] tracking-[2.4px] mb-6">SANTIAGO DE CHILE · 2 DE MAYO DE 2026</p>
        <h1 className="text-[52px] lg:text-[80px] font-light leading-[1.05] tracking-[-0.04em] text-white mb-4">
          Enviá tu proyecto
        </h1>
        <p className="text-[18px] text-[#737373] font-light mb-16 max-w-[600px]">
          Compartí lo que construiste durante el evento. Los organizadores locales van a elegir los ganadores.
        </p>
      </div>

      <LocalSubmissionForm ciudad="santiago" />
    </div>
  )
}
