"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import type { GalleryItem } from "@/lib/gallery-data"

interface MediaLightboxProps {
  items: GalleryItem[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function MediaLightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}: MediaLightboxProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const currentItem = items[currentIndex]

  const goNext = useCallback(() => {
    if (isAnimating) return
    setDirection("left")
    setIsAnimating(true)
    setTimeout(() => {
      onIndexChange((currentIndex + 1) % items.length)
      setDirection(null)
      setIsAnimating(false)
    }, 200)
  }, [currentIndex, items.length, onIndexChange, isAnimating])

  const goPrev = useCallback(() => {
    if (isAnimating) return
    setDirection("right")
    setIsAnimating(true)
    setTimeout(() => {
      onIndexChange((currentIndex - 1 + items.length) % items.length)
      setDirection(null)
      setIsAnimating(false)
    }, 200)
  }, [currentIndex, items.length, onIndexChange, isAnimating])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    },
    [onClose, goPrev, goNext]
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

  // Pause video when navigating away
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [currentIndex])

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null)
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    const distanceX = touchStartX - touchEndX
    const minSwipeDistance = 50
    if (Math.abs(distanceX) >= minSwipeDistance) {
      if (distanceX > 0) goNext()
      else goPrev()
    }
    setTouchStartX(null)
    setTouchStartY(null)
    setTouchEndX(null)
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentItem) return
    try {
      const response = await fetch(currentItem.src)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const ext = currentItem.type === "video" ? "mp4" : "png"
      link.download = `v0-miami-${currentIndex + 1}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      window.open(currentItem.src, "_blank")
    }
  }

  if (!isOpen || !currentItem) return null

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
    >
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-between p-4 lg:p-6">
        <span className="font-mono text-[12px] text-[#737373] tracking-[2px] select-none">
          {currentIndex + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-mono text-[12px] tracking-[2px] text-[#999] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
            aria-label="Download"
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
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="fixed left-2 lg:left-6 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center rounded-full bg-white/10 p-2 lg:p-3 text-[#999] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="fixed right-2 lg:right-6 top-1/2 -translate-y-1/2 z-[110] flex items-center justify-center rounded-full bg-white/10 p-2 lg:p-3 text-[#999] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </>
      )}

      {/* Media content */}
      <div
        className={`relative max-h-[85vh] max-w-[90vw] cursor-default transition-all duration-200 ${
          direction === "left"
            ? "opacity-0 -translate-x-8"
            : direction === "right"
              ? "opacity-0 translate-x-8"
              : "opacity-100 translate-x-0 animate-in fade-in zoom-in-95 duration-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === "video" ? (
          <video
            ref={videoRef}
            key={currentItem.src}
            src={currentItem.src}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={currentItem.src}
            src={currentItem.src}
            alt={`Event photo ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            draggable={false}
          />
        )}
      </div>
    </div>
  )
}
