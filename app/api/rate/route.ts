import { neon } from "@neondatabase/serverless"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { submissionId, score, fingerprint } = body

    if (!submissionId || typeof score !== "number" || score < 1 || score > 5) {
      return NextResponse.json(
        { error: "Invalid submission ID or score (1-5)." },
        { status: 400 }
      )
    }

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Missing judge fingerprint." },
        { status: 400 }
      )
    }

    // Build judge ID from IP + fingerprint
    const headersList = await headers()
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown"

    // Simple hash: combine IP and fingerprint
    const judgeId = await hashJudgeId(ip, fingerprint)

    const sql = neon(process.env.DATABASE_URL!)

    // Upsert: insert or update existing rating
    await sql`
      INSERT INTO judge_ratings (submission_id, judge_id, score)
      VALUES (${submissionId}, ${judgeId}, ${score})
      ON CONFLICT (submission_id, judge_id)
      DO UPDATE SET score = ${score}, updated_at = NOW()
    `

    return NextResponse.json({ success: true, judgeId })
  } catch (err) {
    console.error("Failed to save rating:", err)
    return NextResponse.json(
      { error: "Failed to save rating." },
      { status: 500 }
    )
  }
}

// GET: resolve the judge ID so client can pass it to submissions query
export async function GET() {
  try {
    const headersList = await headers()
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown"

    return NextResponse.json({ ip })
  } catch {
    return NextResponse.json({ ip: "unknown" })
  }
}

async function hashJudgeId(ip: string, fingerprint: string): Promise<string> {
  const data = new TextEncoder().encode(`${ip}:${fingerprint}`)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
