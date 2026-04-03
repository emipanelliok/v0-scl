"use client"

import { useState } from "react"
import {
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
  Loader2,
} from "lucide-react"
import { submitProject } from "@/app/actions/submit-project"

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
  videoUrl: string
  notes: string
}

interface SubmissionFormProps {
  onSubmit?: (data: SubmissionData) => void
  /** When true, hides outer chrome — used when embedded inside a deck slide */
  embedded?: boolean
}

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

interface ValidationErrors {
  projectName?: string
  liveUrl?: string
  v0ProjectUrl?: string
  githubRepoUrl?: string
  hasPosted?: string
  socialProofLink?: string
  globalCategories?: string
  localCategories?: string
  yourName?: string
  v0Username?: string
  email?: string
  description?: string
}

function validateAll(fields: {
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
}): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!fields.projectName.trim()) errors.projectName = "Project name is required."
  if (!fields.liveUrl.trim()) errors.liveUrl = "A live URL is required."
  else if (!isValidUrl(fields.liveUrl.trim())) errors.liveUrl = "Please enter a valid URL (e.g. https://my-project.vercel.app)."
  if (!fields.v0ProjectUrl.trim()) errors.v0ProjectUrl = "Your v0 project URL is required."
  else if (!isValidUrl(fields.v0ProjectUrl.trim())) errors.v0ProjectUrl = "Please enter a valid URL (e.g. https://v0.dev/chat/...)."
  if (fields.githubRepoUrl.trim() && !isValidUrl(fields.githubRepoUrl.trim())) errors.githubRepoUrl = "That doesn\u2019t look like a valid URL."
  if (!fields.hasPosted) errors.hasPosted = "You need to share your project publicly."
  if (!fields.socialProofLink.trim()) errors.socialProofLink = "Please paste the link to your social post."
  else if (!isValidUrl(fields.socialProofLink.trim())) errors.socialProofLink = "That doesn\u2019t look like a valid URL."
  if (fields.globalCategories.length === 0) errors.globalCategories = "Pick at least one category."
  if (fields.localCategories.length === 0) errors.localCategories = "Pick at least one prize category."
  if (!fields.yourName.trim()) errors.yourName = "Your name is required."
  if (!fields.v0Username.trim()) errors.v0Username = "Your v0 username is required."
  if (!fields.email.trim()) errors.email = "Email is required."
  else if (!isValidEmail(fields.email.trim())) errors.email = "Please enter a valid email address."
  if (!fields.description.trim()) errors.description = "A short description is required."
  else if (fields.description.trim().length > 40) errors.description = "Description must be 40 characters or fewer."

  return errors
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SubmissionForm({
  onSubmit,
  embedded = false,
}: SubmissionFormProps) {
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
  const [videoUrl, setVideoUrl] = useState("")
  const [notes, setNotes] = useState("")

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Clear a specific field error when user edits
  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

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
    clearFieldError("hasPosted")
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
    clearFieldError("hasPosted")
  }

  // ---- category toggle helpers ----
  const toggleGlobalCategory = (id: string) => {
    setGlobalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    clearFieldError("globalCategories")
  }

  const toggleLocalCategory = (id: string) => {
    setLocalCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
    clearFieldError("localCategories")
  }

  // ---- submit ----
  const handleSubmit = async () => {
    setSubmitError(null)

    const validationErrors = validateAll({
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
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll to the first error
      const firstErrorField = Object.keys(validationErrors)[0]
      const el = document.getElementById(`field-${firstErrorField}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

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
      videoUrl,
      notes,
    }

    setIsSubmitting(true)

    try {
      const result = await submitProject(data)

      if (!result.success) {
        setSubmitError(result.error ?? "Submission failed. Please try again.")
        setIsSubmitting(false)
        return
      }

      // Call optional callback (e.g. for parent tracking)
      if (onSubmit) {
        onSubmit(data)
      }

      setSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ---- helpers ----
  const inputClass = (field: keyof ValidationErrors) =>
    `w-full px-4 py-3 bg-[#0a0a0a] border ${
      errors[field] ? "border-red-500/60" : "border-[#262626]"
    } rounded-lg text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#404040] transition-colors`

  const fieldError = (field: keyof ValidationErrors) =>
    errors[field] ? (
      <p className="flex items-center gap-1.5 text-red-400 text-[13px] mt-1.5">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        {errors[field]}
      </p>
    ) : null

  // ---- render ----
  return (
    <div
      className={`relative bg-black text-white ${
        embedded ? "h-full w-full overflow-y-auto" : "min-h-screen"
      }`}
    >
      <div
        className={`mx-auto w-full ${
          embedded
            ? "max-w-[700px] px-6 py-8 lg:py-12"
            : "max-w-[700px] px-6 py-16 lg:py-24"
        }`}
      >
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[28px] lg:text-[40px] font-medium leading-[1.15] tracking-[-0.02em] text-white mb-3">
            Submit your project
          </h1>
          <p className="text-[16px] text-[#737373] leading-[1.6]">
            Fill out everything below to be eligible for both global and local Miami prizes.
          </p>
        </div>

        {/* ================================================================ */}
        {/* Section 1: Project Details */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            01 PROJECT DETAILS
          </h2>

          <div className="space-y-5">
            {/* Project Name */}
            <div id="field-projectName">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                PROJECT NAME *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => { setProjectName(e.target.value); clearFieldError("projectName") }}
                placeholder="e.g. AI Recipe Generator"
                className={inputClass("projectName")}
              />
              {fieldError("projectName")}
            </div>

            {/* Live URL */}
            <div id="field-liveUrl">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                LIVE URL *
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => { setLiveUrl(e.target.value); clearFieldError("liveUrl") }}
                placeholder="https://my-project.vercel.app"
                className={inputClass("liveUrl")}
              />
              {fieldError("liveUrl")}
            </div>

            {/* v0 Project URL */}
            <div id="field-v0ProjectUrl">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                V0 PROJECT URL *
              </label>
              <p className="text-[13px] text-[#4a4a4a] mb-2">
                Share the chat so judges can see your prompting process.
              </p>
              <input
                type="url"
                value={v0ProjectUrl}
                onChange={(e) => { setV0ProjectUrl(e.target.value); clearFieldError("v0ProjectUrl") }}
                placeholder="https://v0.dev/chat/..."
                className={inputClass("v0ProjectUrl")}
              />
              {fieldError("v0ProjectUrl")}
            </div>

            {/* GitHub Repo URL */}
            <div id="field-githubRepoUrl">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                GITHUB REPO URL
              </label>
              <p className="text-[13px] text-[#4a4a4a] mb-2">
                Optional &mdash; link your source code so others can learn from your build.
              </p>
              <input
                type="url"
                value={githubRepoUrl}
                onChange={(e) => { setGithubRepoUrl(e.target.value); clearFieldError("githubRepoUrl") }}
                placeholder="https://github.com/you/your-repo"
                className={inputClass("githubRepoUrl")}
              />
              {fieldError("githubRepoUrl")}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 2: Share Publicly */}
        {/* ================================================================ */}
        <section className="mb-12" id="field-hasPosted">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            02 SHARE PUBLICLY
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
          {hasPosted && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-400 text-[14px]">
                Great! You&apos;ve shared your post.
              </span>
            </div>
          )}

          {fieldError("hasPosted")}

          {/* Accounts mentioned */}
          <div className="mt-6 p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg">
            <p className="font-mono text-[11px] text-[#737373] tracking-[1.5px] mb-3">
              ACCOUNTS MENTIONED
            </p>
            <div className="flex flex-col gap-2 text-[14px]">
              <div>
                <span className="text-[#737373]">X:</span>{" "}
                <a href={socialLinks.x.vercel} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@vercel</a>,{" "}
                <a href={socialLinks.x.v0} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@v0</a>,{" "}
                <a href="https://x.com/AgnelNieves" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">@AgnelNieves</a>
              </div>
              <div>
                <span className="text-[#737373]">LinkedIn:</span>{" "}
                <a href={socialLinks.linkedin.vercel} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Vercel</a>,{" "}
                <a href={socialLinks.linkedin.v0} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">v0</a>,{" "}
                <a href="https://www.linkedin.com/in/AgnelNieves" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Agnel Nieves</a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 3: Social Proof */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            03 SOCIAL PROOF
          </h2>

          <div id="field-socialProofLink">
            <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
              SOCIAL POST LINK *
            </label>
            <p className="text-[13px] text-[#4a4a4a] mb-2">
              Link to your X or LinkedIn post about this project.
            </p>
            <input
              type="url"
              value={socialProofLink}
              onChange={(e) => { setSocialProofLink(e.target.value); clearFieldError("socialProofLink") }}
              placeholder="https://x.com/... or https://linkedin.com/..."
              className={inputClass("socialProofLink")}
            />
            {fieldError("socialProofLink")}
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 4: Categories */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            04 CATEGORIES
          </h2>

          {/* Global categories */}
          <div className="mb-8" id="field-globalCategories">
            <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
              GLOBAL HACKATHON CATEGORY *
            </label>
            <p className="text-[13px] text-[#4a4a4a] mb-4">
              Select one or more v0 Prompt to Production competition categories.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {globalCategoryOptions.map((cat) => {
                const selected = globalCategories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleGlobalCategory(cat.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      selected
                        ? "bg-white text-black border-white"
                        : "bg-[#0a0a0a] text-white border-[#262626] hover:border-[#404040]"
                    }`}
                  >
                    <span className="text-[15px] font-medium">{cat.label}</span>
                  </button>
                )
              })}
            </div>
            {fieldError("globalCategories")}
          </div>

          {/* Local categories */}
          <div id="field-localCategories">
            <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
              MIAMI LOCAL PRIZE CATEGORY *
            </label>
            <p className="text-[13px] text-[#4a4a4a] mb-4">
              Sponsored prizes exclusive to Miami event participants. Select one or more.
            </p>
            <div className="grid gap-3">
              {localCategoryOptions.map((cat) => {
                const selected = localCategories.includes(cat.id)
                return (
                  <button
                    key={cat.id}
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
                  </button>
                )
              })}
            </div>
            {fieldError("localCategories")}
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 5: Your Info */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            05 YOUR INFO
          </h2>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Name */}
              <div id="field-yourName">
                <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => { setYourName(e.target.value); clearFieldError("yourName") }}
                  placeholder="John Doe"
                  className={inputClass("yourName")}
                />
                {fieldError("yourName")}
              </div>

              {/* v0 Username */}
              <div id="field-v0Username">
                <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                  V0 USERNAME *
                </label>
                <input
                  type="text"
                  value={v0Username}
                  onChange={(e) => { setV0Username(e.target.value); clearFieldError("v0Username") }}
                  placeholder="@username"
                  className={inputClass("v0Username")}
                />
                {fieldError("v0Username")}
              </div>
            </div>

            {/* Email */}
            <div id="field-email">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                EMAIL (PRIVATE) *
              </label>
              <p className="text-[13px] text-[#4a4a4a] mb-2">
                We&apos;ll only use this to contact you about prizes. It won&apos;t be shared publicly.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email") }}
                placeholder="you@email.com"
                className={inputClass("email")}
              />
              {fieldError("email")}
            </div>

            {/* Short description */}
            <div id="field-description">
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                SHORT DESCRIPTION *{" "}
                <span className="text-[#4a4a4a]">({40 - description.length} chars left)</span>
              </label>
              <input
                type="text"
                maxLength={40}
                value={description}
                onChange={(e) => { setDescription(e.target.value.slice(0, 40)); clearFieldError("description") }}
                placeholder="A brief description of your project"
                className={inputClass("description")}
              />
              {fieldError("description")}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 6: Video Walkthrough */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            06 VIDEO WALKTHROUGH
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg space-y-3">
              <p className="text-[14px] text-[#a3a3a3] leading-relaxed">
                Record a short screen recording (1-3 min) walking through your project. Show what it does, how it works, and any standout features. This helps judges evaluate your submission fairly.
              </p>
              <div className="text-[13px] text-[#737373] space-y-1.5">
                <p className="text-[#a3a3a3] font-medium">Tips for a great video:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Use a screen recorder (Loom, QuickTime, OBS, or your OS built-in tool)</li>
                  <li>Start by briefly explaining the idea, then demo the live app</li>
                  <li>Keep it under 3 minutes -- judges review many submissions</li>
                  <li>Show the actual deployed app, not just code</li>
                  <li>Upload to YouTube (unlisted), Google Drive (share link), or Loom</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                VIDEO URL (OPTIONAL)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or Google Drive / Loom link"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#404040] transition-colors"
              />
              <p className="text-[12px] text-[#4a4a4a] mt-1.5">
                YouTube, Google Drive, Loom, or any publicly accessible video link.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Section 7: Additional Notes */}
        {/* ================================================================ */}
        <section className="mb-12">
          <h2 className="font-mono text-[12px] text-[#525252] tracking-[1.5px] mb-6">
            07 ADDITIONAL NOTES
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg space-y-2">
              <p className="text-[14px] text-[#a3a3a3] leading-relaxed">
                Use this space to share anything else the judges should know about your project. This is optional but can help provide important context.
              </p>
              <div className="text-[13px] text-[#737373] space-y-1.5">
                <p className="text-[#a3a3a3] font-medium">What to include:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Additional URLs -- API docs, design files, Figma links, etc.</li>
                  <li>API keys or test credentials judges may need to try your app</li>
                  <li>Team members -- include their names and profile URLs (GitHub, X, LinkedIn)</li>
                  <li>Known limitations or things you would improve with more time</li>
                  <li>Technical details -- special integrations, AI models used, data sources</li>
                  <li>Any other context that helps judges understand your project</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                NOTES (OPTIONAL)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={"Example:\n- Built with: Next.js, Supabase, AI SDK\n- Team: Jane (@janedoe), Alex (@alexdev)\n- Test account: demo@test.com / password123\n- API docs: https://..."}
                rows={6}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#404040] transition-colors resize-y"
              />
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Submit */}
        {/* ================================================================ */}
        <section>
          {!submitted ? (
            <>
              {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-[14px]">
                    Please fix the errors above before submitting.
                  </span>
                </div>
              )}
              {submitError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-[14px]">
                    {submitError}
                  </span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-lg font-medium text-[16px] hover:bg-white/90 transition-colors w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Project
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-green-400 text-[16px] font-medium">
                  Submitted!
                </p>
                <p className="text-green-400/70 text-[14px]">
                  Your project has been submitted. Good luck!
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
              <span className="text-[15px] font-bold text-white">Your Name</span>
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
              <span className="text-[14px] font-semibold text-[#000000e6]">Your Name</span>
              <span className="text-[14px] text-[#00000099]">&middot; 1st</span>
            </div>
            <p className="text-[12px] text-[#00000099] leading-tight">Your headline here</p>
            <p className="text-[12px] text-[#00000099]">
              Just now &middot;{" "}
              <span className="inline-flex items-center">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
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
                <span key={i} className="text-[#0a66c2] hover:underline cursor-pointer">
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
              <p className="text-[12px] text-[#00000099] truncate">{projectUrl.trim()}</p>
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
