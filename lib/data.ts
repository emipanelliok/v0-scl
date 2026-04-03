// Event Data for v0 IRL Miami

// Asset types
export type AssetType = "svg" | "png" | "jpg" | "jpeg" | "remote"

export interface Sponsor {
  name: string
  logo: string
  url: string
  assetType: AssetType
  height?: number
}

export const eventData = {
  // Basic Event Info
  name: "v0 IRL Miami",
  tagline: "Prompt to Production",
  greeting: "HELLO MIAMI! YOU'RE INVITED",
  
  // Date & Location
  date: "FEBRUARY 7, 2026",
  locationLabel: "LOCATION",
  venue: "The Dock, Wynwood",
  venueAddress: "https://maps.app.goo.gl/BaPMWqy1EPs51UyM9",
  
  // Event URL
  eventUrl: "https://lu.ma/i6959wdx", // Sign up URL
  
  // Description
  description: "v0 is getting ready to launch its biggest product update yet. We're celebrating with v0 IRLs around the world. And Miami is one of them. You're invited. Real apps, real work.",
  
  // CTA
  ctaText: "It's time to ship.",
}

export const agendaItems = [
  { title: "Doors open, networking", time: "12:30 PM" },
  { title: "Welcome + v0 video + product intro", time: "1:00 PM" },
  { title: "Building begins (curated prompts)", time: "1:45 PM" },
  { title: "Final build sprint", time: "6:45 PM" },
  { title: "Demo showcase + community voting", time: "7:45 PM" },
  { title: "Wrap-up, photos, networking", time: "8:00 PM" },
  { title: "Doors close", time: "9:00 PM" },
]

export const experienceItems = [
  {
    title: "Global Gallery",
    description: "Every project showcased in a worldwide exhibition",
  },
  {
    title: "Community Voting",
    description: "Builders vote for favorites, winners get prizes.",
  },
  {
    title: "Live DJ",
    description: "PARINI will set the vibes with science-backed music to ship your best idea.",
  },
  {
    title: "Local Prizes",
    description: "Thanks to the sponsors for this local event, we're able to provide prizes.",
  },
]

// Helper function to format index as padded number (01, 02, etc.)
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

export const sponsors: Sponsor[] = [
  {
    name: "Vercel",
    logo: "/sponsors/vercel.svg",
    url: "https://vercel.com",
    assetType: "svg",
    height: 37,
  },
  {
    name: "Kurzo",
    logo: "/sponsors/kurzo.svg",
    url: "https://kurzo.io",
    assetType: "svg",
  },
  {
    name: "Gail",
    logo: "/sponsors/gail.svg",
    url: "https://www.meetgail.com/",
    assetType: "svg",
  },
  {
    name: "Basement",
    logo: "/sponsors/basement.svg",
    url: "https://basement.dev",
    assetType: "svg",
  },
  {
    name: "UKG",
    logo: "/sponsors/ukg.svg",
    url: "https://www.ukg.com",
    assetType: "svg",
    height: 47,
  },
  {
    name: "The Lab Miami",
    logo: "/sponsors/the-lab.svg",
    url: "https://thelabmiami.com",
    assetType: "svg",
    height: 93,
  },
  {
    name: "DeepStation",
    logo: "/sponsors/deepstation.svg",
    url: "https://deepstation.ai",
    assetType: "svg",
    height: 47,
  },
  {
    name: "Glue Studios",
    logo: "/sponsors/glue-studios.svg",
    url: "https://www.thecreativeglue.com",
    assetType: "svg",
    height: 47,
  },
]

// Logo assets
export const logos = {
  v0: "/v0-logo.svg",
}

// Helper to determine asset type from file extension or URL
export function getAssetType(src: string): AssetType {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return "remote"
  }
  const ext = src.split(".").pop()?.toLowerCase()
  if (ext === "svg" || ext === "png" || ext === "jpg" || ext === "jpeg") {
    return ext as AssetType
  }
  return "remote"
}
