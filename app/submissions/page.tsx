import { neon } from "@neondatabase/serverless"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { SubmissionsGrid, type Submission } from "@/components/submissions-grid"

export const metadata: Metadata = {
  title: "Submissions - v0 IRL Miami",
  description:
    "Browse all projects built at v0 Prompt to Production Miami. Real apps, real work, shipped live.",
}

export const dynamic = "force-dynamic"

async function getSubmissions(): Promise<Submission[]> {
  const sql = neon(process.env.DATABASE_URL!)
  const rows = await sql`
    SELECT
      id,
      project_name,
      live_url,
      v0_project_url,
      github_repo_url,
      global_categories,
      local_categories,
      your_name,
      v0_username,
      description,
      social_proof_link,
      video_url,
      notes,
      email,
      created_at
    FROM submissions
    ORDER BY created_at DESC
  `
  return rows as Submission[]
}

export default async function SubmissionsPage() {
  const submissions = await getSubmissions()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="mx-auto max-w-[1400px] px-6 lg:px-16 pt-12 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] text-[#737373] hover:text-white transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-mono tracking-[1.5px]">BACK</span>
        </Link>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-[12px] text-[#525252] tracking-[2.4px]">
            V0 IRL MIAMI
          </p>
          <h1 className="text-[36px] md:text-[52px] lg:text-[68px] font-normal leading-[1.05] tracking-[-0.04em] text-white text-balance">
            What people built
          </h1>
          <p className="text-[16px] lg:text-[18px] text-[#737373] leading-relaxed max-w-[600px]">
            {submissions.length} project{submissions.length !== 1 ? "s" : ""}{" "}
            shipped at Prompt to Production Miami. Real apps, real work.
          </p>
        </div>
      </header>

      {/* Submissions Grid */}
      <main className="mx-auto max-w-[1400px] px-6 lg:px-16 py-12 lg:py-16">
        {submissions.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#525252] text-[16px]">
              No submissions yet. Check back soon.
            </p>
          </div>
        ) : (
          <SubmissionsGrid submissions={submissions} />
        )}
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-[1400px] px-6 lg:px-16 py-12 border-t border-[#262626]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[12px] text-[#525252] tracking-[1.5px]">
            V0 PROMPT TO PRODUCTION - MIAMI 2026
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0f172a] rounded-full text-[14px] font-medium transition-all duration-300 hover:bg-[#e5e5e5] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Submit yours
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  )
}
