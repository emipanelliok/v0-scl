"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Dithering } from "@paper-design/shaders-react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Loader2,
  Layers,
} from "lucide-react";
import Backgrounds, {
  BACKGROUND_TYPES,
  type BackgroundType,
} from "@/components/backgrounds";
import { motion, AnimatePresence } from "framer-motion";
import NumberFlow from "@number-flow/react";
import Link from "next/link";
import { sponsors, logos, agendaItems } from "@/lib/data";
import SubmissionForm from "@/components/submission-form";

const TOTAL_SLIDES = 15;

// Global tracks data
const globalTracks = [
  {
    title: "GTM",
    description:
      "Close deals faster. Automate research, personalize demos, and generate proposals on demand.",
  },
  {
    title: "Marketing",
    description:
      "Turn ideas into campaigns. Repurpose content, analyze performance, and ship without waiting.",
  },
  {
    title: "Design",
    description:
      "Refine layouts and maintain systems. Check consistency, document components, iterate faster.",
  },
  {
    title: "Data & Ops",
    description:
      "Automate reporting and surface insights. Monitor metrics, alert on issues, keep teams informed.",
  },
  {
    title: "Product",
    description:
      "Turn feedback and PRDs into prototypes. Synthesize, prioritize, and ship specs faster.",
  },
  {
    title: "Engineering",
    description:
      "Unblock stakeholders without breaking prod. Triage, document, and automate the tedious stuff.",
  },
];

// Sponsored challenges data
const gailChallenge = {
  description: (
    <>
      Build an AI-agent system that turns messy conversation history into
      evolving behavioral profiles — then uses them live in conversation. Build
      these four pieces:
      {"\n\n"}
      <span className="text-white font-medium">Profile Engine</span> — Extract
      behavioral traits from interaction history: temperament, follow-through on
      promises, sentiment trends, communication style, life-stage signals.
      {"\n\n"}
      <span className="text-white font-medium">Dynamic Fit Scoring</span> —
      Score customers on dimensions that matter for outcomes — likelihood to
      pay, responsiveness, best contact method and timing,
      escalation/frustration risk. Scores should shift as new data arrives with
      clear reasoning for why.
      {"\n\n"}
      <span className="text-white font-medium">Live Agent</span> — A live agent
      that references the profile in real time. It should demonstrably behave
      differently depending on who it{"'"}s talking to — adjusting tone,
      negotiation strategy, and approach based on what{"'"}s historically worked
      for a specific user id from the data.
      {"\n\n"}
      <span className="text-white font-medium">Profile Evolution</span> — Handle
      conflicting signals. A hostile customer who{"'"}s recently turned
      cooperative should reflect growth, not just an average.
      {"\n\n"}
      <span className="text-white font-medium">Data</span> — Use the provided
      conversation dataset to build your system:{" "}
      <a
        href="https://drive.google.com/file/d/1OoOX0zsrQVtFd34-DfOpxh7QVP6jN2i7/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline underline-offset-2 hover:opacity-80"
      >
        Download ConversationData.zip
      </a>
      {"\n\n"}
      <span className="text-[#525252] text-[14px] lg:text-[16px] tracking-wide">
        Judged on: Depth of insight &middot; Profile evolution &middot; Agent
        usefulness &middot; Explainability &middot; Creativity
      </span>
    </>
  ),
  prizes: [
    { place: "First Place", amount: "$700" },
    { place: "Second Place", amount: "$200" },
    { place: "Third Place", amount: "$100" },
  ],
  learnMoreUrl: "/challenge/gail",
};

const kurzoChallenge = {
  description:
    "A tool that takes multiple unstructured input (notes, voice, images, URLs, files) and transforms them into organized, actionable output. The system should surface themes, priorities, and next steps—but the user must be able to refine the structure themselves.\n\nBonus points for handling new input without starting from scratch.\n\nThe goal: prove that the distance between chaos and clarity is a design problem, not a discipline problem.",
  prizes: [{ place: "Single winner", amount: "$250" }],
  learnMoreUrl: "/challenge/kurzo",
};

