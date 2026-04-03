"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Bookmark,
  ThumbsUp,
  MessageSquare,
  Share,
  Send,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const socialLinks = {
  linkedin: {
    vercel: "https://www.linkedin.com/company/vercel/",
    v0: "https://www.linkedin.com/company/v0dev/",
  },
  x: {
    vercel: "https://x.com/vercel",
    v0: "https://x.com/v0",
  },
}

const globalCategoryOptions = [
  { id: "gtm", label: "GTM" },
  { id: "marketing", label: "Marketing" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "data-ops", label: "Data & Ops" },
  { id: "engineering", label: "Engineering" },
]

const localCategoryOptions = [
  {
    id: "kurzo",
    label: "Kurzo Challenge",
    description:
      "Build a tool that turns unstructured input into organized, actionable output \u2014 notes, voice, images, URLs, files. Surface themes, priorities, and next steps.",
  },
  {
    id: "basement",
    label: "Basement Challenge",
    description:
      "Build an application powered by OpenClaw. A tool, agent, workflow, or product where OpenClaw meaningfully drives behavior, decisions, or outcomes.",
  },
  {
    id: "gail",
    label: "Gail Challenge",
    description:
      "Build an AI-agent system that turns messy conversation history into evolving behavioral profiles, then uses them live in conversation.",
  },
]

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubmissionData {
  projectName: string
  liveUrl: string
  v0ProjectUrl: string
  githubRepoUrl: string
  globalCategories: string[]
  localCategories: string[]
  yourName: string
  v0Username: string
  email: string
  description: string
  socialProofLink: string
}

interface TypeformSubmitProps {
  onSubmit?: (data: SubmissionData) => void
  /** When true, hides outer chrome — used when embedded inside a deck slide */
  embedded?: boolean
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const stepVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const transition = {
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
}

const TOTAL_STEPS = 13

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Returns an error message for the current step, or null if valid. */
function validateStep(
  step: number,
  fields: {
    projectName: string
    liveUrl: string
    v0ProjectUrl: string
    githubRepoUrl: string
    hasPosted: boolean
    socialProofLink: string
    globalCategories: string[]
    localCategories: string[]
    yourName: string
    v0Username: string
    email: string
    description: string
  }
): string | null {
  switch (step) {
    case 1:
      if (!fields.projectName.trim()) return "Project name is required."
      return null
    case 2:
      if (!fields.liveUrl.trim()) return "A live URL is required."
      if (!isValidUrl(fields.liveUrl.trim()))
        return "Please enter a valid URL (e.g. https://my-project.vercel.app)."
      return null
    case 3:
      if (!fields.v0ProjectUrl.trim())
        return "Your v0 project URL is required."
      if (!isValidUrl(fields.v0ProjectUrl.trim()))
        return "Please enter a valid URL (e.g. https://v0.dev/chat/...)."
      return null
    case 4:
      if (
        fields.githubRepoUrl.trim() &&
        !isValidUrl(fields.githubRepoUrl.trim())
      )
        return "That doesn\u2019t look like a valid URL."
      return null
    case 5:
      if (!fields.hasPosted)
        return "You need to share your project before continuing."
      return null
    case 6:
      if (!fields.socialProofLink.trim())
        return "Please paste the link to your social post."
      if (!isValidUrl(fields.socialProofLink.trim()))
        return "That doesn\u2019t look like a valid URL."
      return null
    case 7:
      if (fields.globalCategories.length === 0)
        return "Pick at least one category to continue."
      return null
    case 8:
      if (fields.localCategories.length === 0)
        return "Pick at least one prize category to continue."
      return null
    case 9:
      if (!fields.yourName.trim()) return "Your name is required."
      return null
    case 10:
      if (!fields.v0Username.trim()) return "Your v0 username is required."
      return null
    case 11:
      if (!fields.email.trim()) return "Email is required."
      if (!isValidEmail(fields.email.trim()))
        return "Please enter a valid email address."
      return null
    case 12:
      if (!fields.description.trim()) return "A short description is required."
      if (fields.description.trim().length > 40)
        return "Description must be 40 characters or fewer."
      return null
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TypeformSubmit({
  onSubmit,
  embedded = false,
}: TypeformSubmitProps) {
  // ---- state ----
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [projectName, setProjectName] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [v0ProjectUrl, setV0ProjectUrl] = useState("")
  const [githubRepoUrl, setGithubRepoUrl] = useState("")
  const [activePlatform, setActivePlatform] = useState<"x" | "linkedin">("x")
  const [hasPosted, setHasPosted] = useState(false)
  const [socialProofLink, setSocialProofLink] = useState("")
  const [globalCategories, setGlobalCategories] = useState<string[]>([])
  const [localCategories, setLocalCategories] = useState<string[]>([])
  const [yourName, setYourName] = useState("")
  const [v0Username, setV0Username] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

  const [submitted, setSubmitted] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Clear error whenever the user edits something
  const clearError = useCallback(() => setError(null), [])

  // Focus the text input whenever a new step mounts
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400)
    return () => clearTimeout(t)
  }, [step])

