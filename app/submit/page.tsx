"use client"

import { useEffect, useState } from "react"
import { logos } from "@/lib/data"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import SubmissionForm from "@/components/submission-form"

export default function SubmitPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
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
                  SUBMIT
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/get-started"
                className="group flex items-center gap-2 text-[14px] text-[#737373] hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back to Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="pt-32" />

      {/* Shared Submission Form */}
      <SubmissionForm />
    </div>
  )
}
