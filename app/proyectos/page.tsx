import { neon } from "@neondatabase/serverless"
import { ExternalLink, ArrowLeft, Github } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getSubmissions() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql`
      SELECT id, project_name, description, live_url, github_url, your_name, track, created_at
      FROM local_submissions
      WHERE ciudad = 'santiago'
      ORDER BY created_at DESC
    `
    return rows
  } catch {
    return []
  }
}

function getScreenshot(url: string) {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800`
}

export default async function ProyectosPage() {
  const submissions = await getSubmissions()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-[1400px] px-6 lg:px-16 pt-12 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[12px] text-[#737373] hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          VOLVER
        </Link>
        <p className="font-mono text-[12px] text-[#525252] tracking-[2.4px] mb-4">SANTIAGO DE CHILE · 2 DE MAYO DE 2026</p>
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <h1 className="text-[52px] lg:text-[80px] font-light leading-[1.05] tracking-[-0.04em] text-white">
            Proyectos
          </h1>
          <Link
            href="/enviar"
            className="flex items-center gap-2 bg-white text-black px-6 py-3 font-mono text-[13px] tracking-[1px] hover:bg-gray-100 transition-colors mb-4"
          >
            <ExternalLink className="w-4 h-4" />
            ENVIAR MI PROYECTO
          </Link>
        </div>
      </header>

      {submissions.length === 0 ? (
        <div className="mx-auto max-w-[1400px] px-6 lg:px-16 py-24 text-center">
          <p className="text-[#737373] font-mono text-sm">Todavía no hay proyectos enviados.</p>
          <Link href="/enviar" className="inline-flex items-center gap-2 mt-8 font-mono text-sm text-white border border-[#333] px-6 py-3 hover:border-white transition-colors">
            SER EL PRIMERO →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#262626] border-t border-[#262626] mt-8">
          {submissions.map((s: any) => (
            <div key={s.id} className="bg-black p-8 flex flex-col gap-4 group">
              <a href={s.live_url} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden bg-[#111]">
                <img
                  src={getScreenshot(s.live_url)}
                  alt={s.project_name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </a>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-[20px] font-light text-white leading-tight">{s.project_name}</h2>
                  <span className="font-mono text-[10px] text-[#525252] border border-[#262626] px-2 py-1 whitespace-nowrap mt-1">{s.track}</span>
                </div>
                <p className="text-[14px] text-[#737373] leading-[1.6] line-clamp-3">{s.description}</p>
                <p className="font-mono text-[11px] text-[#525252] mt-auto pt-2">por {s.your_name}</p>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-[#1a1a1a]">
                <a href={s.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[11px] text-[#737373] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Ver proyecto
                </a>
                {s.github_url && (
                  <a href={s.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-mono text-[11px] text-[#737373] hover:text-white transition-colors">
                    <Github className="w-3 h-3" /> GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
