"use server"

import { neon } from "@neondatabase/serverless"

interface SubmissionPayload {
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

export async function submitProject(
  data: SubmissionPayload
): Promise<{ success: boolean; error?: string }> {
  // Basic server-side validation
  if (!data.projectName?.trim()) return { success: false, error: "Project name is required." }
  if (!data.liveUrl?.trim()) return { success: false, error: "Live URL is required." }
  if (!data.v0ProjectUrl?.trim()) return { success: false, error: "v0 project URL is required." }
  if (!data.yourName?.trim()) return { success: false, error: "Your name is required." }
  if (!data.v0Username?.trim()) return { success: false, error: "v0 username is required." }
  if (!data.email?.trim()) return { success: false, error: "Email is required." }
  if (!data.socialProofLink?.trim()) return { success: false, error: "Social proof link is required." }
  if (!data.globalCategories?.length) return { success: false, error: "Pick at least one category." }
  if (!data.localCategories?.length) return { success: false, error: "Pick at least one prize category." }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    const projectName = data.projectName?.trim() ?? ""
    const liveUrl = data.liveUrl?.trim() ?? ""
    const v0ProjectUrl = data.v0ProjectUrl?.trim() ?? ""
    const githubRepoUrl = data.githubRepoUrl?.trim() ?? ""
    const globalCategories = data.globalCategories ?? []
    const localCategories = data.localCategories ?? []
    const yourName = data.yourName?.trim() ?? ""
    const v0Username = data.v0Username?.trim() ?? ""
    const email = data.email?.trim() ?? ""
    const description = data.description?.trim() ?? ""
    const socialProofLink = data.socialProofLink?.trim() ?? ""
    const videoUrl = data.videoUrl?.trim() || null
    const notes = data.notes?.trim() || null

    await sql`
      INSERT INTO submissions (
        project_name,
        live_url,
        v0_project_url,
        github_repo_url,
        global_categories,
        local_categories,
        your_name,
        v0_username,
        email,
        description,
        social_proof_link,
        video_url,
        notes
      ) VALUES (
        ${projectName},
        ${liveUrl},
        ${v0ProjectUrl},
        ${githubRepoUrl},
        ${globalCategories},
        ${localCategories},
        ${yourName},
        ${v0Username},
        ${email},
        ${description},
        ${socialProofLink},
        ${videoUrl},
        ${notes}
      )
    `

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[v0] Failed to insert submission:", message, err)
    return { success: false, error: `Something went wrong saving your submission: ${message}` }
  }
}
