import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const ciudad = searchParams.get("ciudad") || ""

    const rows = await sql`
      SELECT id, ciudad, project_name, description, live_url,
             github_url, your_name, track, created_at
      FROM local_submissions
      WHERE ciudad = ${ciudad}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ submissions: rows })
  } catch (err) {
    console.error("Error fetching local submissions:", err)
    return NextResponse.json({ error: "Error al obtener proyectos." }, { status: 500 })
  }
}