  // Clear error when step changes
  useEffect(() => {
    setError(null)
  }, [step])

  // ---- validation shortcut (all fields bag) ----
  const fieldsBag = {
    projectName,
    liveUrl,
    v0ProjectUrl,
    githubRepoUrl,
    hasPosted,
    socialProofLink,
    globalCategories,
    localCategories,
    yourName,
    v0Username,
    email,
    description,
  }

  // ---- navigation helpers ----
  const canContinue = useCallback((): boolean => {
    return validateStep(step, fieldsBag) === null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step,
    projectName,
    liveUrl,
    v0ProjectUrl,
    githubRepoUrl,
    hasPosted,
    socialProofLink,
    globalCategories,
    localCategories,
    yourName,
    v0Username,
    email,
    description,
  ])

  const goNext = useCallback(() => {
    const err = validateStep(step, fieldsBag)
    if (err) {
      setError(err)
      return
    }
    if (step < TOTAL_STEPS) {
      setDirection(1)
      setStep((s) => s + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, canContinue])

  const goPrev = useCallback(() => {
    if (step > 1) {
      setDirection(-1)
      setStep((s) => s - 1)
    }
  }, [step])

  // Keyboard: Enter to continue (except on the social share step)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && step !== 5) {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, step])

  // ---- social sharing ----
  const generatePostContent = (platform: "x" | "linkedin") => {
    const name = projectName.trim() || "my project"
    const url = liveUrl.trim()

    if (platform === "x") {
      return `Just shipped ${name} at #v0PromptToProduction Miami!\n\nBuilt with @v0 and deployed on @vercel at The LAB Miami.\n\n${url ? `Check it out: ${url}` : ""}\n\nHosted by @AgnelNieves\n\n#BuildInPublic #MiamiTech #v0`.trim()
    }
    return `Excited to share ${name} - my submission from v0 Prompt to Production Week in Miami!\n\nThis project was built using v0 by Vercel at The LAB Miami, showcasing how AI-powered development can help ship production-ready apps faster.\n\n${url ? `Live demo: ${url}` : ""}\n\nHuge thanks to Agnel Nieves for hosting this incredible event!\n\n#v0PromptToProduction #BuildInPublic #MiamiTech #Vercel #v0 #WebDevelopment`.trim()
  }

  const shareOnX = () => {
    const text = encodeURIComponent(generatePostContent("x"))
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
    setHasPosted(true)
  }

  const shareOnLinkedIn = () => {
    const text = encodeURIComponent(generatePostContent("linkedin"))
    const url = liveUrl.trim()
      ? encodeURIComponent(liveUrl.trim())
      : ""
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url || encodeURIComponent("https://v0.dev")}&text=${text}`,
      "_blank"
    )
    setHasPosted(true)
  }

  // ---- category toggle helpers ----
  const toggleGlobalCategory = (id: string) => {
    setGlobalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    clearError()
  }

  const toggleLocalCategory = (id: string) => {
    setLocalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    clearError()
  }

  // ---- submit ----
  const handleSubmit = () => {
    const data: SubmissionData = {
      projectName,
      liveUrl,
      v0ProjectUrl,
      githubRepoUrl,
      globalCategories,
      localCategories,
      yourName,
      v0Username,
      email,
      description,
      socialProofLink,
    }
    if (onSubmit) {
      onSubmit(data)
    } else {
      const params = new URLSearchParams({
        name: yourName,
        username: v0Username,
        email,
        url: liveUrl,
        category: globalCategories.join(","),
        description,
        social: socialProofLink,
      })
      window.open(
        `https://v0-v0prompttoproduction2026.vercel.app/submit?${params.toString()}`,
        "_blank"
      )
    }
    setSubmitted(true)
  }

  // ---- progress ----
  const progress = step / TOTAL_STEPS

  // ---- render helpers ----
  const renderStepNumber = () => (
    <span className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-2 block">
      {String(step).padStart(2, "0")} / {TOTAL_STEPS}
    </span>
  )

  const renderContinue = (disabled?: boolean) => (
    <div className="mt-8 flex flex-col gap-3">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-red-400 text-[14px]"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={goNext}
        disabled={disabled}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium text-[15px] hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed w-fit"
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  )

  const renderHint = (text: string) => (
    <p className="text-[13px] text-[#525252] mt-2 font-mono tracking-wide">
      {text}
    </p>
  )

  /** Returns the appropriate border class for an input depending on error state. */
  const inputBorderClass = error
    ? "border-red-500/60 focus:border-red-400"
    : "border-[#333] focus:border-white"

  // ---- step content ----
  const renderStep = () => {
    switch (step) {
      // ---- 1. Project Name ----
      case 1:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              What&apos;s your project called?
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Give your project a name.
            </p>
            <input
              ref={inputRef}
              type="text"
              value={projectName}
              onChange={(e) => { setProjectName(e.target.value); clearError() }}
              placeholder="e.g. AI Recipe Generator"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 2. Live URL ----
      case 2:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              What&apos;s the live URL?
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Paste the deployed link to your project.
            </p>
            <input
              ref={inputRef}
              type="url"
              value={liveUrl}
              onChange={(e) => { setLiveUrl(e.target.value); clearError() }}
              placeholder="https://my-project.vercel.app"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 3. V0 Project URL ----
      case 3:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              v0 Project URL
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Share the chat from your v0 project so judges can see your prompting process.
            </p>
            <input
              ref={inputRef}
              type="url"
              value={v0ProjectUrl}
              onChange={(e) => { setV0ProjectUrl(e.target.value); clearError() }}
              placeholder="https://v0.dev/chat/..."
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 4. GitHub Repo URL ----
      case 4:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              GitHub Repo URL
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Link your source code so others can learn from your build.
            </p>
            <input
              ref={inputRef}
              type="url"
              value={githubRepoUrl}
              onChange={(e) => { setGithubRepoUrl(e.target.value); clearError() }}
              placeholder="https://github.com/you/your-repo"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Optional \u2014 press Enter \u21b5 to skip")}
            {renderContinue()}
          </div>
        )

      // ---- 5. Share Your Project (Social post generator) ----
      case 5:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Share your project publicly
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-6">
              Post about your project on X or LinkedIn to be eligible for prizes.
              We&apos;ll generate the post for you.
            </p>

            {/* Platform tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActivePlatform("x")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] tracking-wide transition-all duration-300 ${
                  activePlatform === "x"
                    ? "bg-white text-black"
                    : "bg-[#0a0a0a] text-[#737373] border border-[#262626] hover:border-[#404040]"
                }`}
              >
                <XIcon />
                X / Twitter
              </button>
              <button
                onClick={() => setActivePlatform("linkedin")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] tracking-wide transition-all duration-300 ${
                  activePlatform === "linkedin"
                    ? "bg-[#0a66c2] text-white"
                    : "bg-[#0a0a0a] text-[#737373] border border-[#262626] hover:border-[#404040]"
                }`}
              >
                <LinkedInIcon />
                LinkedIn
              </button>
            </div>

            {/* Post previews */}
            {activePlatform === "x" ? (
              <XPostPreview content={generatePostContent("x")} />
            ) : (
              <LinkedInPostPreview
                content={generatePostContent("linkedin")}
                projectUrl={liveUrl}
                projectName={projectName}
              />
            )}

            {/* Share button */}
            <div className="mt-6">
              {activePlatform === "x" ? (
                <button
                  onClick={shareOnX}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors w-full sm:w-auto"
                >
                  <XIcon />
                  Post on X
                </button>
              ) : (
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a66c2] text-white rounded-lg font-medium hover:bg-[#004182] transition-colors w-full sm:w-auto"
                >
                  <LinkedInIcon />
                  Post on LinkedIn
                </button>
              )}
            </div>

            {/* Posted confirmation */}
            <AnimatePresence>
              {hasPosted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-400 text-[14px]">
                    Great! You&apos;ve shared your post. You can continue to the
                    next step.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accounts mentioned */}
            <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg">
              <p className="font-mono text-[11px] text-[#737373] tracking-[1.5px] mb-3">
                ACCOUNTS MENTIONED
              </p>
              <div className="flex flex-col gap-2 text-[14px]">
                <div>
                  <span className="text-[#737373]">X:</span>{" "}
                  <a
                    href={socialLinks.x.vercel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    @vercel
                  </a>
                  ,{" "}
                  <a
                    href={socialLinks.x.v0}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    @v0
                  </a>
                  ,{" "}
                  <a
                    href="https://x.com/AgnelNieves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    @AgnelNieves
                  </a>
                </div>
                <div>
                  <span className="text-[#737373]">LinkedIn:</span>{" "}
                  <a
                    href={socialLinks.linkedin.vercel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    Vercel
                  </a>
                  ,{" "}
                  <a
                    href={socialLinks.linkedin.v0}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    v0
                  </a>
                  ,{" "}
                  <a
                    href="https://www.linkedin.com/in/AgnelNieves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    Agnel Nieves
                  </a>
                </div>
              </div>
            </div>

            {renderContinue(!hasPosted)}
          </div>
        )

      // ---- 6. Social Proof Link ----
      case 6:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Paste your social post link
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Link to your X or LinkedIn post about this project.
            </p>
            <input
              ref={inputRef}
              type="url"
              value={socialProofLink}
              onChange={(e) => { setSocialProofLink(e.target.value); clearError() }}
              placeholder="https://x.com/... or https://linkedin.com/..."
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 7. Global Category (multi-select) ----
      case 7:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Pick your global categories
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Select one or more v0 Prompt to Production competition categories.
            </p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {globalCategoryOptions.map((cat) => {
                const selected = globalCategories.includes(cat.id)
                return (
                  <motion.button
                    key={cat.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    onClick={() => toggleGlobalCategory(cat.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selected
                        ? "bg-white text-black border-white"
                        : "bg-[#0a0a0a] text-white border-[#262626] hover:border-[#404040]"
                    }`}
                  >
                    <span className="text-[15px] font-medium">{cat.label}</span>
                  </motion.button>
                )
              })}
            </motion.div>
            {renderHint("Select all that apply")}
            {renderContinue()}
          </div>
        )

      // ---- 8. Local Prize Category (multi-select) ----
      case 8:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Pick your Miami prize categories
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Sponsored prizes exclusive to Miami event participants. Select one or more.
            </p>
            <motion.div
              className="grid gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {localCategoryOptions.map((cat) => {
                const selected = localCategories.includes(cat.id)
                return (
                  <motion.button
                    key={cat.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    onClick={() => toggleLocalCategory(cat.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selected
                        ? "bg-white text-black border-white"
                        : "bg-[#0a0a0a] text-white border-[#262626] hover:border-[#404040]"
                    }`}
                  >
                    <span className="text-[15px] font-medium block mb-1">
                      {cat.label}
                    </span>
                    <span
                      className={`text-[13px] ${
                        selected ? "text-black/70" : "text-[#737373]"
                      }`}
                    >
                      {cat.description}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
            {renderHint("Select all that apply")}
            {renderContinue()}
          </div>
        )

      // ---- 9. Your Name ----
      case 9:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              What&apos;s your name?
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              This will appear on your submission.
            </p>
            <input
              ref={inputRef}
              type="text"
              value={yourName}
              onChange={(e) => { setYourName(e.target.value); clearError() }}
              placeholder="John Doe"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 10. V0 Username ----
      case 10:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              What&apos;s your v0 username?
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Your username on v0.dev.
            </p>
            <input
              ref={inputRef}
              type="text"
              value={v0Username}
              onChange={(e) => { setV0Username(e.target.value); clearError() }}
              placeholder="@username"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 11. Email ----
      case 11:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              What&apos;s your email?
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              We&apos;ll only use this to contact you about prizes. It won&apos;t
              be shared publicly.
            </p>
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError() }}
              placeholder="you@email.com"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 12. Short Description ----
      case 12:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Describe your project in a sentence
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Keep it short and punchy.{" "}
              <span className="text-[#525252]">
                {40 - description.length} characters left
              </span>
            </p>
            <input
              ref={inputRef}
              type="text"
              maxLength={40}
              value={description}
              onChange={(e) => { setDescription(e.target.value.slice(0, 40)); clearError() }}
              placeholder="A brief description of your project"
              className={`w-full bg-transparent border-b-2 ${inputBorderClass} text-white text-[20px] lg:text-[28px] py-3 outline-none transition-colors placeholder:text-[#333]`}
            />
            {renderHint("Press Enter \u21b5 to continue")}
            {renderContinue()}
          </div>
        )

      // ---- 13. Review & Submit ----
      case 13:
        return (
          <div className="flex flex-col">
            {renderStepNumber()}
            <h2 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-2">
              Review &amp; submit
            </h2>
            <p className="text-[16px] text-[#737373] leading-[1.6] mb-8">
              Make sure everything looks good before submitting.
            </p>
            <div className="space-y-3">
              <SummaryRow label="Project" value={projectName} />
              <SummaryRow label="Live URL" value={liveUrl} />
              <SummaryRow label="v0 Project" value={v0ProjectUrl} />
              {githubRepoUrl && (
                <SummaryRow label="GitHub" value={githubRepoUrl} />
              )}
              <SummaryRow label="Social Post" value={socialProofLink} />
              <SummaryRow
                label="Global Categories"
                value={
                  globalCategories
                    .map((id) => globalCategoryOptions.find((c) => c.id === id)?.label)
                    .filter(Boolean)
                    .join(", ") || "-"
                }
              />
              <SummaryRow
                label="Miami Prizes"
                value={
                  localCategories
                    .map((id) => localCategoryOptions.find((c) => c.id === id)?.label)
                    .filter(Boolean)
                    .join(", ") || "-"
                }
              />
              <SummaryRow label="Name" value={yourName} />
              <SummaryRow label="v0 Username" value={v0Username} />
              <SummaryRow label="Email" value={email} />
              <SummaryRow label="Description" value={description} />
            </div>

            {!submitted ? (
              <motion.button
                onClick={handleSubmit}
                className="mt-10 flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-lg font-medium text-[16px] hover:bg-white/90 transition-colors w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Project
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-[16px] font-medium">
                    Submitted!
                  </p>
                  <p className="text-green-400/70 text-[14px]">
                    Your project has been submitted. Good luck!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // ---- main render ----
  return (
    <div
      className={`relative bg-black text-white ${
        embedded
          ? "h-full w-full overflow-y-auto"
          : "min-h-screen"
      }`}
    >
      {/* Progress bar */}
      <div className="sticky top-0 z-30 h-[3px] bg-[#1a1a1a] w-full">
        <motion.div
          className="h-full bg-white origin-left"
          animate={{ scaleX: progress }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* Content */}
      <div
        className={`mx-auto w-full ${
          embedded
            ? "max-w-[700px] px-6 py-8 lg:py-12"
            : "max-w-[700px] px-6 py-16 lg:py-24"
        }`}
      >
        {/* Back button */}
        {step > 1 && (
          <button
            onClick={goPrev}
            className="flex items-center gap-1.5 text-[14px] text-[#525252] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-[#1a1a1a]">
      <span className="text-[14px] text-[#525252] flex-shrink-0 mr-4">
        {label}
      </span>
      <span className="text-[14px] text-white text-right break-all">
        {value || "-"}
      </span>
    </div>
  )
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function XPostPreview({ content }: { content: string }) {
  return (
    <div className="bg-black border border-[#2f3336] rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#333] to-[#555] flex items-center justify-center text-white font-medium text-[14px] flex-shrink-0">
            You
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-bold text-white">
                Your Name
              </span>
              <span className="text-[15px] text-[#71767b]">@yourhandle</span>
              <span className="text-[15px] text-[#71767b]">&middot;</span>
              <span className="text-[15px] text-[#71767b]">now</span>
            </div>
            <div className="mt-1 text-[15px] text-white leading-[1.4] whitespace-pre-wrap">
              {content.split(/([@#]\w+)/g).map((part, i) => {
                if (part.startsWith("@") || part.startsWith("#")) {
                  return (
                    <span key={i} className="text-[#1d9bf0]">
                      {part}
                    </span>
                  )
                }
                return part
              })}
            </div>
            <div className="flex items-center justify-between mt-4 max-w-[425px] text-[#71767b]">
              <span className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-[#00ba7c] transition-colors">
                <Repeat2 className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-[#f91880] transition-colors">
                <Heart className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </span>
              <span className="flex items-center gap-2 hover:text-[#1d9bf0] transition-colors">
                <BarChart2 className="w-[18px] h-[18px]" />
                <span className="text-[13px]">0</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="hover:text-[#1d9bf0] transition-colors">
                  <Bookmark className="w-[18px] h-[18px]" />
                </span>
                <span className="hover:text-[#1d9bf0] transition-colors">
                  <Share className="w-[18px] h-[18px]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkedInPostPreview({
  content,
  projectUrl,
  projectName,
}: {
  content: string
  projectUrl: string
  projectName: string
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#e0e0e0]">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a66c2] to-[#004182] flex items-center justify-center text-white font-semibold text-[16px] flex-shrink-0">
            You
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-semibold text-[#000000e6]">
                Your Name
              </span>
              <span className="text-[14px] text-[#00000099]">&middot; 1st</span>
            </div>
            <p className="text-[12px] text-[#00000099] leading-tight">
              Your headline here
            </p>
            <p className="text-[12px] text-[#00000099]">
              Just now &middot;{" "}
              <span className="inline-flex items-center">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z" />
                </svg>
              </span>
            </p>
          </div>
        </div>
        <div className="mt-3 text-[14px] text-[#000000e6] leading-[1.5] whitespace-pre-wrap">
          {content.split(/(#\w+)/g).map((part, i) => {
            if (part.startsWith("#")) {
              return (
                <span
                  key={i}
                  className="text-[#0a66c2] hover:underline cursor-pointer"
                >
                  {part}
                </span>
              )
            }
            return part
          })}
        </div>
        {projectUrl.trim() && (
          <div className="mt-3 border border-[#e0e0e0] rounded-lg overflow-hidden">
            <div className="h-[80px] bg-gradient-to-br from-[#f3f2f0] to-[#e8e7e5] flex items-center justify-center">
              <span className="text-[#666] text-[13px]">Link preview</span>
            </div>
            <div className="p-3 bg-[#f9fafb]">
              <p className="text-[12px] text-[#00000099] truncate">
                {projectUrl.trim()}
              </p>
              <p className="text-[14px] text-[#000000e6] font-medium truncate">
                {projectName.trim() || "Your Project"}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e0e0e0]">
          <span className="flex items-center gap-1.5 px-2 py-2 text-[#00000099]">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-[13px] font-medium">Like</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-2 text-[#00000099]">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[13px] font-medium">Comment</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-2 text-[#00000099]">
            <Repeat2 className="w-4 h-4" />
            <span className="text-[13px] font-medium">Repost</span>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-2 text-[#00000099]">
            <Send className="w-4 h-4" />
            <span className="text-[13px] font-medium">Send</span>
          </span>
        </div>
      </div>
    </div>
  )
}
