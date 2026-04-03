"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import JSZip from "jszip"
import {
  Upload,
  Download,
  Trash2,
  RotateCcw,
  Save,
  Settings2,
  ImageIcon,
  Video,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  Maximize2,
} from "lucide-react"
import Link from "next/link"

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdjustmentPreset {
  name: string
  saturation: number
  contrast: number
  brightness: number
  grain: number
  vignette: number
}

interface MediaFile {
  id: string
  file: File
  type: "image" | "video"
  originalUrl: string
  processedUrl: string | null
  processing: boolean
  width: number
  height: number
}

const DEFAULT_ADJUSTMENTS: AdjustmentPreset = {
  name: "Default",
  saturation: 0,
  contrast: 10,
  brightness: 0,
  grain: 0,
  vignette: 30,
}

const BUILT_IN_PRESETS: AdjustmentPreset[] = [
  { ...DEFAULT_ADJUSTMENTS },
  { name: "High Contrast B&W", saturation: 0, contrast: 40, brightness: 5, grain: 20, vignette: 40 },
  { name: "Film Noir", saturation: 0, contrast: 25, brightness: -10, grain: 35, vignette: 60 },
  { name: "Soft Matte", saturation: 0, contrast: 5, brightness: 10, grain: 10, vignette: 15 },
  { name: "Gritty Documentary", saturation: 0, contrast: 30, brightness: -5, grain: 50, vignette: 45 },
]

// ─── Logo SVG paths (extracted from project SVGs) ────────────────────────────

// Vercel triangle
function drawVercelTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save()
  ctx.fillStyle = "white"
  ctx.beginPath()
  ctx.moveTo(x + size / 2, y)
  ctx.lineTo(x + size, y + size * 0.873)
  ctx.lineTo(x, y + size * 0.873)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// Slash separator