const basementChallenge = {
  description: (
    <>
      Build an application powered by OpenClaw.
      {"\n\n"}
      Your project can be anything: a tool, an agent, a workflow, or a product.
      The only requirement is that OpenClaw is a core part of how it works, not
      just an add-on.
      {"\n\n"}
      You{"'"}re free to choose the domain and use case. It can analyze data,
      automate tasks, monitor systems, explore the web, assist users, or
      generate insights. What matters is that OpenClaw meaningfully drives
      behavior, decisions, or outcomes in your application.
      {"\n\n"}
      Focus on building something that feels like a real product, not just a
      demo or script.
      {"\n\n"}
      <span className="text-white font-medium">Submission Requirements</span>
      {"\n"}
      To submit, you must:
      {"\n"}
      {"1. "}Download the Basement Browser iOS app from{" "}
      <a
        href="https://basementbrowser.com/app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline underline-offset-2 hover:opacity-80"
      >
        basementbrowser.com/app
      </a>
      {"\n"}
      {"2. "}Sign up in the app
      {"\n"}
      {"3. "}Open v0miami.com inside the Basement Browser
      {"\n"}
      {"4. "}Go to the chat section and submit:
      {"\n"}
      {"   \u2022 "}Your project link (repo or demo)
      {"\n"}
      {"   \u2022 "}A short explanation of what you built
      {"\n"}
      {"   \u2022 "}A 1{"\u2013"}2 sentence blurb describing your project
      {"\n\n"}
      The 1{"\u2013"}2 sentence blurb is part of judging. It should clearly
      explain what your app does and why it{"'"}s useful.
      {"\n\n"}
      <span className="text-white font-medium">Winning Criteria</span>
      {"\n\n"}
      <span className="text-white font-medium">Clear Use Case (30%)</span> — Is
      it obvious what the application does and why it matters? Does the blurb
      communicate the value clearly?
      {"\n\n"}
      <span className="text-white font-medium">OpenClaw Usage (30%)</span> — Is
      OpenClaw central to the product, not just bolted on? Does it meaningfully
      drive logic, behavior, or outcomes?
      {"\n\n"}
      <span className="text-white font-medium">Product Quality (25%)</span> —
      Does this feel like a real, usable product or tool? Is the output
      understandable and well thought out?
      {"\n\n"}
      <span className="text-white font-medium">Overall Impact (15%)</span> — Is
      it clever, useful, or impressive? Does it stand out from typical hackathon
      projects?
    </>
  ),
  prizes: [{ place: "Single winner", amount: "$250" }],
  learnMoreUrl: "/challenge/basement",
};

// Categorize sponsors
const madePossibleBy = sponsors.filter((s) =>
  ["UKG", "The Lab Miami", "Glue Studios", "DeepStation"].includes(s.name)
);
const sponsoredPrizes = sponsors.filter((s) =>
  ["Vercel", "Kurzo", "Gail", "Basement"].includes(s.name)
);

// Get individual sponsor logos
const gailSponsor = sponsors.find((s) => s.name === "Gail");
const kurzoSponsor = sponsors.find((s) => s.name === "Kurzo");
const basementSponsor = sponsors.find((s) => s.name === "Basement");

// Helper to get initial slide from URL (only runs once on mount)
function getInitialSlide(): number {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  const slideParam = params.get("s");
  return slideParam
    ? Math.max(1, Math.min(TOTAL_SLIDES, parseInt(slideParam) || 1))
    : 1;
}

