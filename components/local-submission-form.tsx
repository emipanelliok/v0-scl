"use client"

import { useState } from "react"
import { submitLocalProject } from "@/app/actions/submit-local-project"
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react"

const trackOptions = [
  "Productividad",
  "Educación",
  "Salud",
  "Entretenimiento",
  "Herramientas para devs",
  "Finanzas",
  "Otro",
]

interface LocalSubmissionFormProps {
  ciudad: string
}

export default function LocalSubmissionForm({ ciudad }: LocalSubmissionFormProps) {
  const [form, setForm] = useState({
    projectName: "",
    description: "",
    liveUrl: "",
    githubUrl: "",
    yourName: "",
    email: "",
    track: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const result = await submitLocalProject({ ...form, ciudad })

    if (result.success) {
      setStatus("success")
    } else {
      setStatus("error")
      setErrorMsg(result.error || "Error desconocido.")
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <CheckCircle2 className="w-16 h-16 text-white" />
        <h2 className="text-[32px] font-light text-white">¡Proyecto enviado!</h2>
        <p className="text-[#737373] font-mono text-sm">Tu proyecto fue recibido correctamente.</p>
        <a
          href="/proyectos"
          className="font-mono text-sm text-white border border-[#333] px-6 py-3 hover:border-white transition-colors"
        >
          VER TODOS LOS PROYECTOS →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[720px] px-6 pb-24 flex flex-col gap-10">

      {/* Project name */}
      <div className="flex flex-col gap-3 border-b border-[#262626] pb-10">
        <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">NOMBRE DEL PROYECTO *</label>
        <input
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          placeholder="ej. ShipLog"
          required
          className="bg-transparent border-0 border-b border-[#333] text-white text-[20px] font-light py-2 focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-3 border-b border-[#262626] pb-10">
        <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">DESCRIPCIÓN *</label>
        <p className="text-[13px] text-[#525252]">¿Qué construiste y para quién es? Algunas oraciones alcanzan.</p>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Mi proyecto hace..."
          required
          rows={4}
          className="bg-transparent border border-[#333] text-white text-[16px] font-light p-4 focus:outline-none focus:border-white transition-colors placeholder:text-[#444] resize-none"
        />
      </div>

      {/* Live URL */}
      <div className="flex flex-col gap-3 border-b border-[#262626] pb-10">
        <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">URL DEL PROYECTO (DESPLEGADO EN VERCEL) *</label>
        <input
          name="liveUrl"
          value={form.liveUrl}
          onChange={handleChange}
          placeholder="https://mi-proyecto.vercel.app"
          type="url"
          required
          className="bg-transparent border-0 border-b border-[#333] text-white text-[16px] font-light py-2 focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
        />
      </div>

      {/* GitHub URL */}
      <div className="flex flex-col gap-3 border-b border-[#262626] pb-10">
        <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">REPOSITORIO DE GITHUB <span className="text-[#525252]">(opcional)</span></label>
        <input
          name="githubUrl"
          value={form.githubUrl}
          onChange={handleChange}
          placeholder="https://github.com/usuario/repo"
          type="url"
          className="bg-transparent border-0 border-b border-[#333] text-white text-[16px] font-light py-2 focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
        />
      </div>

      {/* Track */}
      <div className="flex flex-col gap-3 border-b border-[#262626] pb-10">
        <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">CATEGORÍA *</label>
        <select
          name="track"
          value={form.track}
          onChange={handleChange}
          required
          className="bg-black border border-[#333] text-white text-[16px] font-light p-4 focus:outline-none focus:border-white transition-colors appearance-none"
        >
          <option value="" disabled>Seleccioná una opción</option>
          {trackOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[#262626] pb-10">
        <div className="flex flex-col gap-3">
          <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">TU NOMBRE *</label>
          <input
            name="yourName"
            value={form.yourName}
            onChange={handleChange}
            placeholder="Juan García"
            required
            className="bg-transparent border-0 border-b border-[#333] text-white text-[16px] font-light py-2 focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-mono text-[12px] text-[#737373] tracking-[2px]">EMAIL *</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="juan@ejemplo.com"
            type="email"
            required
            className="bg-transparent border-0 border-b border-[#333] text-white text-[16px] font-light py-2 focus:outline-none focus:border-white transition-colors placeholder:text-[#444]"
          />
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-red-400 font-mono text-sm">{errorMsg}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start flex items-center gap-3 bg-white text-black px-8 py-4 font-mono text-[14px] tracking-[1px] hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> ENVIANDO...</>
        ) : (
          <><ExternalLink className="w-4 h-4" /> ENVIAR PROYECTO</>
        )}
      </button>
    </form>
  )
}