function drawSlash(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
  ctx.save()
  ctx.strokeStyle = "rgba(255,255,255,0.4)"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x + height * 0.3, y)
  ctx.lineTo(x, y + height)
  ctx.stroke()
  ctx.restore()
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function BatchProcessor() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [adjustments, setAdjustments] = useState<AdjustmentPreset>({ ...DEFAULT_ADJUSTMENTS })
  const [customPresets, setCustomPresets] = useState<AdjustmentPreset[]>([])
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false)
  const [savePresetOpen, setSavePresetOpen] = useState(false)
  const [newPresetName, setNewPresetName] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Logo image refs
  const v0LogoRef = useRef<HTMLImageElement | null>(null)
  const labLogoRef = useRef<HTMLImageElement | null>(null)

  // Load logos on mount
  useEffect(() => {
    const v0Img = new Image()
    v0Img.crossOrigin = "anonymous"
    v0Img.src = "/v0-logo.svg"
    v0Img.onload = () => { v0LogoRef.current = v0Img }

    const labImg = new Image()
    labImg.crossOrigin = "anonymous"
    labImg.src = "/sponsors/the-lab.svg"
    labImg.onload = () => { labLogoRef.current = labImg }

    // Load custom presets from localStorage
    try {
      const saved = localStorage.getItem("batch-processor-presets")
      if (saved) setCustomPresets(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  // Save custom presets to localStorage
  useEffect(() => {
    if (customPresets.length > 0) {
      localStorage.setItem("batch-processor-presets", JSON.stringify(customPresets))
    }
  }, [customPresets])

  // ─── File handling ───────────────────────────────────────────────────────

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: MediaFile[] = []

    Array.from(fileList).forEach((file) => {
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      if (!isImage && !isVideo) return

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const url = URL.createObjectURL(file)

      const mediaFile: MediaFile = {
        id,
        file,
        type: isImage ? "image" : "video",
        originalUrl: url,
        processedUrl: null,
        processing: false,
        width: 0,
        height: 0,
      }

      // Get dimensions
      if (isImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, width: img.naturalWidth, height: img.naturalHeight } : f))
          )
        }
        img.src = url
      } else {
        const video = document.createElement("video")
        video.onloadedmetadata = () => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, width: video.videoWidth, height: video.videoHeight } : f))
          )
        }
        video.src = url
      }

      newFiles.push(mediaFile)
    })

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  // ─── Image processing ───────────────────────────────────────────────────

  const processImage = useCallback(
    (mediaFile: MediaFile): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) return reject("No canvas")

          const w = img.naturalWidth
          const h = img.naturalHeight
          canvas.width = w
          canvas.height = h

          const ctx = canvas.getContext("2d")
          if (!ctx) return reject("No ctx")

          // Draw original image
          ctx.drawImage(img, 0, 0, w, h)

          // Apply adjustments
          applyAdjustments(ctx, w, h, adjustments)

          // Draw branded overlay
          drawOverlay(ctx, w, h)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(URL.createObjectURL(blob))
              } else {
                reject("Failed to export")
              }
            },
            "image/png",
            1
          )
        }
        img.onerror = () => reject("Failed to load image")
        img.src = mediaFile.originalUrl
      })
    },
    [adjustments]
  )

  const processVideo = useCallback(
    (mediaFile: MediaFile): Promise<string> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video")
        video.crossOrigin = "anonymous"
        video.playsInline = true

        video.onloadeddata = async () => {
          const w = video.videoWidth
          const h = video.videoHeight

          const canvas = document.createElement("canvas")
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext("2d")
          if (!ctx) return reject("No ctx")

          // ── Capture audio from the source video ──
          // Route audio through AudioContext so it's captured but not played aloud
          let audioCtx: AudioContext | null = null
          let audioDest: MediaStreamAudioDestinationNode | null = null
          try {
            audioCtx = new AudioContext()
            const source = audioCtx.createMediaElementSource(video)
            audioDest = audioCtx.createMediaStreamDestination()
            source.connect(audioDest)
            // Not connecting to audioCtx.destination keeps speakers silent
          } catch {
            // If AudioContext fails, proceed without audio
            audioCtx = null
            audioDest = null
          }

          // ── Pre-render static overlays once (reused every frame) ──

          // Branded overlay (logos, gradient, text)
          const overlayCanvas = document.createElement("canvas")
          overlayCanvas.width = w
          overlayCanvas.height = h
          const overlayCtx = overlayCanvas.getContext("2d")!
          drawOverlay(overlayCtx, w, h)

          // Vignette overlay
          let vignetteCanvas: HTMLCanvasElement | null = null
          if (adjustments.vignette > 0) {
            vignetteCanvas = document.createElement("canvas")
            vignetteCanvas.width = w
            vignetteCanvas.height = h
            const vigCtx = vignetteCanvas.getContext("2d")!
            const cx = w / 2
            const cy = h / 2
            const radius = Math.sqrt(cx * cx + cy * cy)
            const gradient = vigCtx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius)
            gradient.addColorStop(0, "rgba(0,0,0,0)")
            gradient.addColorStop(1, `rgba(0,0,0,${adjustments.vignette / 100})`)
            vigCtx.fillStyle = gradient
            vigCtx.fillRect(0, 0, w, h)
          }

          // Grain textures (pre-generate a few for animated grain effect)
          const grainTextures: HTMLCanvasElement[] = []
          if (adjustments.grain > 0) {
            const GRAIN_TEXTURE_COUNT = 3
            for (let t = 0; t < GRAIN_TEXTURE_COUNT; t++) {
              const gc = document.createElement("canvas")
              gc.width = w
              gc.height = h
              const gctx = gc.getContext("2d")!
              const grainData = gctx.createImageData(w, h)
              const gd = grainData.data
              for (let i = 0; i < gd.length; i += 4) {
                const noise = Math.random() * 255
                gd[i] = noise
                gd[i + 1] = noise
                gd[i + 2] = noise
                gd[i + 3] = 255
              }
              gctx.putImageData(grainData, 0, 0)
              grainTextures.push(gc)
            }
          }

          // Build CSS filter string — GPU-accelerated color adjustments
          // instead of per-pixel getImageData/putImageData manipulation
          const filters: string[] = []
          // saturation: 0 = grayscale, 100 = normal (matches original behavior)
          filters.push(`saturate(${adjustments.saturation / 100})`)
          if (adjustments.contrast !== 0) {
            filters.push(`contrast(${1 + adjustments.contrast / 50})`)
          }
          if (adjustments.brightness !== 0) {
            filters.push(`brightness(${1 + adjustments.brightness / 50})`)
          }
          const filterString = filters.join(" ")

          // ── Recording setup ──
          const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
            ? "video/mp4;codecs=avc1"
            : MediaRecorder.isTypeSupported("video/mp4")
              ? "video/mp4"
              : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
                ? "video/webm;codecs=vp9"
                : "video/webm"

          // 30fps matches most source video and halves frame budget vs 60fps
          const canvasStream = canvas.captureStream(30)

          // Combine canvas video track with captured audio track
          const combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...(audioDest ? audioDest.stream.getAudioTracks() : []),
          ])

          const recorder = new MediaRecorder(combinedStream, {
            mimeType,
            videoBitsPerSecond: 12_000_000,
          })
          const chunks: Blob[] = []

          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data)
          }

          recorder.onstop = () => {
            // Clean up audio context
            if (audioCtx) audioCtx.close()
            const blob = new Blob(chunks, { type: mimeType })
            resolve(URL.createObjectURL(blob))
          }

          recorder.start(100)
          video.play()

          let stopped = false
          let frameCount = 0

          // Composites one frame using only fast drawImage calls (no pixel loops)
          const renderFrame = () => {
            // 1. Draw video frame with CSS filter applied (GPU-accelerated)
            ctx.filter = filterString
            ctx.drawImage(video, 0, 0, w, h)
            ctx.filter = "none"

            // 2. Grain (animated by cycling pre-rendered textures)
            if (grainTextures.length > 0) {
              ctx.globalCompositeOperation = "overlay"
              ctx.globalAlpha = (adjustments.grain / 100) * 0.5
              ctx.drawImage(grainTextures[frameCount % grainTextures.length], 0, 0)
              ctx.globalCompositeOperation = "source-over"
              ctx.globalAlpha = 1
            }

            // 3. Vignette
            if (vignetteCanvas) {
              ctx.drawImage(vignetteCanvas, 0, 0)
            }

            // 4. Branded overlay
            ctx.drawImage(overlayCanvas, 0, 0)

            frameCount++
          }

          const loop = () => {
            if (stopped || video.ended || video.paused) {
              if (!stopped) {
                stopped = true
                renderFrame()
                setTimeout(() => recorder.stop(), 200)
              }
              return
            }

            renderFrame()
            requestAnimationFrame(loop)
          }

          requestAnimationFrame(loop)

          video.onended = () => {
            if (!stopped) {
              stopped = true
              renderFrame()
              setTimeout(() => recorder.stop(), 200)
            }
          }
        }

        video.onerror = () => reject("Failed to load video")
        video.src = mediaFile.originalUrl
      })
    },
    [adjustments]
  )

  // ─── Adjustments ────────────────────────────────────────────────────────

  function applyAdjustments(ctx: CanvasRenderingContext2D, w: number, h: number, adj: AdjustmentPreset) {
    // Get image data for pixel manipulation
    const imageData = ctx.getImageData(0, 0, w, h)
    const data = imageData.data

    const contrastFactor = (259 * (adj.contrast * 2.55 + 255)) / (255 * (259 - adj.contrast * 2.55))
    const brightnessDelta = adj.brightness * 2.55

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i]
      let g = data[i + 1]
      let b = data[i + 2]

      // Desaturation (grayscale blend)
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      const satFactor = adj.saturation / 100
      r = gray + (r - gray) * satFactor
      g = gray + (g - gray) * satFactor
      b = gray + (b - gray) * satFactor

      // Contrast
      r = contrastFactor * (r - 128) + 128
      g = contrastFactor * (g - 128) + 128
      b = contrastFactor * (b - 128) + 128

      // Brightness
      r += brightnessDelta
      g += brightnessDelta
      b += brightnessDelta

      data[i] = Math.max(0, Math.min(255, r))
      data[i + 1] = Math.max(0, Math.min(255, g))
      data[i + 2] = Math.max(0, Math.min(255, b))
    }

    // Grain
    if (adj.grain > 0) {
      const grainIntensity = adj.grain * 1.2
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainIntensity
        data[i] = Math.max(0, Math.min(255, data[i] + noise))
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Vignette (drawn as overlay)
    if (adj.vignette > 0) {
      const cx = w / 2
      const cy = h / 2
      const radius = Math.sqrt(cx * cx + cy * cy)
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius)
      gradient.addColorStop(0, "rgba(0,0,0,0)")
      gradient.addColorStop(1, `rgba(0,0,0,${adj.vignette / 100})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)
    }
  }

  function drawOverlay(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Scale factor based on image size
    const scale = Math.min(w, h) / 1000

    // ── Bottom gradient ──
    const gradientHeight = h * 0.45
    const gradient = ctx.createLinearGradient(0, h - gradientHeight, 0, h)
    gradient.addColorStop(0, "rgba(0,0,0,0)")
    gradient.addColorStop(0.5, "rgba(0,0,0,0.5)")
    gradient.addColorStop(1, "rgba(0,0,0,0.95)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, h - gradientHeight, w, gradientHeight)

    // ── Bottom-left: Vercel triangle / v0 logo + text (stacked vertically) ──
    const padding = 40 * scale
    const logoSize = 32 * scale
    const bottomY = h - padding

    // Position stack at the bottom and work upward
    // Text block: 2 lines
    ctx.fillStyle = "white"
    ctx.font = `bold ${38 * scale}px 'Geist', 'Arial', sans-serif`
    ctx.textBaseline = "bottom"
    const textLine2Y = bottomY
    const textLine1Y = bottomY - 42 * scale
    ctx.fillText("Prompt to", padding, textLine1Y)
    ctx.fillText("Prod Miami", padding, textLine2Y)

    // Logo block positioned well above text with much larger spacing
    const logoTextGap = 50 * scale
    const logoRowY = textLine1Y - logoTextGap - logoSize

    // Vercel triangle
    drawVercelTriangle(ctx, padding, logoRowY, logoSize)

    // Slash
    drawSlash(ctx, padding + logoSize + 10 * scale, logoRowY + 4 * scale, logoSize * 0.8)

    // v0 logo
    if (v0LogoRef.current) {
      const v0W = logoSize * 1.6
      const v0H = logoSize * 0.8
      ctx.drawImage(
        v0LogoRef.current,
        padding + logoSize + 10 * scale + logoSize * 0.35 + 8 * scale,
        logoRowY + 2 * scale,
        v0W,
        v0H
      )
    }

    // ── Bottom-right: The Lab Miami logo ──
    if (labLogoRef.current) {
      const labW = 120 * scale
      const labH = (labLogoRef.current.naturalHeight / labLogoRef.current.naturalWidth) * labW
      ctx.drawImage(labLogoRef.current, w - padding - labW, bottomY - labH, labW, labH)
    }
  }

  // ─── Process all ────────────────────────────────────────────────────────

  const processAll = useCallback(async () => {
    setProcessing(true)
    const toProcess = files.filter((f) => selectedFiles.size === 0 || selectedFiles.has(f.id))

    for (const mediaFile of toProcess) {
      setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, processing: true } : f)))

      try {
        const url =
          mediaFile.type === "image" ? await processImage(mediaFile) : await processVideo(mediaFile)

        setFiles((prev) =>
          prev.map((f) => (f.id === mediaFile.id ? { ...f, processedUrl: url, processing: false } : f))
        )
      } catch (err) {
        console.error("Processing error:", err)
        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, processing: false } : f)))
      }
    }

    setProcessing(false)
  }, [files, selectedFiles, processImage, processVideo])

  // ─── Download ───────────────────────────────────────────────────────────

  const [downloading, setDownloading] = useState(false)

  const downloadAll = useCallback(async () => {
    const toDownload = files.filter((f) => f.processedUrl && (selectedFiles.size === 0 || selectedFiles.has(f.id)))
    if (toDownload.length === 0) return

    // Single file — direct download, no zip needed
    if (toDownload.length === 1) {
      const f = toDownload[0]
      const a = document.createElement("a")
      a.href = f.processedUrl!
      const ext = f.type === "image" ? "png" : "mp4"
      const baseName = f.file.name.replace(/\.[^.]+$/, "")
      a.download = `${baseName}-branded.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      return
    }

    // Multiple files — bundle into a zip
    setDownloading(true)
    try {
      const zip = new JSZip()

      await Promise.all(
        toDownload.map(async (f) => {
          const ext = f.type === "image" ? "png" : (f.processedUrl!.includes("webm") ? "webm" : "mp4")
          const baseName = f.file.name.replace(/\.[^.]+$/, "")
          const fileName = `${baseName}-branded.${ext}`
          const response = await fetch(f.processedUrl!)
          const blob = await response.blob()
          zip.file(fileName, blob)
        })
      )

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "branded-assets.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Zip creation failed:", err)
    } finally {
      setDownloading(false)
    }
  }, [files, selectedFiles])

  // ─── Selection ────────────────────��─────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)))
    }
  }

  const toggleSelectMode = () => {
    setSelectMode((prev) => {
      if (prev) setSelectedFiles(new Set())
      return !prev
    })
  }

  // Lightbox navigation
  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const lightboxPrev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + files.length) % files.length : null))
  const lightboxNext = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % files.length : null))

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      else if (e.key === "ArrowLeft") lightboxPrev()
      else if (e.key === "ArrowRight") lightboxNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex, files.length])

  const removeFiles = () => {
    const toRemove = selectedFiles.size > 0 ? selectedFiles : new Set(files.map((f) => f.id))
    setFiles((prev) => {
      prev.filter((f) => toRemove.has(f.id)).forEach((f) => {
        URL.revokeObjectURL(f.originalUrl)
        if (f.processedUrl) URL.revokeObjectURL(f.processedUrl)
      })
      return prev.filter((f) => !toRemove.has(f.id))
    })
    setSelectedFiles(new Set())
  }

  // ─── Presets ────────────────────────────────────────────────────────────

  const savePreset = () => {
    if (!newPresetName.trim()) return
    const preset = { ...adjustments, name: newPresetName.trim() }
    setCustomPresets((prev) => [...prev.filter((p) => p.name !== preset.name), preset])
    setNewPresetName("")
    setSavePresetOpen(false)
  }

  const loadPreset = (preset: AdjustmentPreset) => {
    setAdjustments({ ...preset })
    setPresetDropdownOpen(false)
  }

  const deletePreset = (name: string) => {
    setCustomPresets((prev) => prev.filter((p) => p.name !== name))
  }

  const allPresets = [...BUILT_IN_PRESETS, ...customPresets]

  const processedCount = files.filter((f) => f.processedUrl).length

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <header className="border-b border-[#262626]">
        <div className="mx-auto max-w-[1400px] px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/v0-logo.svg" alt="v0" className="h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
            <span className="text-[#404040]">/</span>
            <h1 className="font-mono text-xs text-[#737373] tracking-[2px] uppercase">Batch Processor</h1>
          </div>
          <div className="flex items-center gap-3">
            {files.length > 0 && (
              <>
                <button
                  onClick={toggleSelectMode}
                  className={`font-mono text-[11px] tracking-wider transition-colors px-3 py-1.5 border flex items-center gap-2 ${
                    selectMode
                      ? "text-white border-white bg-white/10"
                      : "text-[#737373] border-[#262626] hover:border-[#404040] hover:text-white"
                  }`}
                >
                  <MousePointerClick className="w-3.5 h-3.5" />
                  {selectMode ? "EXIT SELECT" : "SELECT"}
                </button>
                {selectMode && (
                  <>
                    <button
                      onClick={selectAll}
                      className="font-mono text-[11px] text-[#737373] tracking-wider hover:text-white transition-colors px-3 py-1.5 border border-[#262626] hover:border-[#404040]"
                    >
                      {selectedFiles.size === files.length ? "DESELECT ALL" : "SELECT ALL"}
                    </button>
                    <button
                      onClick={removeFiles}
                      disabled={selectedFiles.size === 0}
                      className="font-mono text-[11px] text-[#737373] tracking-wider hover:text-red-400 transition-colors px-3 py-1.5 border border-[#262626] hover:border-red-400/30 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row">
        {/* ─── Sidebar: Controls ─── */}
        <aside className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-[#262626] lg:min-h-[calc(100vh-73px)] lg:sticky lg:top-0 lg:overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2.5 py-3 bg-white text-black font-mono text-xs tracking-wider hover:bg-neutral-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              UPLOAD FILES
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {/* Presets */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] text-[#737373] tracking-[2px]">PRESET</p>
                <button
                  onClick={() => setSavePresetOpen(!savePresetOpen)}
                  className="font-mono text-[11px] text-[#737373] tracking-wider hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3 h-3" />
                  SAVE
                </button>
              </div>

              {/* Save preset input */}
              {savePresetOpen && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && savePreset()}
                    placeholder="Preset name..."
                    className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white text-sm px-3 py-2 font-mono placeholder:text-[#404040] focus:outline-none focus:border-[#404040]"
                  />
                  <button
                    onClick={savePreset}
                    className="px-3 py-2 bg-[#262626] hover:bg-[#333] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Preset dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0a0a0a] border border-[#262626] hover:border-[#404040] transition-colors font-mono text-sm"
                >
                  <span className="text-white">{adjustments.name}</span>
                  <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {presetDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#0a0a0a] border border-[#262626] max-h-[240px] overflow-y-auto">
                    {allPresets.map((preset) => (
                      <div
                        key={preset.name}
                        className="flex items-center justify-between px-3 py-2 hover:bg-[#1a1a1a] cursor-pointer group"
                      >
                        <button
                          onClick={() => loadPreset(preset)}
                          className="flex-1 text-left font-mono text-sm text-[#a0a0a0] hover:text-white transition-colors"
                        >
                          {preset.name}
                        </button>
                        {customPresets.some((p) => p.name === preset.name) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deletePreset(preset.name)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#737373] hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Adjustment sliders */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5 text-[#737373]" />
                <p className="font-mono text-[11px] text-[#737373] tracking-[2px]">ADJUSTMENTS</p>
              </div>

              <SliderControl
                label="Saturation"
                value={adjustments.saturation}
                min={0}
                max={100}
                onChange={(v) => setAdjustments((p) => ({ ...p, saturation: v }))}
              />
              <SliderControl
                label="Contrast"
                value={adjustments.contrast}
                min={-50}
                max={50}
                onChange={(v) => setAdjustments((p) => ({ ...p, contrast: v }))}
              />
              <SliderControl
                label="Brightness"
                value={adjustments.brightness}
                min={-50}
                max={50}
                onChange={(v) => setAdjustments((p) => ({ ...p, brightness: v }))}
              />
              <SliderControl
                label="Grain"
                value={adjustments.grain}
                min={0}
                max={100}
                onChange={(v) => setAdjustments((p) => ({ ...p, grain: v }))}
              />
              <SliderControl
                label="Vignette"
                value={adjustments.vignette}
                min={0}
                max={100}
                onChange={(v) => setAdjustments((p) => ({ ...p, vignette: v }))}
              />

              <button
                onClick={() => setAdjustments({ ...DEFAULT_ADJUSTMENTS })}
                className="flex items-center gap-2 font-mono text-[11px] text-[#737373] tracking-wider hover:text-white transition-colors self-start mt-1"
              >
                <RotateCcw className="w-3 h-3" />
                RESET
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[#262626]">
              <button
                onClick={processAll}
                disabled={files.length === 0 || processing}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-white text-black font-mono text-xs tracking-wider hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {processing ? "PROCESSING..." : `PROCESS ${selectedFiles.size > 0 ? selectedFiles.size : files.length > 0 ? "ALL" : ""} FILES`}
              </button>
              <button
                onClick={downloadAll}
                disabled={processedCount === 0 || downloading}
                className="w-full flex items-center justify-center gap-2.5 py-3 border border-[#262626] text-white font-mono text-xs tracking-wider hover:bg-[#0a0a0a] hover:border-[#404040] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {downloading ? "ZIPPING..." : `DOWNLOAD ${processedCount > 0 ? `(${processedCount})` : "ALL"}`}
              </button>
            </div>

            {/* Stats */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-3 border-t border-[#262626]">
                <Stat label="TOTAL" value={files.length} />
                <Stat label="IMAGES" value={files.filter((f) => f.type === "image").length} />
                <Stat label="VIDEOS" value={files.filter((f) => f.type === "video").length} />
                <Stat label="PROCESSED" value={processedCount} />
              </div>
            )}
          </div>
        </aside>

        {/* ─── Main content: File grid ─── */}
        <main className="flex-1 p-6">
          {files.length === 0 ? (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="h-[calc(100vh-73px-48px)] flex flex-col items-center justify-center border border-dashed border-[#262626] hover:border-[#404040] cursor-pointer transition-colors group"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 flex items-center justify-center border border-[#262626] group-hover:border-[#404040] transition-colors">
                  <Upload className="w-6 h-6 text-[#404040] group-hover:text-[#737373] transition-colors" />
                </div>
                <div>
                  <p className="font-mono text-sm text-[#737373]">
                    Drop images or videos here
                  </p>
                  <p className="font-mono text-[11px] text-[#404040] mt-1">
                    JPG, PNG, WebP, GIF, MP4, MOV, WebM
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#262626]"
            >
              {files.map((file, index) => (
                <FileCard
                  key={file.id}
                  file={file}
                  selected={selectedFiles.has(file.id)}
                  selectMode={selectMode}
                  onToggle={() => toggleSelect(file.id)}
                  onOpen={() => openLightbox(index)}
                />
              ))}
              {/* Add more button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-black aspect-[4/3] flex flex-col items-center justify-center gap-3 hover:bg-[#0a0a0a] transition-colors group"
              >
                <Upload className="w-5 h-5 text-[#404040] group-hover:text-[#737373] transition-colors" />
                <span className="font-mono text-[11px] text-[#404040] group-hover:text-[#737373] tracking-wider transition-colors">
                  ADD MORE
                </span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ─── Lightbox modal ─── */}
      {lightboxIndex !== null && files[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#737373] tracking-wider">
                {lightboxIndex + 1} / {files.length}
              </span>
              <span className="font-mono text-[11px] text-[#a0a0a0] tracking-wide truncate max-w-[240px]">
                {files[lightboxIndex].file.name}
              </span>
              {files[lightboxIndex].processedUrl && (
                <span className="font-mono text-[9px] text-black bg-white px-1.5 py-0.5 tracking-wider">
                  PROCESSED
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="w-10 h-10 flex items-center justify-center border border-[#262626] hover:border-[#404040] hover:bg-[#0a0a0a] transition-colors"
            >
              <X className="w-5 h-5 text-[#737373]" />
            </button>
          </div>

          {/* Navigation: Left */}
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                lightboxPrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center border border-[#262626] hover:border-[#404040] hover:bg-[#0a0a0a] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#a0a0a0]" />
            </button>
          )}

          {/* Navigation: Right */}
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                lightboxNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center border border-[#262626] hover:border-[#404040] hover:bg-[#0a0a0a] transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-[#a0a0a0]" />
            </button>
          )}

          {/* Content */}
          <div
            className="max-w-[90vw] max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {files[lightboxIndex].type === "image" ? (
              <img
                src={files[lightboxIndex].processedUrl || files[lightboxIndex].originalUrl}
                alt={files[lightboxIndex].file.name}
                className="max-w-full max-h-[80vh] object-contain"
              />
            ) : (
              <video
                src={files[lightboxIndex].processedUrl || files[lightboxIndex].originalUrl}
                className="max-w-full max-h-[80vh] object-contain"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-[#404040] tracking-wider flex items-center gap-1.5">
                {files[lightboxIndex].type === "image" ? (
                  <ImageIcon className="w-3 h-3" />
                ) : (
                  <Video className="w-3 h-3" />
                )}
                {files[lightboxIndex].width > 0 &&
                  `${files[lightboxIndex].width} x ${files[lightboxIndex].height}`}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#404040] tracking-wider">
              ESC to close / Arrow keys to navigate
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-[#a0a0a0] tracking-wide">{label}</span>
        <span className="font-mono text-[11px] text-[#737373] tabular-nums w-8 text-right">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-[#262626] cursor-pointer accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  )
}

function FileCard({
  file,
  selected,
  selectMode,
  onToggle,
  onOpen,
}: {
  file: MediaFile
  selected: boolean
  selectMode: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  const displayUrl = file.processedUrl || file.originalUrl

  const handleClick = () => {
    if (selectMode) {
      onToggle()
    } else {
      onOpen()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`relative bg-black aspect-[4/3] overflow-hidden cursor-pointer group transition-all ${
        selected ? "ring-2 ring-white ring-inset" : ""
      }`}
    >
      {/* Thumbnail */}
      {file.type === "image" ? (
        <img
          src={displayUrl}
          alt={file.file.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={displayUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
          autoPlay
        />
      )}

      {/* Processing overlay */}
      {file.processing && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <span className="inline-block w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

      {/* Select checkbox - only visible in select mode */}
      {selectMode && (
        <div
          className={`absolute top-3 left-3 w-5 h-5 border flex items-center justify-center transition-all ${
            selected ? "bg-white border-white" : "border-[#737373]"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-black" />}
        </div>
      )}

      {/* Expand icon - visible on hover in view mode */}
      {!selectMode && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 flex items-center justify-center bg-black/60 backdrop-blur-sm border border-[#404040]">
            <Maximize2 className="w-3.5 h-3.5 text-[#a0a0a0]" />
          </div>
        </div>
      )}

      {/* File type badge */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {file.processedUrl && (
          <span className="font-mono text-[9px] text-black bg-white px-1.5 py-0.5 tracking-wider">
            DONE
          </span>
        )}
        <span className="font-mono text-[9px] text-[#a0a0a0] bg-black/60 backdrop-blur-sm px-1.5 py-0.5 tracking-wider flex items-center gap-1">
          {file.type === "image" ? <ImageIcon className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
          {file.width > 0 && `${file.width}x${file.height}`}
        </span>
      </div>

      {/* File name */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="font-mono text-[10px] text-[#a0a0a0] truncate">{file.file.name}</p>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[9px] text-[#404040] tracking-[1.5px]">{label}</span>
      <span className="font-mono text-lg text-white tabular-nums">{value}</span>
    </div>
  )
}
