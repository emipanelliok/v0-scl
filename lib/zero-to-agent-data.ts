// Event Data for Zero to Agent 2026

export const zeroToAgentData = {
  // Basic Event Info
  name: "Zero to Agent",
  tagline: "Semana Global de Construcción",
  greeting: "ESTÁS INVITADO A CONSTRUIR",

  // Date & Location
  date: "2 DE MAYO DE 2026",
  locationLabel: "LUGAR",
  venue: "Santiago de Chile",
  venueAddress: "https://maps.app.goo.gl/",

  // Event URL
  eventUrl: "https://luma.com/r6h41ax8",

  // Description
  description:
    "Zero to Agent es una semana global donde shipeamos agentes de IA reales con v0 y Vercel. Todos los proyectos entran a la competencia global con más de $6.000 en premios. Una entrega por persona, desplegado en Vercel.",

  // CTA
  ctaText: "Shipeá tu agente.",
}

export const zeroToAgentAgendaItems = [
  { title: "Puertas abiertas, networking", time: "16:00" },
  { title: "Bienvenida + intro a v0", time: "16:30" },
  { title: "¡A construir!", time: "17:00" },
  { title: "Sprint final", time: "19:30" },
  { title: "Demo showcase + votación", time: "20:00" },
  { title: "Cierre y networking", time: "21:00" },
]

export const zeroToAgentExperienceItems = [
  {
    title: "Construí Agentes Reales",
    description:
      "Shipeá algo que realmente sirva. Construido con v0, desplegado en Vercel.",
  },
  {
    title: "Competencia Global",
    description:
      "Presentá en el hub de la comunidad de Vercel. Una entrega por persona, sin equipos.",
  },
  {
    title: "$30 en Créditos v0",
    description:
      "Cada participante recibe $30 en créditos de v0 para usar durante la semana.",
  },
  {
    title: "Votación de la Comunidad",
    description:
      "24 horas de votación el 3 y 4 de mayo. Un voto por cuenta de Vercel.",
  },
]

export const zeroToAgentPrizes = [
  {
    place: "1er puesto",
    emoji: "🥇",
    prize: "$3.000 en créditos v0",
    extra: "$200/mes en créditos Vercel Platform + Vercel Pro por 6 meses",
  },
  {
    place: "2do puesto",
    emoji: "🥈",
    prize: "$2.000 en créditos v0",
    extra: "$100/mes en créditos Vercel Platform + Vercel Pro por 6 meses",
  },
  {
    place: "3er puesto",
    emoji: "🥉",
    prize: "$1.000 en créditos v0",
    extra: "$50/mes en créditos Vercel Platform + Vercel Pro por 6 meses",
  },
  {
    place: "Favorito de la Comunidad",
    emoji: "❤️",
    prize: "Ganador por voto popular",
    extra: "Premio independiente al del jurado",
  },
]

export const judgingCriteria = [
  {
    title: "Utilidad del Agente",
    description: "Aplicabilidad real y capacidad de resolver problemas concretos",
  },
  {
    title: "Ejecución Técnica",
    description: "Construido con v0, desplegado en Vercel",
  },
  {
    title: "Creatividad",
    description: "Originalidad y enfoque innovador",
  },
]

export const zeroToAgentSponsors = [
  {
    name: "Vercel",
    logo: "/sponsors/vercel.svg",
    url: "https://vercel.com",
    assetType: "svg" as const,
    height: 37,
  },
  {
    name: "AI Weekend",
    logo: "/sponsors/aiwknd.svg",
    url: "https://aiwknd.com",
    assetType: "svg" as const,
    height: 47,
  },
]
