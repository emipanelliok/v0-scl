"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  ExternalLink,
  Star,
  Trophy,
  Filter,
  Video,
  ArrowUpDown,
  Loader2,
  Users,
  Lock,
} from "lucide-react"

const DASHBOARD_PASSWORD = "v0-prompt-to-prod-miami-2026"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Submission {
  id: number
  project_name: string
  live_url: string
  v0_project_url: string
  github_repo_url: string
  global_categories: string[]
  local_categories: string[]
  your_name: string
  v0_username: string
  email: string
  description: string
  social_proof_link: string
  video_url: string | null
  created_at: string
  avg_score: number
  total_ratings: number
  my_score: number | null
}

type SortField = "avg_score" | "total_ratings" | "created_at" | "project_name"
type SortDir = "asc" | "desc"

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function JudgeDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("judge-dashboard-auth")
      if (stored === "true") setAuthenticated(true)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === DASHBOARD_PASSWORD) {
      setAuthenticated(true)
      setPasswordError(false)
      sessionStorage.setItem("judge-dashboard-auth", "true")
    } else {
      setPasswordError(true)
    }
  }

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [judgeId, setJudgeId] = useState("")
  const [ratingInFlight, setRatingInFlight] = useState<number | null>(null)
  const [showTopOnly, setShowTopOnly] = useState(false)
  const [sortField, setSortField] = useState<SortField>("avg_score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [hoveredStar, setHoveredStar] = useState<{
    id: number
    score: number
  } | null>(null)

  // Get or create fingerprint
  const getFingerprint = useCallback(() => {
    if (typeof window === "undefined") return ""
    let fp = localStorage.getItem("judge_fingerprint")
    if (!fp) {
      fp = crypto.randomUUID()
      localStorage.setItem("judge_fingerprint", fp)
    }
    return fp
  }, [])

  // Resolve judge ID
  const resolveJudgeId = useCallback(async () => {
    const fp = getFingerprint()
    const res = await fetch("/api/rate")
    const { ip } = await res.json()
    // Hash on client to get the same judge ID used for queries
    const data = new TextEncoder().encode(`${ip}:${fp}`)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }, [getFingerprint])

  // Fetch submissions
  const fetchSubmissions = useCallback(
    async (jId: string) => {
      try {
        const res = await fetch(
          `/api/submissions?judgeId=${encodeURIComponent(jId)}`
        )
        const data = await res.json()
        if (data.submissions) {
          setSubmissions(
            data.submissions.map((s: Submission) => ({
              ...s,
              avg_score: Number(s.avg_score),
              total_ratings: Number(s.total_ratings),
              my_score: s.my_score != null ? Number(s.my_score) : null,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to fetch submissions:", err)
      }
    },
    []
  )

  useEffect(() => {
    ;(async () => {
      const jId = await resolveJudgeId()
      setJudgeId(jId)
      await fetchSubmissions(jId)
      setLoading(false)
    })()
  }, [resolveJudgeId, fetchSubmissions])

  // Rate a submission
  const rateSubmission = async (submissionId: number, score: number) => {
    setRatingInFlight(submissionId)
    try {
      const fp = getFingerprint()
      await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, score, fingerprint: fp }),
      })
      // Refresh data
      await fetchSubmissions(judgeId)
    } catch (err) {
      console.error("Failed to rate:", err)
    } finally {
      setRatingInFlight(null)
    }
  }

  // Sort & filter
  const sorted = useMemo(() => {
    const list = [...submissions]
    list.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number
      switch (sortField) {
        case "avg_score":
          aVal = a.avg_score
          bVal = b.avg_score
          break
        case "total_ratings":
          aVal = a.total_ratings
          bVal = b.total_ratings
          break
        case "created_at":
          aVal = new Date(a.created_at).getTime()
          bVal = new Date(b.created_at).getTime()
          break
        case "project_name":
          aVal = a.project_name.toLowerCase()
          bVal = b.project_name.toLowerCase()
          break
        default:
          return 0
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
    if (showTopOnly) return list.slice(0, 5)
    return list
  }, [submissions, sortField, sortDir, showTopOnly])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  // ---- Password gate ----
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <form
          onSubmit={handlePasswordSubmit}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#737373]" />
            </div>
            <h1 className="text-[20px] font-bold tracking-tight">
              Judge Dashboard
            </h1>
            <p className="text-[14px] text-[#737373]">
              Enter the password to access the dashboard.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value)
                setPasswordError(false)
              }}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-lg text-white placeholder:text-[#4a4a4a] focus:outline-none focus:border-[#404040] transition-colors"
            />
            {passwordError && (
              <p className="text-red-400 text-[13px]">
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-white text-black rounded-lg font-medium text-[14px] hover:bg-white/90 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#737373]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Judge Dashboard
            </h1>
            <p className="text-[#737373] text-[15px] mt-2">
              Rate submissions with 1-5 stars. Click a row to expand details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowTopOnly(!showTopOnly)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                showTopOnly
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-[#141414] text-[#a3a3a3] border border-[#262626] hover:border-[#404040]"
              }`}
            >
              {showTopOnly ? (
                <Trophy className="w-4 h-4" />
              ) : (
                <Filter className="w-4 h-4" />
              )}
              {showTopOnly ? "Showing Top 5" : "Show Top 5"}
            </button>

            <div className="flex items-center gap-2 text-[13px] text-[#525252]">
              <Users className="w-3.5 h-3.5" />
              {submissions.length} submission{submissions.length !== 1 && "s"}
            </div>
          </div>
        </div>

        {/* Table */}
        {submissions.length === 0 ? (
          <div className="text-center py-20 text-[#525252]">
            <p className="text-[16px]">No submissions yet.</p>
          </div>
        ) : (
          <div className="border border-[#262626] rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="hidden lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_180px] bg-[#0a0a0a] border-b border-[#262626] px-5 py-3">
              <button
                onClick={() => toggleSort("project_name")}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#525252] tracking-[1.5px] hover:text-[#a3a3a3] transition-colors text-left"
              >
                PROJECT
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <span className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                BUILDER
              </span>
              <button
                onClick={() => toggleSort("avg_score")}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#525252] tracking-[1.5px] hover:text-[#a3a3a3] transition-colors"
              >
                AVG
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => toggleSort("total_ratings")}
                className="flex items-center gap-1.5 font-mono text-[11px] text-[#525252] tracking-[1.5px] hover:text-[#a3a3a3] transition-colors"
              >
                VOTES
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <span className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                YOUR RATING
              </span>
            </div>

            {/* Table rows */}
            {sorted.map((s, index) => (
              <div key={s.id}>
                <div
                  onClick={() =>
                    setExpandedRow(expandedRow === s.id ? null : s.id)
                  }
                  className={`grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_100px_100px_180px] px-5 py-4 border-b border-[#1a1a1a] cursor-pointer transition-colors ${
                    expandedRow === s.id
                      ? "bg-[#111]"
                      : "hover:bg-[#0a0a0a]"
                  } ${
                    showTopOnly && index < 3 ? "border-l-2 border-l-amber-500/60" : ""
                  }`}
                >
                  {/* Project */}
                  <div className="flex items-center gap-3 min-w-0">
                    {showTopOnly && (
                      <span className="text-[13px] font-mono text-amber-500/80 flex-shrink-0 w-5">
                        #{index + 1}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[15px] font-medium truncate text-white">
                        {s.project_name}
                      </p>
                      <p className="text-[13px] text-[#525252] truncate">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  {/* Builder */}
                  <div className="flex items-center mt-2 lg:mt-0">
                    <div className="min-w-0">
                      <p className="text-[14px] text-[#a3a3a3] truncate">
                        {s.your_name}
                      </p>
                      <p className="text-[12px] text-[#525252] truncate">
                        @{s.v0_username}
                      </p>
                    </div>
                  </div>

                  {/* Avg score */}
                  <div className="flex items-center mt-2 lg:mt-0">
                    <div className="flex items-center gap-1.5">
                      <Star
                        className={`w-4 h-4 ${
                          s.avg_score >= 4
                            ? "text-amber-400"
                            : s.avg_score >= 2.5
                              ? "text-[#737373]"
                              : "text-[#404040]"
                        }`}
                        fill={s.avg_score >= 4 ? "currentColor" : "none"}
                      />
                      <span className="text-[15px] font-mono text-white">
                        {s.avg_score > 0 ? s.avg_score.toFixed(1) : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Total ratings */}
                  <div className="flex items-center mt-2 lg:mt-0">
                    <span className="text-[14px] font-mono text-[#737373]">
                      {s.total_ratings}
                    </span>
                  </div>

                  {/* Star rating */}
                  <div
                    className="flex items-center gap-0.5 mt-3 lg:mt-0"
                    onClick={(e) => e.stopPropagation()}
                    onMouseLeave={() => setHoveredStar(null)}
                  >
                    {ratingInFlight === s.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#525252]" />
                    ) : (
                      Array.from({ length: 5 }, (_, i) => i + 1).map(
                        (score) => {
                          const isActive =
                            (hoveredStar?.id === s.id &&
                              score <= hoveredStar.score) ||
                            (!hoveredStar?.id || hoveredStar.id !== s.id
                              ? s.my_score != null && score <= s.my_score
                              : false)
                          return (
                            <button
                              key={score}
                              onClick={() => rateSubmission(s.id, score)}
                              onMouseEnter={() =>
                                setHoveredStar({ id: s.id, score })
                              }
                              className="p-0.5 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-5 h-5 transition-colors ${
                                  isActive
                                    ? "text-amber-400"
                                    : "text-[#333] hover:text-[#555]"
                                }`}
                                fill={isActive ? "currentColor" : "none"}
                              />
                            </button>
                          )
                        }
                      )
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {expandedRow === s.id && (
                  <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-5 py-5">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Links */}
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                          LINKS
                        </p>
                        <div className="space-y-1.5">
                          <a
                            href={s.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[14px] text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            Live URL
                          </a>
                          <a
                            href={s.v0_project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[14px] text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            v0 Project
                          </a>
                          {s.github_repo_url && (
                            <a
                              href={s.github_repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[14px] text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              GitHub
                            </a>
                          )}
                          {s.social_proof_link && (
                            <a
                              href={s.social_proof_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[14px] text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              Social Post
                            </a>
                          )}
                          {s.video_url && (
                            <a
                              href={s.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[14px] text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <Video className="w-3.5 h-3.5 flex-shrink-0" />
                              Video Walkthrough
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                          CATEGORIES
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.global_categories?.map((c: string) => (
                            <span
                              key={c}
                              className="px-2.5 py-1 bg-[#1a1a1a] border border-[#262626] rounded text-[12px] text-[#a3a3a3]"
                            >
                              {c}
                            </span>
                          ))}
                          {s.local_categories?.map((c: string) => (
                            <span
                              key={c}
                              className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-[12px] text-amber-400"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {s.notes && (
                        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                          <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                            NOTES
                          </p>
                          <p className="text-[13px] text-[#a3a3a3] leading-relaxed whitespace-pre-wrap bg-[#111] border border-[#1a1a1a] rounded-lg p-3">
                            {s.notes}
                          </p>
                        </div>
                      )}

                      {/* Contact */}
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px]">
                          CONTACT
                        </p>
                        <p className="text-[14px] text-[#a3a3a3]">
                          {s.email}
                        </p>
                        <p className="text-[12px] text-[#525252]">
                          Submitted{" "}
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
