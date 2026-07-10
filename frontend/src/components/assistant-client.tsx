"use client"

import dynamic from "next/dynamic"

// Gemeinsamer Client-only-Einstieg für Widget und /chat: assistant-ui bleibt
// aus dem Server-Bundle (und lädt im Widget erst beim ersten Öffnen), und der
// Verlaufs-Restore aus sessionStorage in assistant.tsx trifft nie auf
// SSR-Markup — sonst Hydration-Mismatch.
export const AssistantClient = dynamic(
  () => import("@/components/assistant").then((m) => m.Assistant),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center">
        <span className="text-muted-foreground animate-pulse">●</span>
      </div>
    ),
  },
)
