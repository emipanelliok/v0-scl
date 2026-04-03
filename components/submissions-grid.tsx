"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ExternalLink,
  Github,
  Globe,
  Video,
  X,
  Calendar,
  User,
  Tag,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

export interface Submission {
  id: number
  project_name: string
  live_url: string
  v0_project_url: string
  github_repo_url: string | null
  global_categories: string[]
  local_categories: string[]
  your_name: string
  v0_username: string
  description: string
  social_proof_link: string | null
  video_url: string | null
  notes: string | null
  email: string | null
  created_at: string
}

function getScreenshotUrl(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&viewport.deviceScaleFactor=1`
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function SubmissionsGrid({
  submissions,
}: {
  submissions: Submission[]
}) {
  const [selected, setSelected] = useState<Submission | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#262626] border border-[#262626]">
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onClick={() => setSelected(submission)}
          />
        ))}
        {submissions.length % 3 !== 0 &&
          Array.from({ length: 3 - (submissions.length % 3) }).map((_, i) => (
            <div key={`filler-${i}`} className="bg-black" />
          ))}
      </div>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl lg:max-w-2xl bg-[#0a0a0a] border-[#262626] p-0 overflow-hidden"
        >
          {selected && <SubmissionDetail submission={selected} />}
        </SheetContent>
      </Sheet>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Card (clickable)                                                    */
/* ------------------------------------------------------------------ */

function SubmissionCard({
  submission,
  onClick,
}: {
  submission: Submission
  onClick: () => void
}) {
  const allCategories = [
    ...(submission.global_categories ?? []),
    ...(submission.local_categories ?? []),
  ]

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-black flex flex-col group transition-colors duration-300 hover:bg-[#0a0a0a] text-left cursor-pointer"
    >
      {/* Screenshot preview */}
      {submission.live_url && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
          <Image
            src={getScreenshotUrl(submission.live_url)}
            alt={`Screenshot of ${submission.project_name}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="p-6 lg:p-8 flex flex-col gap-5 flex-1">
        {/* Project name + builder */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[18px] lg:text-[20px] font-medium leading-[1.3] text-white transition-all duration-300 group-hover:translate-x-0.5 text-balance">
            {submission.project_name}
          </h2>
          <p className="text-[13px] text-[#737373]">
            by{" "}
            <span className="text-[#a3a3a3]">{submission.your_name}</span>
            {submission.v0_username && (
              <span className="text-[#525252]">
                {" "}
                &middot; @{submission.v0_username}
              </span>
            )}
          </p>
        </div>

        {/* Description */}
        {submission.description && (
          <p className="text-[14px] text-[#737373] leading-relaxed line-clamp-3">
            {submission.description}
          </p>
        )}

        {/* Categories */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allCategories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded-full text-[11px] font-mono text-[#737373] tracking-wide"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Tap hint */}
        <div className="mt-auto pt-2">
          <span className="text-[12px] font-mono text-[#525252] tracking-wide group-hover:text-[#737373] transition-colors duration-200">
            TAP TO VIEW DETAILS
          </span>
        </div>
      </div>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Detail Sheet Content                                                */
/* ------------------------------------------------------------------ */

function SubmissionDetail({ submission }: { submission: Submission }) {
  const allCategories = [
    ...(submission.global_categories ?? []),
    ...(submission.local_categories ?? []),
  ]

  return (
    <div className="h-full overflow-y-auto overscroll-contain flex flex-col">
      <SheetTitle className="sr-only">{submission.project_name}</SheetTitle>

      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <SheetClose className="p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors cursor-pointer">
          <X className="w-5 h-5 text-[#a3a3a3]" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>

      {/* Screenshot */}
      {submission.live_url && (
        <a
          href={submission.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[16/9] overflow-hidden bg-black shrink-0 group/img"
        >
          <Image
            src={getScreenshotUrl(submission.live_url)}
            alt={`Screenshot of ${submission.project_name}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, 672px"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-mono text-white/80 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
            <Globe className="w-3 h-3" />
            VISIT SITE
          </div>
        </a>
      )}

      {/* Content */}
      <div className="px-6 lg:px-8 py-8 flex flex-col gap-7 flex-1">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[22px] lg:text-[28px] font-medium leading-[1.15] text-white text-balance">
            {submission.project_name}
          </h2>
          <div className="flex items-center gap-3 text-[14px] text-[#737373]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {submission.your_name}
              {submission.v0_username && (
                <span className="text-[#525252]">
                  @{submission.v0_username}
                </span>
              )}
            </span>
            <span className="text-[#333]">|</span>
            <span className="flex items-center gap-1.5 text-[13px] text-[#525252]">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(submission.created_at)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#262626]" />

        {/* Description */}
        {submission.description && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-mono text-[#525252] tracking-[2px] uppercase">
              Description
            </h3>
            <p className="text-[15px] text-[#a3a3a3] leading-relaxed">
              {submission.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {submission.notes && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-mono text-[#525252] tracking-[2px] uppercase">
              Notes
            </h3>
            <div className="px-4 py-3 bg-[#111] border-l-2 border-[#333] rounded-r-md">
              <p className="text-[14px] text-[#a3a3a3] leading-relaxed whitespace-pre-wrap">
                {submission.notes}
              </p>
            </div>
          </div>
        )}

        {/* Categories */}
        {allCategories.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[11px] font-mono text-[#525252] tracking-[2px] uppercase flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-full text-[12px] font-mono text-[#737373] tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-[#262626]" />

        {/* Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-mono text-[#525252] tracking-[2px] uppercase">
            Links
          </h3>
          <div className="flex flex-col gap-2">
            {submission.live_url && (
              <a
                href={submission.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white text-[#0a0a0a] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-[#e5e5e5]"
              >
                <Globe className="w-4 h-4" />
                Visit Live Site
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-50" />
              </a>
            )}
            {submission.v0_project_url && (
              <a
                href={submission.v0_project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#262626] text-[#a3a3a3] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-[#1a1a1a] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                v0 Project
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-30" />
              </a>
            )}
            {submission.github_repo_url && (
              <a
                href={submission.github_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#262626] text-[#a3a3a3] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-[#1a1a1a] hover:text-white"
              >
                <Github className="w-4 h-4" />
                GitHub Repository
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-30" />
              </a>
            )}
            {submission.video_url && (
              <a
                href={submission.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#262626] text-[#a3a3a3] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-[#1a1a1a] hover:text-white"
              >
                <Video className="w-4 h-4" />
                Video Walkthrough
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-30" />
              </a>
            )}
            {submission.social_proof_link && (
              <a
                href={submission.social_proof_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#262626] text-[#a3a3a3] rounded-lg text-[13px] font-medium transition-all duration-200 hover:bg-[#1a1a1a] hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                Social Post
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-30" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
