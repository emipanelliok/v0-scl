import type { Metadata } from "next"
import { BatchProcessor } from "@/components/batch-processor"

export const metadata: Metadata = {
  title: "Batch Processor - v0 IRL Miami",
  description: "Process images and videos with branded overlays for Prompt to Production Miami.",
}

export default function BatchProcessorPage() {
  return <BatchProcessor />
}