export default function DeckPage() {
  const [headerMounted, setHeaderMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideKey, setSlideKey] = useState(0);
  const initializedRef = useRef(false);

  // Read slide from URL only once on mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const initialSlide = getInitialSlide();
      setCurrentSlide(initialSlide);
      setHeaderMounted(true);
    }
  }, []);

  const navigateToSlide = useCallback((slide: number) => {
    const clampedSlide = Math.max(1, Math.min(TOTAL_SLIDES, slide));
    setCurrentSlide(clampedSlide);
    setSlideKey((prev) => prev + 1);
  }, []);

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES) {
      navigateToSlide(currentSlide + 1);
    }
  }, [currentSlide, navigateToSlide]);

  const goPrev = useCallback(() => {
    if (currentSlide > 1) {
      navigateToSlide(currentSlide - 1);
    }
  }, [currentSlide, navigateToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="h-dvh bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header
        className={`flex-shrink-0 px-6 lg:px-10 py-6 lg:py-8 flex items-center justify-between transition-all duration-700 ${
          headerMounted
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="flex items-center gap-3 lg:gap-4">
          <svg viewBox="0 0 76 65" fill="white" className="h-5 lg:h-6 w-auto">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="text-white/60">/</span>
          <img
            src={logos.v0 || "/placeholder.svg"}
            alt="v0"
            className="h-5 lg:h-6 w-auto"
          />
          <span className="font-mono text-[10px] lg:text-[12px] text-[#737373] tracking-[2px] lg:tracking-[2.4px] ml-2 lg:ml-4">
            IRL - MIAMI
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={goPrev}
            disabled={currentSlide === 1}
            className="p-2 text-white/60 hover:text-white disabled:text-white/20 transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button
            onClick={goNext}
            disabled={currentSlide === TOTAL_SLIDES}
            className="p-2 text-white/60 hover:text-white disabled:text-white/20 transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </header>

      {/* Slide Content */}
      <main className="flex-1 overflow-hidden">
        {currentSlide === 1 && <TitleSlide key={`slide-1-${slideKey}`} />}
        {currentSlide === 2 && <WelcomeSlide key={`slide-2-${slideKey}`} />}
        {currentSlide === 3 && (
          <MadePossibleBySlide
            key={`slide-3-${slideKey}`}
            sponsors={madePossibleBy}
          />
        )}
        {currentSlide === 4 && (
          <SponsoredPrizesSlide
            key={`slide-4-${slideKey}`}
            sponsors={sponsoredPrizes}
          />
        )}
        {currentSlide === 5 && (
          <TheChallengeSlide key={`slide-5-${slideKey}`} />
        )}
        {currentSlide === 6 && (
          <AgendaSlide key={`slide-6-${slideKey}`} items={agendaItems} />
        )}
        {currentSlide === 7 && (
          <V0TeamVideoSlide key={`slide-7-${slideKey}`} />
        )}
        {currentSlide === 8 && (
          <GlobalTracksSlide
            key={`slide-8-${slideKey}`}
            tracks={globalTracks}
          />
        )}
        {currentSlide === 9 && (
          <SponsoredChallengeSlide
            key={`slide-9-${slideKey}`}
            sponsor={gailSponsor!}
            challenge={gailChallenge}
            slideNumber="09"
            qrCode="/qr-gail.jpg"
          />
        )}
        {currentSlide === 10 && (
          <SponsoredChallengeSlide
            key={`slide-10-${slideKey}`}
            sponsor={kurzoSponsor!}
            challenge={kurzoChallenge}
            slideNumber="10"
            qrCode="/qr-kurzo.jpg"
          />
        )}
        {currentSlide === 11 && (
          <SponsoredChallengeSlide
            key={`slide-11-${slideKey}`}
            sponsor={basementSponsor!}
            challenge={basementChallenge}
            slideNumber="11"
            qrCode="/qr-basement.jpg"
          />
        )}
        {currentSlide === 12 && <CreditsSlide key={`slide-12-${slideKey}`} />}
        {currentSlide === 13 && (
          <ResourcesSlide key={`slide-13-${slideKey}`} />
        )}
        {currentSlide === 14 && (
          <TimeToBuildSlide key={`slide-14-${slideKey}`} />
        )}
        {currentSlide === 15 && (
          <SubmitSlide key={`slide-15-${slideKey}`} />
        )}
      </main>
    </div>
  );
}

// Shared redeem state type
type RedeemState = "idle" | "getting" | "copied";

// Slide 1: Title Slide
function TitleSlide() {
  const [visible, setVisible] = useState(false);
  const [redeemState, setRedeemState] = useState<RedeemState>("idle");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle redeem button click
  const handleRedeem = async () => {
    if (redeemState !== "idle") return;

    // Phase 1: Getting code
    setRedeemState("getting");

    // Simulate getting code (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Copy code to clipboard
    try {
      await navigator.clipboard.writeText("V0PROMPTTOPRODUCTION2026");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }

    // Phase 2: Code copied, redirecting
    setRedeemState("copied");

    // Wait 2s then redirect
    setTimeout(() => {
      window.open("https://v0.app/chat/settings/billing", "_blank");
    }, 2000);
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center px-6 lg:px-10">
      {/* Dithering Shader Background */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          visible ? "opacity-80" : "opacity-0"
        }`}
      >
        <Dithering
          colorBack="#000000"
          colorFront="#99999921"
          shape="warp"
          type="4x4"
          size={4}
          speed={0.1}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logos */}
        <div
          className={`flex items-center gap-3 lg:gap-4 mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-[5px]"
          }`}
        >
          <svg viewBox="0 0 76 65" fill="white" className="h-8 lg:h-10 w-auto">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="text-white/60 text-2xl lg:text-3xl">/</span>
          <img
            src={logos.v0 || "/placeholder.svg"}
            alt="v0"
            className="h-8 lg:h-10 w-auto"
          />
        </div>

        {/* Main Title */}
        <h1
          className={`text-[48px] sm:text-[72px] md:text-[96px] lg:text-[120px] font-normal leading-[0.95] tracking-[-0.04em] text-white mb-6 lg:mb-8 transition-all duration-700 delay-300 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          <span className="block">Prompt to</span>
          <span className="block">Prod Miami</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`font-mono text-[11px] sm:text-[12px] lg:text-[14px] text-[#737373] tracking-[3px] lg:tracking-[4px] uppercase transition-all duration-700 delay-500 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          A day to ship ideas into
          <br />
          production-ready applications
        </p>

        {/* Buttons */}
        <div
          className={`mt-8 lg:mt-10 flex items-center gap-3 transition-all duration-700 delay-700 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          {/* Get Started Link */}
          <Link
            href="/get-started"
            className="group bg-white text-[#0f172a] px-6 py-3 rounded-full text-[14px] lg:text-[16px] font-medium leading-[24px] flex items-center hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            Get Started
            <span className="w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:w-6 group-hover:opacity-100">
              <ExternalLink className="w-4 h-4 ml-2" />
            </span>
          </Link>

          {/* Redeem Code Button */}
          <motion.button
            onClick={handleRedeem}
            disabled={redeemState !== "idle"}
            layout
            initial={false}
            className={`font-medium text-[14px] lg:text-[16px] px-6 py-3 rounded-full flex items-center justify-center gap-2 overflow-hidden transition-colors duration-300 ${
              redeemState === "copied"
                ? "bg-transparent text-white/80 border border-white/20"
                : "bg-transparent text-white border border-white/30 hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            }`}
            transition={{
              layout: {
                type: "spring",
                stiffness: 500,
                damping: 35,
              },
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {redeemState === "idle" && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="whitespace-nowrap"
                >
                  Redeem code
                </motion.span>
              )}
              {redeemState === "getting" && (
                <motion.span
                  key="getting"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting code
                </motion.span>
              )}
              {redeemState === "copied" && (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="whitespace-nowrap"
                >
                  Code copied, redirecting...
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Slide 2: Welcome Slide
function WelcomeSlide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex items-center justify-center px-6 lg:px-16">
      <p
        className={`text-[24px] sm:text-[32px] md:text-[40px] lg:text-[52px] font-normal leading-[1.35] tracking-[-0.02em] text-white max-w-[1100px] transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
      >
        v0 just launched its biggest product update yet. We're celebrating with
        v0 IRLs around the world. Miami is one of them. Glad you're here!
      </p>
    </div>
  );
}

// Slide 3: Made Possible By
function MadePossibleBySlide({
  sponsors,
}: {
  sponsors: typeof madePossibleBy;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side - Title */}
      <div className="flex-shrink-0 lg:w-[40%] flex items-center px-6 lg:px-16 py-8 lg:py-0">
        <h2
          className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-700 delay-100 ${
            visible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[5px]"
          }`}
        >
          01 MADE POSSIBLE BY
        </h2>
      </div>

      {/* Right side - Sponsor Grid */}
      <div className="flex-1 grid grid-cols-2 border-l border-[#262626]">
        {sponsors.map((sponsor, index) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group flex items-center justify-center border-b border-r border-[#262626] p-6 lg:p-8 transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
            style={{ transitionDelay: `${150 + index * 100}ms` }}
          >
            <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 translate-x-1 -translate-y-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              className="w-auto max-w-[120px] lg:max-w-[180px] transition-opacity duration-300 group-hover:opacity-80"
              style={{ height: sponsor.height || "auto", maxHeight: "60px" }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

// Slide 4: Sponsored Prizes
function SponsoredPrizesSlide({
  sponsors,
}: {
  sponsors: typeof sponsoredPrizes;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side - Title */}
      <div className="flex-shrink-0 lg:w-[40%] flex items-center px-6 lg:px-16 py-8 lg:py-0">
        <h2
          className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-700 delay-100 ${
            visible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[5px]"
          }`}
        >
          02 SPONSORED PRIZES
        </h2>
      </div>

      {/* Right side - Sponsor List */}
      <div className="flex-1 flex flex-col border-l border-[#262626]">
        {sponsors.map((sponsor, index) => (
          <a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative group flex-1 flex items-center justify-center border-b border-[#262626] last:border-b-0 p-6 lg:p-8 transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
            style={{ transitionDelay: `${150 + index * 100}ms` }}
          >
            <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-white opacity-0 translate-x-1 -translate-y-1 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0 group-hover:translate-y-0" />
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              className="w-auto max-w-[140px] lg:max-w-[200px] transition-opacity duration-300 group-hover:opacity-80"
              style={{ height: sponsor.height || "auto", maxHeight: "50px" }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}

// Slide 5: The Challenge
function TheChallengeSlide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col px-6 lg:px-16 py-8 lg:py-16">
      {/* Title */}
      <h2
        className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-12 lg:mb-20 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[5px]"
        }`}
      >
        03 THE CHALLENGE
      </h2>

      {/* Main Text */}
      <p
        className={`text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-normal leading-[1.3] tracking-[-0.02em] text-white max-w-[1000px] transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
      >
        {
          "Today's build is about momentum and proving that technical barriers are now smaller than we think."
        }
      </p>
    </div>
  );
}

// Slide 6: Agenda
function AgendaSlide({ items }: { items: typeof agendaItems }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col px-6 lg:px-16 py-8 lg:py-16 overflow-y-auto">
      {/* Title */}
      <h2
        className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[5px]"
        }`}
      >
        04 THE AGENDA
      </h2>

      {/* Agenda Items */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row sm:items-center justify-between py-5 lg:py-6 border-b border-[#262626] last:border-b-0 transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
            style={{ transitionDelay: `${150 + index * 80}ms` }}
          >
            <div className="flex items-center gap-4 mb-2 sm:mb-0">
              <span className="font-mono text-[10px] lg:text-[11px] text-[#737373] tracking-[-0.4px]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[18px] lg:text-[22px] text-white leading-[1.3]">
                {item.title}
              </span>
            </div>
            <span className="font-mono text-[13px] lg:text-[15px] text-[#737373] leading-[1.5] sm:text-right pl-8 sm:pl-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Slide 7: A word from the v0 team (YouTube Video)
function V0TeamVideoSlide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col px-6 lg:px-16 py-8 lg:py-16">
      {/* Title */}
      <h2
        className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[5px]"
        }`}
      >
        A WORD FROM THE V0 TEAM
      </h2>

      {/* YouTube Video */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
      >
        <div className="w-full max-w-[960px] aspect-video rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/aNsEgVIhcRY?si=eHLPeLvZicwVdpIA"
            title="A word from the v0 team"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}

// Slide 8: Global Tracks
function GlobalTracksSlide({ tracks }: { tracks: typeof globalTracks }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side - Title */}
      <div className="flex-shrink-0 lg:w-[30%] flex flex-col justify-between px-6 lg:px-16 py-8 lg:py-16">
        <h2
          className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] transition-all duration-700 delay-100 ${
            visible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-[5px]"
          }`}
        >
          05 GLOBAL TRACKS
        </h2>
        <a
          href="#"
          className={`font-mono text-[11px] lg:text-[12px] text-[#737373] tracking-[2px] hover:text-white transition-all duration-700 delay-200 hidden lg:block ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          LEARN MORE
        </a>
      </div>

      {/* Right side - Tracks Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-[#262626]">
        {tracks.map((track, index) => (
          <div
            key={track.title}
            className={`flex flex-col justify-end p-6 lg:p-8 border-b border-r border-[#262626] transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
            style={{ transitionDelay: `${150 + index * 80}ms` }}
          >
            <span className="font-mono text-[10px] lg:text-[11px] text-[#737373] tracking-[-0.4px] mb-2">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[20px] lg:text-[24px] text-white leading-[1.2] mb-3">
              {track.title}
            </h3>
            <p className="text-[13px] lg:text-[14px] text-[#737373] leading-[1.5]">
              {track.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Slide 9, 10, 11: Sponsored Challenge
function SponsoredChallengeSlide({
  sponsor,
  challenge,
  slideNumber,
  qrCode,
}: {
  sponsor: typeof gailSponsor;
  challenge: {
    description: React.ReactNode;
    prizes: { place: string; amount: string }[];
    learnMoreUrl?: string;
  };
  slideNumber: string;
  qrCode?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const hasLearnMore = "learnMoreUrl" in challenge;

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Left side - Title & Logo */}
      <div className="flex-shrink-0 lg:w-[35%] flex flex-col justify-between px-6 lg:px-16 py-8 lg:py-16">
        <div>
          <h2
            className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
              visible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-[5px]"
            }`}
          >
            {slideNumber} SPONSORED CHALLENGE
          </h2>
          {sponsor && (
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              className={`w-auto max-w-[160px] lg:max-w-[200px] transition-all duration-700 delay-200 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[5px]"
              }`}
              style={{ height: sponsor.height || "auto", maxHeight: "60px" }}
            />
          )}
        </div>
        <div className="hidden lg:flex flex-col gap-6 items-start">
          {hasLearnMore && (
            <a
              href={challenge.learnMoreUrl}
              className={`font-mono text-[11px] lg:text-[12px] text-[#737373] tracking-[2px] hover:text-white transition-all duration-700 delay-300 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[5px]"
              }`}
            >
              LEARN MORE
            </a>
          )}
          <div
            className={`transition-all duration-700 delay-400 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
          >
            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl"
              />
            ) : (
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-2xl" />
            )}
          </div>
        </div>
      </div>

      {/* Right side - Description & Prizes */}
      <div className="flex-1 flex flex-col border-l border-[#262626] min-h-0">
        {/* Description */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto p-6 lg:p-12 transition-all duration-700 delay-200 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          <div className="text-[14px] sm:text-[16px] lg:text-[18px] text-[#a3a3a3] leading-[1.6] whitespace-pre-line">
            {challenge.description}
          </div>
        </div>

        {/* Prizes */}
        <div
          className={`flex-shrink-0 flex border-t border-[#262626] transition-all duration-700 delay-400 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          {challenge.prizes.map((prize, index) => (
            <div
              key={prize.place}
              className={`flex-1 p-6 lg:p-8 ${
                index < challenge.prizes.length - 1
                  ? "border-r border-[#262626]"
                  : ""
              }`}
            >
              <span className="font-mono text-[10px] lg:text-[11px] text-[#737373] tracking-[-0.4px] block mb-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[16px] lg:text-[18px] text-white block mb-1">
                {prize.place}
              </span>
              <span className="text-[24px] lg:text-[32px] text-[#737373] font-light">
                {prize.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Slide 12: Credits (v0 Redeem)
function CreditsSlide() {
  const [visible, setVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [redeemState, setRedeemState] = useState<RedeemState>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Track if we're on desktop for the expand animation
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle redeem button click
  const handleRedeem = async () => {
    if (redeemState !== "idle") return;

    // Phase 1: Getting code
    setRedeemState("getting");

    // Simulate getting code (1.5s)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Copy code to clipboard (you can replace 'V0PROMPTTOPRODUCTION2026' with actual code)
    try {
      await navigator.clipboard.writeText("V0PROMPTTOPRODUCTION2026");
    } catch (err) {
      console.error("Failed to copy code:", err);
    }

    // Phase 2: Code copied, redirecting
    setRedeemState("copied");

    // Wait 2s then redirect
    setTimeout(() => {
      window.open("https://v0.app/chat/settings/billing", "_blank");
    }, 2000);
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.ended) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  // Whether to apply expanded styles (only on desktop)
  const shouldExpand = isExpanded && isDesktop;

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Title & Button (outer container animates width on desktop) */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{
          width: isDesktop ? (shouldExpand ? "0%" : "35%") : "auto",
          transition: "width 700ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Inner content container - slides and fades */}
        <div
          className="h-full flex flex-col justify-between px-6 lg:px-16 py-8 lg:py-16 lg:min-w-[35vw]"
          style={{
            opacity: shouldExpand ? 0 : 1,
            transform: shouldExpand ? "translateX(-30%)" : "translateX(0)",
            transition:
              "opacity 500ms cubic-bezier(0.32, 0.72, 0, 1), transform 700ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          <div>
            <h2
              className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
                visible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[5px]"
              }`}
            >
              08 CREDITS
            </h2>

            {/* Animated Button */}
            <motion.button
              onClick={handleRedeem}
              disabled={redeemState !== "idle"}
              layout
              initial={false}
              className={`font-medium text-[14px] lg:text-[16px] px-6 lg:px-8 py-3 lg:py-4 rounded-full flex items-center justify-center gap-2 overflow-hidden ${
                redeemState === "copied"
                  ? "bg-transparent text-white/80"
                  : "bg-white text-black hover:bg-white/90"
              } ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[5px]"
              }`}
              style={{
                transition:
                  "opacity 700ms ease 200ms, transform 700ms ease 200ms, background-color 500ms ease",
              }}
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                },
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {redeemState === "idle" && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="whitespace-nowrap"
                  >
                    Redeem code
                  </motion.span>
                )}
                {redeemState === "getting" && (
                  <motion.span
                    key="getting"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting code
                  </motion.span>
                )}
                {redeemState === "copied" && (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                    className="whitespace-nowrap"
                  >
                    Code copied, redirecting...
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* QR Code */}
          <div
            className={`hidden lg:block transition-all duration-700 delay-400 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[5px]"
            }`}
          >
            <img
              src="/qr-redeem.jpg"
              alt="Redeem QR Code"
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Right side - Video */}
      <div className="flex-1 relative">
        <div
          className={`relative w-full h-full flex items-center justify-center p-4 lg:p-8 transition-all duration-700 delay-200 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-[5px]"
          }`}
        >
          <div
            className="relative w-full h-full cursor-pointer group flex items-center justify-center"
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              src="/v0-redeem.mp4"
              className="max-w-full max-h-full object-contain rounded-lg"
              style={{
                transition: "transform 700ms cubic-bezier(0.32, 0.72, 0, 1)",
                transform: shouldExpand ? "scale(1.01)" : "scale(1)",
              }}
              playsInline
              onEnded={handleVideoEnded}
            />

            {/* Play/Pause overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              ) : (
                <Play className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
              )}
            </div>

            {/* Expand/Collapse button - only visible on desktop */}
            <button
              onClick={toggleExpanded}
              className="hidden lg:flex absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 z-10"
              style={{
                transition:
                  "opacity 200ms ease-out, background-color 200ms ease-out",
              }}
              aria-label={isExpanded ? "Exit fullscreen" : "Fullscreen"}
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5 text-white" />
              ) : (
                <Maximize2 className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 13: Resources
function ResourcesSlide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 lg:px-16">
      {/* Title */}
      <h2
        className={`font-mono text-[12px] lg:text-[14px] text-[#737373] tracking-[2.8px] mb-12 lg:mb-16 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[5px]"
        }`}
      >
        RESOURCES
      </h2>

      {/* Link to Get Started */}
      <Link
        href="/get-started"
        className={`group flex flex-col items-center gap-6 transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
      >
        <span className="text-[32px] sm:text-[48px] md:text-[56px] lg:text-[72px] font-normal leading-[1.1] tracking-[-0.03em] text-white group-hover:text-white/80 transition-colors duration-300">
          Get Started Guide
        </span>
        <span className="font-mono text-[13px] lg:text-[15px] text-[#737373] tracking-[2px] group-hover:text-white transition-colors duration-300 flex items-center gap-2">
          v0miami.com/get-started
          <ExternalLink className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
}

// Cycling sponsor logo for the TimeToBuildSlide
const allSponsors = [...madePossibleBy, ...sponsoredPrizes];

function SponsorCycler({ visible }: { visible: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sponsor = allSponsors[currentIndex];

  return (
    <div
      className={`mt-12 lg:mt-16 flex flex-col items-center transition-all duration-700 delay-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
      }`}
    >
      <span className="font-mono text-[11px] lg:text-[14px] text-[#737373] tracking-[4px] lg:tracking-[6px] mb-6 lg:mb-8">
        MADE POSSIBLE BY
      </span>
      <div className="relative h-10 lg:h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.a
            key={sponsor.name}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              className="h-8 lg:h-10 w-auto transition-opacity duration-300 group-hover:opacity-80"
            />
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Slide 14: Time to Build
const INITIAL_TIME = 6 * 60 * 60 + 15 * 60; // 6 hours 15 minutes in seconds

function TimeToBuildSlide() {
  const [visible, setVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isHovering, setIsHovering] = useState(false);
  const [activeBackground, setActiveBackground] =
    useState<BackgroundType>("dither");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handlePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
  };

  // Cycle through backgrounds (DEBUG)
  const handleCycleBackground = () => {
    const currentIndex = BACKGROUND_TYPES.indexOf(activeBackground);
    const nextIndex = (currentIndex + 1) % BACKGROUND_TYPES.length;
    setActiveBackground(BACKGROUND_TYPES[nextIndex]);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 lg:px-16 relative">
      {/* Animated Background */}
      {/* <Backgrounds activeBackground={activeBackground} transitionDuration={1.2} /> */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1500 opacity-50`}
      >
        <Dithering
          colorBack="#000000"
          colorFront="#99999921"
          shape="warp"
          type="4x4"
          size={4}
          speed={0.2}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* Title */}
      <h2
        className={`font-mono text-[20px] sm:text-[24px] lg:text-[32px] text-[#737373] tracking-[8px] lg:tracking-[12px] mb-8 lg:mb-12 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[5px]"
        }`}
      >
        TIME TO BUILD!
      </h2>

      {/* Timer Container */}
      <div
        className={`relative transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex items-center gap-4">
          {/* Timer Box */}
          <div className="relative rounded-lg overflow-hidden">
            {/* Timer Display using NumberFlow */}
            <div
              className="relative z-0 flex items-center font-mono text-[64px] sm:text-[96px] md:text-[120px] lg:text-[160px] font-light leading-none tracking-tight text-white"
              style={{
                fontVariantNumeric: "tabular-nums",
                // @ts-expect-error CSS custom property
                "--number-flow-char-height": "0.85em",
                "--number-flow-mask-height": "0.25em",
              }}
            >
              <NumberFlow
                value={hours}
                format={{ minimumIntegerDigits: 2 }}
                animated={isRunning}
                trend={-1}
                transformTiming={{ duration: 500, easing: "ease-out" }}
                spinTiming={{ duration: 500, easing: "ease-out" }}
                opacityTiming={{ duration: 300, easing: "ease-out" }}
              />
              <span className="mx-1 sm:mx-2 lg:mx-4 text-[#555]">:</span>
              <NumberFlow
                value={minutes}
                format={{ minimumIntegerDigits: 2 }}
                animated={isRunning}
                trend={-1}
                transformTiming={{ duration: 500, easing: "ease-out" }}
                spinTiming={{ duration: 500, easing: "ease-out" }}
                opacityTiming={{ duration: 300, easing: "ease-out" }}
              />
              <span className="mx-1 sm:mx-2 lg:mx-4 text-[#555]">:</span>
              <NumberFlow
                value={seconds}
                format={{ minimumIntegerDigits: 2 }}
                animated={isRunning}
                trend={-1}
                transformTiming={{ duration: 500, easing: "ease-out" }}
                spinTiming={{ duration: 500, easing: "ease-out" }}
                opacityTiming={{ duration: 300, easing: "ease-out" }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div
            className={`flex flex-col gap-2 transition-all duration-300 ${
              isHovering
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <button
              onClick={handlePlayPause}
              className="p-3 lg:p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              aria-label={isRunning ? "Pause timer" : "Start timer"}
            >
              {isRunning ? (
                <Pause className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              ) : (
                <Play className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              )}
            </button>
            {isRunning && (
              <button
                onClick={handleReset}
                className="p-3 lg:p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Made Possible By - Cycling Sponsor Logo */}
      <SponsorCycler visible={visible} />


      {/* DEBUG: Background Cycle Button */}
      <button
        onClick={handleCycleBackground}
        className={`absolute bottom-6 lg:bottom-10 right-6 lg:right-10 p-3 lg:p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 z-20 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[5px]"
        }`}
        aria-label="Cycle background"
        title={`Current: ${activeBackground}`}
      >
        <Layers className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </button>
    </div>
  );
}

// Slide 15: Submit
function SubmitSlide() {
  return (
    <div className="h-full overflow-y-auto">
      <SubmissionForm embedded />
    </div>
  );
}
