"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8210"

// Zustimmung gilt pro Browser-Session (wie das Chat-Session-Token) — jede
// neue Session erzeugt damit auch einen neuen Nachweis-Logeintrag im Backend.
const CONSENT_KEY = "mx-chat-consent"

export function hasChatConsent(): boolean {
  try {
    return sessionStorage.getItem(CONSENT_KEY) === "1"
  } catch {
    return false
  }
}

/**
 * Overlay über dem Chat, solange die Datenschutzerklärung nicht akzeptiert
 * wurde. Der Klick protokolliert die Zustimmung im Backend (IP + Zeitpunkt,
 * POST /api/chat/consent) und gibt erst dann den Chat frei — vorher startet
 * auch keine Turnstile-Challenge.
 */
export function ChatConsent({ onAccepted }: { onAccepted: () => void }) {
  const t = useTranslations("chat")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  async function accept() {
    setPending(true)
    setError(false)
    try {
      const res = await fetch(`${apiUrl}/api/chat/consent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      })
      if (!res.ok) throw new Error(`consent failed: ${res.status}`)
      try {
        sessionStorage.setItem(CONSENT_KEY, "1")
      } catch {
        // z. B. Safari im privaten Modus — dann eben pro Seite erneut zustimmen.
      }
      onAccepted()
    } catch {
      setError(true)
      setPending(false)
    }
  }

  return (
    <div className="@container bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-6 text-center backdrop-blur-sm">
      <p className="text-sm font-medium">{t("consentTitle")}</p>
      <p className="text-muted-foreground max-w-xs text-sm">
        {t.rich("consentHint", {
          link: (chunks) => (
            <Link
              href="/datenschutz"
              target="_blank"
              className="text-foreground underline underline-offset-2"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
      {/* Der volle Zustimmungssatz nur, wenn der Chat-Container breit genug
          ist (Chat-Seite auf Desktop) — auf Mobile und im Widget die kurze
          Variante, sonst füllt der Button die ganze Zeile. */}
      <Button
        size="sm"
        className="cursor-pointer active:translate-y-px"
        onClick={accept}
        disabled={pending}
      >
        <span className="@lg:hidden">{t("consentAcceptShort")}</span>
        <span className="hidden @lg:inline">{t("consentAccept")}</span>
      </Button>
      {error && <p className="text-destructive text-sm">{t("consentError")}</p>}
    </div>
  )
}
