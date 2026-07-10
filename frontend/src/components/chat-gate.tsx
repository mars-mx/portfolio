"use client"

import { useRef, useState } from "react"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"

import { saveChatSession } from "@/lib/chat-session"
import { cn } from "@/lib/utils"

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8210"

/**
 * Unsichtbares Gate über dem Chat, solange keine gültige Chat-Session
 * existiert: die Turnstile-Challenge läuft verdeckt (appearance:
 * "interaction-only") und ist im Normalfall nach kurzer Zeit durch —
 * der Nutzer sieht nichts. Das Overlay blockt solange nur Klicks ab,
 * damit keine Nachricht ohne Session-Token rausgeht. Sichtbar wird es
 * nur, wenn Cloudflare doch eine Interaktion verlangt (Managed-Widget)
 * oder die Verifizierung fehlschlägt.
 */
export function ChatGate({
  siteKey,
  onVerified,
}: {
  siteKey: string
  onVerified: () => void
}) {
  const t = useTranslations("chat")
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const turnstileRef = useRef<TurnstileInstance | null>(null)
  const [interactive, setInteractive] = useState(false)
  const [error, setError] = useState(false)

  async function exchangeToken(token: string) {
    setError(false)
    try {
      const res = await fetch(`${apiUrl}/api/chat/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error(`verify failed: ${res.status}`)
      const { session_token, expires_at } = await res.json()
      saveChatSession(session_token, expires_at)
      onVerified()
    } catch {
      setError(true)
      // Turnstile-Tokens sind Einweg-Tokens — der nächste Versuch braucht
      // eine frische Challenge.
      turnstileRef.current?.reset()
    }
  }

  const visible = interactive || error

  return (
    <div
      className={cn(
        "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center",
        visible ? "bg-background/80 backdrop-blur-sm" : "cursor-wait",
      )}
    >
      {visible && (
        <>
          <p className="text-sm font-medium">{t("gateTitle")}</p>
          <p className="text-muted-foreground max-w-xs text-sm">
            {t("gateHint")}
          </p>
        </>
      )}
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={exchangeToken}
        onError={() => setError(true)}
        onBeforeInteractive={() => setInteractive(true)}
        options={{
          appearance: "interaction-only",
          theme: resolvedTheme === "dark" ? "dark" : "light",
          language: locale,
        }}
      />
      {error && <p className="text-destructive text-sm">{t("gateError")}</p>}
    </div>
  )
}
