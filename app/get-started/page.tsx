"use client"

import React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { logos, agendaItems, sponsors, formatIndex } from "@/lib/data"
import Link from "next/link"
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Sparkles,
  ArrowLeft,
  Clock,
  Trophy,
  Zap,
  BookOpen,
  Link2,
  ChevronDown,
  Award,
  Wifi
} from "lucide-react"

// Custom hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Hook to track which section is currently active in viewport
function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { threshold: 0.2, rootMargin: "-100px 0px -50% 0px" }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sectionIds])

  return activeSection
}

const timeline = [
  { label: "Submissions & Voting Close", date: "February 8, 2026" },
  { label: "Winners Announced", date: "Week of February 10, 2026" },
]

const tracks = [
  { name: "GTM", description: "Close deals faster. Automate research, personalize demos, and generate proposals on demand." },
  { name: "Marketing", description: "Turn ideas into campaigns. Repurpose content, analyze performance, and ship without waiting." },
  { name: "Design", description: "Refine layouts and maintain systems. Check consistency, document components, iterate faster." },
  { name: "Data & Ops", description: "Automate reporting and surface insights. Monitor metrics, alert on issues, keep teams informed." },
  { name: "Product", description: "Turn feedback and PRDs into prototypes. Synthesize, prioritize, and ship specs faster." },
  { name: "Engineering", description: "Unblock stakeholders without breaking prod. Triage, document, and automate the tedious stuff." },
]

// Sponsored challenges data
const gailSponsor = sponsors.find((s) => s.name === "Gail")
const kurzoSponsor = sponsors.find((s) => s.name === "Kurzo")
const basementSponsor = sponsors.find((s) => s.name === "Basement")

const sponsoredChallenges = [
  {
    id: "gail",
    sponsor: gailSponsor,
    companyName: "Gail",
    companyDescription: "Gail is a conversational AI built for financial services \u2014 insurance, banking, and finance. It helps teams sell more, serve customers 24/7, and make smarter decisions. Available across voice, chat, text, email, and WhatsApp. Trusted by State Farm, Allstate, Farmers, and more.",
    companyUrl: "https://www.meetgail.com/",
    challengeTitle: "Gail Challenge",
    challengeDescription: "Build an AI-agent system that turns messy conversation history into evolving behavioral profiles, then uses them live in conversation. Build four pieces: Profile Engine, Dynamic Fit Scoring, Live Agent, and Profile Evolution.",
    dataUrl: "https://drive.google.com/file/d/1OoOX0zsrQVtFd34-DfOpxh7QVP6jN2i7/view?usp=sharing",
    prizes: [
      { place: "1st Place", amount: "$700" },
      { place: "2nd Place", amount: "$200" },
      { place: "3rd Place", amount: "$100" },
    ],
    totalPrize: "$1,000",
    judgingCriteria: ["Depth of insight", "Profile evolution", "Agent usefulness", "Explainability", "Creativity"],
  },
  {
    id: "kurzo",
    sponsor: kurzoSponsor,
    companyName: "Kurzo",
    companyDescription: "Kurzo turns expertise into education. Share what you know \u2014 a document, an idea, even just a conversation \u2014 and AI shapes it into something others can actually learn from. No course-building expertise required. No months of production. Knowledge stops being locked in people\u2019s heads. It starts flowing.",
    companyUrl: "https://kurzo.io",
    challengeTitle: "Kurzo Challenge",
    challengeDescription: "Build a tool that takes unstructured input (notes, voice, images, URLs, files) and transforms them into organized, actionable output. The system should surface themes, priorities, and next steps \u2014 but the user must be able to refine the structure themselves. Bonus points for handling new input without starting from scratch.",
    prizes: [
      { place: "Winner", amount: "$250" },
    ],
    totalPrize: "$250",
    judgingCriteria: null,
  },
  {
    id: "basement",
    sponsor: basementSponsor,
    companyName: "Basement",
    companyDescription: "Basement is a social browser that turns every webpage into a chat room. They also created OpenClaw \u2014 an open-source personal AI assistant (20k+ GitHub stars) that runs on your device and automates tasks via WhatsApp, Telegram, Discord, and more. It manages email, calendar, browser automation, and complex multi-step workflows autonomously.",
    companyUrl: "https://basementbrowser.com",
    challengeTitle: "Basement Challenge",
    challengeDescription: "Build an application powered by OpenClaw. Your project can be anything: a tool, an agent, a workflow, or a product. The only requirement is that OpenClaw is a core part of how it works, not just an add-on. Focus on building something that feels like a real product, not just a demo.",
    prizes: [
      { place: "Winner", amount: "$250" },
    ],
    totalPrize: "$250",
    judgingCriteria: ["Clear Use Case (30%)", "OpenClaw Usage (30%)", "Product Quality (25%)", "Overall Impact (15%)"],
    extra: {
      label: "Submission via",
      value: "Basement Browser iOS app",
      url: "https://basementbrowser.com/app",
    },
    secondaryLinks: [
      { label: "OpenClaw", url: "https://openclaw.ai" },
    ],
  },
]

