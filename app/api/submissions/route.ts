import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const judgeId = searchParams.get("judgeId") || ""

    const rows = await sql`
      SELECT
        s.id,
        s.project_name,
        s.live_url,
        s.v0_project_url,
        s.github_repo_url,
        s.global_categories,
        s.local_categories,
        s.your_name,
        s.v0_username,
        s.email,
        s.description,
        s.social_proof_link,
        s.video_url,
        s.notes,
        s.created_at,
        COALESCE(AVG(r.score), 0) AS avg_score,
        COUNT(r.id)::int AS total_ratings,
        (
          SELECT r2.score FROM judge_ratings r2
          WHERE r2.submission_id = s.id AND r2.judge_id = ${judgeId}
          LIMIT 1
        ) AS my_score
      FROM submissions s
      LEFT JOIN judge_ratings r ON r.submission_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `

    return NextResponse.json({ submissions: rows })
  } catch (err) {
    console.error("Failed to fetch submissions:", err)
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    )
  }
}
