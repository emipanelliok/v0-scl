"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"
import { X, Download } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  width: number
  height: number
  isOpen: boolean
  onClose: () => void
}

export function ImageLightbox({
  src,
  alt,
  width,
  height,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const filename = alt.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase() + ".png"
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(src, "_blank")
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300 cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded view of: ${alt}`}
    >
      {/* Top bar with actions */}
      <div className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-end gap-2 p-4 lg:p-6">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-mono text-[12px] tracking-[2px] text-[#999] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
          aria-label="Download image"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">DOWNLOAD</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="flex items-center justify-center rounded-full bg-white/10 p-2 text-[#999] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] animate-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto max-h-[85vh] w-auto max-w-[90vw] rounded-lg object-contain"
          priority
        />
      </div>
    </div>
  )
}