const usefulLinks = [
  { label: "v0.dev", description: "Start building with v0", url: "https://v0.dev", icon: Zap },
  { label: "v0 Docs", description: "Documentation & guides", url: "https://v0.dev/docs", icon: BookOpen },
  { label: "Vercel", description: "Deploy your project", url: "https://vercel.com", icon: ExternalLink },
  { label: "Official Hackathon", description: "Global event page", url: "https://v0-v0prompttoproduction2026.vercel.app", icon: Trophy },
  { label: "Inspiration Gallery", description: "Browse prompts & ideas", url: "https://v0-v0prompttoproduction2026.vercel.app/inspiration", icon: Sparkles },
  { label: "Gail", description: "Conversational AI for finance", url: "https://www.meetgail.com/", icon: Link2 },
  { label: "Kurzo", description: "Turn expertise into education", url: "https://kurzo.io", icon: Link2 },
  { label: "Basement Browser", description: "Social browser", url: "https://basementbrowser.com", icon: Link2 },
  { label: "OpenClaw", description: "Open-source personal AI", url: "https://openclaw.ai", icon: Link2 },
]

// Prompt templates organized by track
const promptTemplates = [
  {
    track: "Marketing",
    prompts: [
      {
        title: "Landing Page Generator",
        prompt: "Create a high-converting landing page for a SaaS product. Include a hero section with headline, subheadline, and CTA button. Add social proof section with testimonials, a features grid with icons, pricing table with 3 tiers, and a final CTA section. Use a modern dark theme with accent colors.",
      },
      {
        title: "Email Campaign Builder",
        prompt: "Build an email template builder where users can create marketing emails using drag-and-drop blocks. Include header, text, image, button, and footer components. Add preview mode for desktop and mobile. Export as HTML.",
      },
      {
        title: "Social Media Dashboard",
        prompt: "Create a social media analytics dashboard showing engagement metrics across platforms. Include charts for followers growth, post performance, and engagement rates. Add a content calendar view and post scheduler interface.",
      },
    ],
  },
  {
    track: "GTM",
    prompts: [
      {
        title: "Launch Countdown",
        prompt: "Build a product launch countdown page with an animated timer, email waitlist signup, and social sharing buttons. Include a teaser section with product features and early access benefits. Add confetti animation when users sign up.",
      },
      {
        title: "Competitor Analysis Tool",
        prompt: "Create a competitor comparison tool where users can input competitor URLs and see a side-by-side feature comparison table. Include pricing comparison, feature checklist, and a summary recommendation section.",
      },
      {
        title: "Sales Pitch Deck",
        prompt: "Build an interactive pitch deck presentation tool. Include slides for problem, solution, market size, business model, traction, team, and ask. Add presenter mode with notes and a timer. Allow navigation via keyboard arrows.",
      },
    ],
  },
  {
    track: "Engineering",
    prompts: [
      {
        title: "API Documentation",
        prompt: "Create an interactive API documentation page with endpoint listings, request/response examples with syntax highlighting, authentication guide, and a live API playground where users can test endpoints. Include copy buttons for code snippets.",
      },
      {
        title: "Code Review Dashboard",
        prompt: "Build a code review interface showing pull requests, diff viewer with syntax highlighting, comment threads, and approval workflow. Include filters for status, author, and repository. Add keyboard shortcuts for navigation.",
      },
      {
        title: "Database Schema Designer",
        prompt: "Create a visual database schema designer where users can add tables, define columns with types, and create relationships. Include drag-and-drop positioning, export to SQL, and an ERD visualization mode.",
      },
    ],
  },
  {
    track: "Design",
    prompts: [
      {
        title: "Color Palette Generator",
        prompt: "Build a color palette generator that creates harmonious color schemes. Include options for complementary, analogous, triadic, and split-complementary. Show accessibility contrast ratios, export as CSS variables, and generate Tailwind config.",
      },
      {
        title: "Component Library Showcase",
        prompt: "Create a component library documentation site with live component previews, prop tables, code examples, and copy-to-clipboard functionality. Include dark/light mode toggle and responsive preview sizes.",
      },
      {
        title: "Design System Tokens",
        prompt: "Build a design tokens manager where users can define typography scales, spacing systems, color palettes, and shadow styles. Include visual preview for each token and export options for CSS, JSON, and Tailwind config.",
      },
    ],
  },
  {
    track: "Product",
    prompts: [
      {
        title: "User Feedback Board",
        prompt: "Create a feature request and feedback board where users can submit ideas, vote on existing ones, and see status updates. Include categories, search, sorting by votes/date, and an admin view for managing requests.",
      },
      {
        title: "Onboarding Flow Builder",
        prompt: "Build an onboarding flow designer with step-by-step wizard UI. Include progress indicator, skip options, different input types (text, select, multi-select), and a completion celebration screen.",
      },
      {
        title: "Product Roadmap",
        prompt: "Create an interactive product roadmap with timeline view, kanban board, and list views. Include milestones, feature cards with status tags, filtering by quarter/status, and drag-and-drop for reordering.",
      },
    ],
  },
]

