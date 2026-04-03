import type { Metadata } from "next"
import JudgeDashboard from "@/components/judge-dashboard"

export const metadata: Metadata = {
  title: "Judge Dashboard | v0 IRL Miami",
  description: "Rate and rank submissions for v0 IRL Miami - Prompt to Production.",
}

export default function JudgeDashboardPage() {
  return <JudgeDashboard />
}
