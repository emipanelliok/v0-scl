"use server"

import { neon } from "@neondatabase/serverless"

export interface LocalSubmissionPayload {
  projectName: string
  description: string
  liveUrl: string
  githubUrl?: string
  yourName: string
  email: string
  track: string
  ciudad: string
}

export async function submitLocalProject(
  data: LocalSubmissionPayload
): Promise<{ success: boolean; error?: string }> {
  if (!data.projectName?.trim()) return { success: false, error: "El nombre del proyecto es obligatorio." }
  if (!data.description?.trim()) return { success: false, error: "La descripción es obligatoria." }
  if (!data.liveUrl?.trim()) return { success: false, error: "La URL del proyecto es obligatoria." }
  if (!data.yourName?.trim()) return { success: false, error: "Tu nombre es obligatorio." }
  if (!data.email?.trim()) return { success: false, error: "El email es obligatorio." }
  if (!data.track?.trim()) return { success: false, error: "Seleccioná una categoría." }

  try {
    new URL(data.liveUrl)
  } catch {
    return { success: false, error: "La URL del proyecto no es válida." }
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)

    await sql`
      CREATE TABLE IF NOT EXISTS local_submissions (
        id SERIAL PRIMARY KEY,
        ciudad TEXT NOT NULL,
        project_name TEXT NOT NULL,
        description TEXT NOT NULL,
        live_url TEXT NOT NULL,
        github_url TEXT,
        your_name TEXT NOT NULL,
        email TEXT NOT NULL,
        track TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `

    await sql`
      INSERT INTO local_submissions (
        ciudad, project_name, description, live_url,
        github_url, your_name, email, track
      ) VALUES (
        ${data.ciudad},
        ${data.projectName.trim()},
        ${data.description.trim()},
        ${data.liveUrl.trim()},
        ${data.githubUrl?.trim() || null},
        ${data.yourName.trim()},
        ${data.email.trim()},
        ${data.track}
      )
    `

    return { success: true }
  } catch (err) {
    console.error("Error guardando submission:", err)
    return { success: false, error: "Error al guardar el proyecto. Intentá de nuevo." }
  }
}