// Navigation sections config
const NAV_SECTIONS = [
  { id: "wifi", label: "WiFi" },
  { id: "timeline", label: "Timeline" },
  { id: "agenda", label: "Agenda" },
  { id: "tracks", label: "Tracks" },
  { id: "challenges", label: "Prizes" },
  { id: "prompts", label: "Prompts" },
  { id: "links", label: "Links" },
]

export default function GetStartedPage() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [navSticky, setNavSticky] = useState(false)
  
  // Prompt templates state
  const [activeTrack, setActiveTrack] = useState("Marketing")
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  
  // Expanded challenge state
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null)
  
  const creditsSection = useInView(0.2)
  const timelineSection = useInView(0.2)
  const agendaSection = useInView(0.2)
  const tracksSection = useInView(0.2)
  const challengesSection = useInView(0.1)
  const promptPackSection = useInView(0.2)
  const linksSection = useInView(0.2)

  const navRef = useRef<HTMLDivElement>(null)

  const activeSection = useActiveSection(NAV_SECTIONS.map((s) => s.id))

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      // Check if nav should be sticky
      if (navRef.current) {
        const navTop = navRef.current.getBoundingClientRect().top
        setNavSticky(navTop <= 100)
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const copyPrompt = async (promptText: string, promptTitle: string) => {
    await navigator.clipboard.writeText(promptText)
    setCopiedPrompt(promptTitle)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 120
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }, [])

  const toggleChallenge = (id: string) => {
    setExpandedChallenge((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden scroll-smooth">
      {/* Fixed Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div 
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-0 py-8 lg:py-[49px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[18px] group cursor-pointer">
              <Link href="/" className="flex items-center gap-[18px]">
                <img 
                  src={logos.v0 || "/placeholder.svg"} 
                  alt="v0" 
                  className="h-[24px] w-[50px] transition-opacity duration-300 group-hover:opacity-80" 
                />
                <span className="font-mono text-[12px] text-[#737373] tracking-[2.4px] [text-shadow:0px_0px_4px_black] transition-colors duration-300 group-hover:text-white">
                  HACKATHON GUIDE
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="group flex items-center gap-2 text-[14px] text-[#737373] hover:text-white transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back to Event</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-32 pb-8 px-6">
        <div className={`max-w-[900px] mx-auto text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px] mb-6">
            PARTICIPANT GUIDE
          </p>
          <h1 className="text-[40px] md:text-[60px] lg:text-[80px] font-normal leading-[1.1] tracking-[-0.04em] text-white mb-8">
            Get Started
          </h1>
          <p className="text-[18px] lg:text-[22px] text-[#a1a1a1] leading-[1.6] max-w-[600px] mx-auto">
            Everything you need to participate in v0 Prompt to Production Week 2026. Let&apos;s ship something amazing together.
          </p>
        </div>
        {/* Scroll hint */}
        <div className={`mt-12 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button 
            onClick={() => scrollToSection("wifi")}
            className="flex flex-col items-center gap-2 text-[#737373] hover:text-white transition-colors duration-300"
          >
            <span className="font-mono text-[12px] tracking-[2px]">SCROLL TO EXPLORE</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Section Navigation */}
      <div ref={navRef} className="sticky top-[0px] z-40">
        <div className={`transition-all duration-300 ${navSticky ? 'bg-black/90 backdrop-blur-md border-b border-[#1a1a1a]' : 'bg-transparent'}`}>
          <div className="mx-auto max-w-[1400px] px-6 lg:px-0">
            <nav className={`flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-[1.5px] whitespace-nowrap transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-white text-black"
                      : "text-[#737373] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {section.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] bg-black pb-16">
        
        {/* WiFi Section */}
        <section 
          id="wifi"
          ref={creditsSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] transition-all duration-700 ${creditsSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-[#737373]" />
                <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                  WIFI
                </p>
              </div>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${creditsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-6">
                Connect to WiFi
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-8">
                Use the venue WiFi to get online and start building.
              </p>
              
              {/* WiFi Info Box */}
              <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg p-6">
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                      NETWORK NAME (SSID)
                    </p>
                    <code className="font-mono text-[20px] lg:text-[26px] text-white tracking-wide">
                      LAB Guest
                    </code>
                  </div>
                  <div className="h-px bg-[#262626]" />
                  <div>
                    <p className="font-mono text-[12px] text-[#737373] tracking-[1.5px] mb-2">
                      PASSWORD
                    </p>
                    <code className="font-mono text-[20px] lg:text-[26px] text-white tracking-wide">
                      Thelabmiamiguest
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section 
          id="timeline"
          ref={timelineSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] transition-all duration-700 ${timelineSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#737373]" />
                <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                  TIMELINE
                </p>
              </div>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${timelineSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-8">
                Key dates to remember
              </h2>
              <div className="flex flex-col gap-0">
                {timeline.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-[#262626] ${index === timeline.length - 1 ? 'border-b-0' : ''} group hover:bg-white/[0.02] transition-colors duration-300`}
                  >
                    <span className="text-[18px] text-white mb-1 sm:mb-0 transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                    <span className="font-mono text-[14px] text-[#737373] transition-colors duration-300 group-hover:text-[#999]">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Agenda Section */}
        <section 
          id="agenda"
          ref={agendaSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-center lg:sticky lg:top-[140px] transition-all duration-700 ${agendaSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#737373]" />
                <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                  AGENDA
                </p>
              </div>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${agendaSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-4">
                Day-of schedule
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-8">
                February 7, 2026 at The Dock, Wynwood.
              </p>
              <div className="flex flex-col">
                {agendaItems.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-[10px] py-5 border-b border-[#262626] ${index === agendaItems.length - 1 ? 'border-b-0' : ''} group cursor-default hover:bg-white/[0.02] hover:pl-2 transition-all duration-300`}
                    style={{ 
                      transitionDelay: `${index * 60}ms`,
                      opacity: agendaSection.isInView ? 1 : 0,
                      transform: agendaSection.isInView ? 'translateY(0)' : 'translateY(12px)'
                    }}
                  >
                    <span className="font-mono text-[10px] text-[#737373] tracking-[-0.4px] font-extralight transition-all duration-300 group-hover:text-white">
                      {formatIndex(index)}
                    </span>
                    <span className="text-[18px] lg:text-[20px] text-white leading-[28px] transition-all duration-300 group-hover:translate-x-1">
                      {item.title}
                    </span>
                    <div className="flex-1 flex items-center justify-end">
                      <span className="text-[12px] lg:text-[14px] text-[#737373] leading-[24px] text-right transition-all duration-300 group-hover:text-[#999]">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tracks Section */}
        <section 
          id="tracks"
          ref={tracksSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-start lg:sticky lg:top-[140px] transition-all duration-700 ${tracksSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                TRACKS
              </p>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${tracksSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-4">
                Global tracks
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-10">
                Pick a track for the global competition. These categories help guide your project and organize voting.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {tracks.map((track, index) => (
                  <div 
                    key={index}
                    className="p-5 bg-[#0a0a0a] border border-[#262626] rounded-lg hover:border-[#404040] transition-all duration-500 group"
                    style={{ 
                      transitionDelay: `${index * 80}ms`,
                      opacity: tracksSection.isInView ? 1 : 0,
                      transform: tracksSection.isInView ? 'translateY(0)' : 'translateY(12px)'
                    }}
                  >
                    <span className="font-mono text-[10px] text-[#737373] tracking-[-0.4px] mb-2 block transition-colors duration-300 group-hover:text-white">{formatIndex(index)}</span>
                    <h3 className="text-[18px] text-white mb-2">{track.name}</h3>
                    <p className="text-[14px] text-[#737373] leading-[1.6]">{track.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sponsored Challenges / Local Prizes */}
        <section 
          id="challenges"
          ref={challengesSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-start lg:sticky lg:top-[140px] transition-all duration-700 ${challengesSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-[#737373]" />
                <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                  LOCAL PRIZES
                </p>
              </div>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${challengesSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-4">
                Sponsored challenges
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-10">
                Miami-exclusive prizes from our local sponsors. Each challenge has its own requirements and judging criteria. Total prize pool: <span className="text-white font-medium">$1,500</span>.
              </p>
              
              <div className="flex flex-col gap-6">
                {sponsoredChallenges.map((challenge, index) => (
                  <div 
                    key={challenge.id}
                    className="bg-[#0a0a0a] border border-[#262626] rounded-lg overflow-hidden hover:border-[#333] transition-all duration-500"
                    style={{ 
                      transitionDelay: `${index * 120}ms`,
                      opacity: challengesSection.isInView ? 1 : 0,
                      transform: challengesSection.isInView ? 'translateY(0)' : 'translateY(16px)'
                    }}
                  >
                    {/* Challenge Header (always visible) */}
                    <button
                      onClick={() => toggleChallenge(challenge.id)}
                      className="w-full p-6 flex items-start gap-5 text-left group"
                    >
                      {/* Sponsor Logo */}
                      <div className="flex-shrink-0 w-[60px] h-[60px] lg:w-[72px] lg:h-[72px] bg-[#111] border border-[#262626] rounded-lg flex items-center justify-center p-2">
                        {challenge.sponsor && (
                          <img 
                            src={challenge.sponsor.logo || "/placeholder.svg"} 
                            alt={challenge.companyName}
                            className="w-auto max-w-full max-h-full"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-[20px] lg:text-[22px] text-white font-medium">
                            {challenge.challengeTitle}
                          </h3>
                          <span className="flex-shrink-0 px-3 py-1 bg-white/10 rounded-full font-mono text-[12px] text-white tracking-wide">
                            {challenge.totalPrize}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#737373] leading-[1.6] line-clamp-2">
                          {challenge.companyDescription}
                        </p>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-[#737373] flex-shrink-0 mt-1 transition-transform duration-300 ${
                          expandedChallenge === challenge.id ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>

                    {/* Expanded Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        expandedChallenge === challenge.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6 space-y-6">
                        {/* Divider */}
                        <div className="h-px bg-[#262626]" />
                        
                        {/* About the company */}
                        <div>
                          <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px] mb-3">ABOUT {challenge.companyName.toUpperCase()}</p>
                          <p className="text-[15px] text-[#a1a1a1] leading-[1.7]">
                            {challenge.companyDescription}
                          </p>
                          <a 
                            href={challenge.companyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 mt-3 text-[14px] text-white hover:underline underline-offset-4"
                          >
                            {challenge.companyUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          {challenge.secondaryLinks && (
                            <div className="flex gap-4 mt-2">
                              {challenge.secondaryLinks.map((link) => (
                                <a 
                                  key={link.label}
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1.5 text-[14px] text-[#737373] hover:text-white transition-colors"
                                >
                                  {link.label}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* The challenge */}
                        <div>
                          <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px] mb-3">THE CHALLENGE</p>
                          <p className="text-[15px] text-[#a1a1a1] leading-[1.7]">
                            {challenge.challengeDescription}
                          </p>
                          {challenge.dataUrl && (
                            <div className="mt-4 p-4 bg-[#111] border border-[#262626] rounded-lg">
                              <p className="text-[13px] text-[#737373] mb-1">Required Dataset</p>
                              <a 
                                href={challenge.dataUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 text-[14px] text-white hover:underline underline-offset-4"
                              >
                                Download ConversationData.zip
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Prizes */}
                        <div>
                          <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px] mb-3">PRIZES</p>
                          <div className="flex flex-wrap gap-3">
                            {challenge.prizes.map((prize) => (
                              <div key={prize.place} className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#262626] rounded-lg">
                                <Award className="w-4 h-4 text-[#737373]" />
                                <span className="text-[14px] text-[#737373]">{prize.place}</span>
                                <span className="text-[16px] text-white font-medium">{prize.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Judging Criteria */}
                        {challenge.judgingCriteria && (
                          <div>
                            <p className="font-mono text-[11px] text-[#525252] tracking-[1.5px] mb-3">JUDGED ON</p>
                            <div className="flex flex-wrap gap-2">
                              {challenge.judgingCriteria.map((criteria) => (
                                <span key={criteria} className="px-3 py-1.5 bg-[#111] border border-[#262626] rounded-md text-[13px] text-[#a1a1a1]">
                                  {criteria}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Extra info (e.g. Basement submission) */}
                        {challenge.extra && (
                          <div className="p-4 bg-[#111] border border-[#262626] rounded-lg">
                            <p className="text-[13px] text-[#737373] mb-1">{challenge.extra.label}</p>
                            <a 
                              href={challenge.extra.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 text-[14px] text-white hover:underline underline-offset-4"
                            >
                              {challenge.extra.value}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prompt Templates Section */}
        <section 
          id="prompts"
          ref={promptPackSection.ref}
          className="border-t lg:border lg:border-b-0 border-[#262626] px-6 lg:px-16 py-16 lg:py-24"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-start lg:sticky lg:top-[140px] transition-all duration-700 ${promptPackSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                RESOURCES
              </p>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${promptPackSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-4">
                Prompt Templates
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-8">
                Curated prompts to kickstart your builds. Select a track below and copy any prompt directly into v0.
              </p>
              
              {/* Track Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {promptTemplates.map((trackData) => (
                  <button
                    key={trackData.track}
                    onClick={() => setActiveTrack(trackData.track)}
                    className={`px-4 py-2 rounded-lg font-mono text-[12px] tracking-wide transition-all duration-300 ${
                      activeTrack === trackData.track
                        ? "bg-white text-black"
                        : "bg-[#0a0a0a] text-[#737373] border border-[#262626] hover:border-[#404040] hover:text-white"
                    }`}
                  >
                    {trackData.track}
                  </button>
                ))}
              </div>

              {/* Prompt Cards */}
              <div className="space-y-4">
                {promptTemplates
                  .find((t) => t.track === activeTrack)
                  ?.prompts.map((promptData, index) => (
                    <div
                      key={index}
                      className="group p-5 bg-[#0a0a0a] border border-[#262626] rounded-lg hover:border-[#404040] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-[16px] font-medium text-white">
                          {promptData.title}
                        </h3>
                        <button
                          onClick={() => copyPrompt(promptData.prompt, promptData.title)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-mono transition-all duration-300 flex-shrink-0 ${
                            copiedPrompt === promptData.title
                              ? "bg-green-500/20 text-green-400"
                              : "bg-[#1a1a1a] text-[#737373] hover:text-white hover:bg-[#262626]"
                          }`}
                        >
                          {copiedPrompt === promptData.title ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[14px] text-[#a1a1a1] leading-[1.6]">
                        {promptData.prompt}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Link to full inspiration page */}
              <div className="mt-8 p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg">
                <p className="text-[14px] text-[#737373] mb-3">
                  Want more inspiration? Check out the full collection with even more prompts and ideas.
                </p>
                <a
                  href="https://v0-v0prompttoproduction2026.vercel.app/inspiration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:underline text-[14px]"
                >
                  Browse all prompts
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Useful Links Section */}
        <section 
          id="links"
          ref={linksSection.ref}
          className="border-t lg:border border-[#262626] px-6 lg:px-16 py-16 lg:py-24 lg:mb-16"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            <div className={`w-full lg:w-[232px] flex items-start lg:sticky lg:top-[140px] transition-all duration-700 ${linksSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-[#737373]" />
                <p className="font-mono text-[14px] text-[#737373] tracking-[2.8px]">
                  LINKS
                </p>
              </div>
            </div>
            <div className={`flex-1 max-w-[700px] transition-all duration-700 delay-100 ${linksSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="text-[28px] lg:text-[36px] font-medium leading-[1.2] tracking-[-0.02em] text-white mb-4">
                Useful links
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#a1a1a1] leading-[1.7] mb-10">
                Quick access to everything you might need.
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {usefulLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-4 bg-[#0a0a0a] border border-[#262626] rounded-lg hover:border-[#404040] transition-all duration-300"
                      style={{ 
                        transitionDelay: `${index * 50}ms`,
                        opacity: linksSection.isInView ? 1 : 0,
                        transform: linksSection.isInView ? 'translateY(0)' : 'translateY(8px)'
                      }}
                    >
                      <ExternalLink className="absolute top-3 right-3 w-3.5 h-3.5 text-[#737373] opacity-0 translate-x-1 -translate-y-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
                      <Icon className="w-4 h-4 text-[#525252] mb-2" />
                      <h3 className="text-[15px] text-white mb-1 transition-colors duration-300 group-hover:text-white">{link.label}</h3>
                      <p className="text-[12px] text-[#737373] leading-[1.5]">{link.description}</p>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
