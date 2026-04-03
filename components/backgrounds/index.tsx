"use client";

import { useState, useEffect, ReactNode, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load background components to improve initial load time
const Dither = lazy(() => import("./dither"));
const Plasma = lazy(() => import("./plasma"));
const Grainient = lazy(() => import("./grainient"));
const GridScan = lazy(() => import("./grid-scan"));
const Beams = lazy(() => import("./beams"));

export type BackgroundType =
  | "dither"
  | "plasma"
  | "grainient"
  | "grid-scan"
  | "beams";

export const BACKGROUND_TYPES: BackgroundType[] = [
  "dither",
  "plasma",
  "grainient",
  "grid-scan",
  "beams",
];

interface BackgroundsProps {
  activeBackground: BackgroundType;
  transitionDuration?: number;
}

// Background component wrapper with loading fallback
function BackgroundWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full bg-black" />
      }
    >
      {children}
    </Suspense>
  );
}

// Individual background configurations based on user's URLs
function DitherBackground() {
  return (
    <BackgroundWrapper>
      <Dither
        waveFrequency={0.7}
        colorNum={4.8}
        enableMouseInteraction={false}
        waveAmplitude={0}
      />
    </BackgroundWrapper>
  );
}

function PlasmaBackground() {
  return (
    <BackgroundWrapper>
      <Plasma color="#ffffff" speed={2.1} opacity={0.2} />
    </BackgroundWrapper>
  );
}

function GrainientBackground() {
  return (
    <BackgroundWrapper>
      <Grainient
        color1="#2e2e2e"
        color2="#262626"
        color3="#5c5c5c"
        warpSpeed={3.3}
      />
    </BackgroundWrapper>
  );
}

function GridScanBackground() {
  return (
    <BackgroundWrapper>
      <GridScan
        scanColor="#7a7a7a"
        linesColor="#4d4d4d"
        scanGlow={0.2}
        gridScale={0.04}
        scanSoftness={4}
      />
    </BackgroundWrapper>
  );
}

function BeamsBackground() {
  return (
    <BackgroundWrapper>
      <Beams
        beamWidth={7.8}
        beamNumber={5}
        speed={10}
        noiseIntensity={5}
        rotation={298}
        beamHeight={25}
      />
    </BackgroundWrapper>
  );
}

// Get background component by type
function getBackgroundComponent(type: BackgroundType): ReactNode {
  switch (type) {
    case "dither":
      return <DitherBackground />;
    case "plasma":
      return <PlasmaBackground />;
    case "grainient":
      return <GrainientBackground />;
    case "grid-scan":
      return <GridScanBackground />;
    case "beams":
      return <BeamsBackground />;
    default:
      return null;
  }
}

export default function Backgrounds({
  activeBackground,
  transitionDuration = 1.2,
}: BackgroundsProps) {
  // Track mounted state for initial animation
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: transitionDuration,
            ease: [0.32, 0.72, 0, 1], // Custom smooth easing
          }}
          className="absolute inset-0"
        >
          {getBackgroundComponent(activeBackground)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Export individual backgrounds for direct use
export { Dither, Plasma, Grainient, GridScan, Beams };
