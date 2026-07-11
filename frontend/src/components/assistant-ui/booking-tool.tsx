"use client"

import { useState } from "react"
import { makeAssistantToolUI } from "@assistant-ui/react"
import { ExternalLink, LoaderIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Contract mit dem Backend-Tool `offer_booking` (backend/app/agent/assistant.py):
// das Modell liefert die Beschriftung in der Sprache des Nutzers, die
// Buchungs-URLs kommen aus dem Backend (BOOKING_URL) und erreichen den Browser
// nur über den Turnstile-geschützten Chat-Stream — nie über das Bundle.
type OfferBookingArgs = {
  button_label?: string
}

type OfferBookingResult = {
  url?: string
  embed_url?: string
  hint?: string
}

/** Google-Calendar-Produktlogo, inline eingebettet (kein externer Request). */
function GoogleCalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g transform="translate(3.75 3.75)">
        <path
          fill="#fff"
          d="M148.882 43.618l-47.368-5.263-57.895 5.263L38.355 96.25l5.263 52.632 52.632 6.579 52.632-6.579 5.263-53.947z"
        />
        <path
          fill="#1a73e8"
          d="M65.211 125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c.829 3.158 2.276 5.605 4.342 7.342 2.053 1.737 4.553 2.592 7.474 2.592 2.987 0 5.553-.908 7.697-2.724s3.224-4.132 3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921 0 5.382-.789 7.382-2.368 2-1.579 3-3.737 3-6.487 0-2.447-.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684 0-4.816.711-6.395 2.145s-2.724 3.197-3.447 5.276l-9.039-3.763c1.197-3.395 3.395-6.395 6.618-8.987 3.224-2.592 7.342-3.895 12.342-3.895 3.697 0 7.026.711 9.974 2.145 2.947 1.434 5.263 3.421 6.934 5.947 1.671 2.539 2.5 5.382 2.5 8.539 0 3.224-.776 5.947-2.329 8.184-1.553 2.237-3.461 3.947-5.724 5.145v.539c2.987 1.25 5.421 3.158 7.342 5.724 1.908 2.566 2.868 5.632 2.868 9.211s-.908 6.776-2.724 9.579c-1.816 2.803-4.329 5.013-7.513 6.618-3.197 1.605-6.789 2.421-10.776 2.421-4.618 0-8.881-1.329-12.815-3.987z"
        />
        <path
          fill="#1a73e8"
          d="M121.25 79.961l-9.974 7.25-5.013-7.605 17.987-12.974h6.895v61.197h-9.895z"
        />
        <path fill="#ea4335" d="M148.882 196.25l47.368-47.368-23.684-10.526-23.684 10.526-10.526 23.684z" />
        <path fill="#34a853" d="M33.092 172.566l10.526 23.684h105.263v-47.368H43.618z" />
        <path
          fill="#4285f4"
          d="M12.039-3.75C3.316-3.75-3.75 3.316-3.75 12.039v136.842l23.684 10.526 23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75z"
        />
        <path fill="#188038" d="M-3.75 148.882v31.579c0 8.724 7.066 15.789 15.789 15.789h31.579v-47.368z" />
        <path fill="#fbbc04" d="M148.882 43.618v105.263h47.368V43.618l-23.684-10.526z" />
        <path fill="#1967d2" d="M196.25 43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368z" />
      </g>
    </svg>
  )
}

/** Eingebetteter Buchungskalender mit Kopfzeile und Ladeindikator. */
function BookingEmbed({ url, embedUrl }: { url: string; embedUrl: string }) {
  const t = useTranslations("chat")
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="mb-2 w-full overflow-hidden rounded-lg border">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <GoogleCalendarIcon className="size-4 shrink-0" />
        <span className="text-xs font-medium">{t("bookingTitle")}</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("bookingOpenNewTab")}
          <ExternalLink className="size-3" />
        </a>
      </div>
      {/* Google rendert die Buchungsseite immer hell — Container deshalb fest weiß. */}
      <div className="relative h-[min(600px,65vh)] bg-white">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-zinc-500">
            <LoaderIcon className="size-3.5 animate-spin" />
            <span>{t("bookingRunning")}</span>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={t("bookingTitle")}
          onLoad={() => setLoaded(true)}
          className={cn("h-full w-full", !loaded && "opacity-0")}
        />
      </div>
    </div>
  )
}

/**
 * Eigene Tool-UI für die Terminbuchung: bettet Marius' Google-Kalender-
 * Buchungsseite direkt als Widget im Chat ein; ohne embed_url (Kurzlink)
 * bleibt es beim Button, der die Seite in einem neuen Tab öffnet.
 * `display: "standalone"` hält das Widget außerhalb der einklappbaren
 * "Funktionsaufrufe"-Gruppe, damit es immer sichtbar ist.
 */
export const BookingToolUI = makeAssistantToolUI<
  OfferBookingArgs,
  OfferBookingResult
>({
  toolName: "offer_booking",
  display: "standalone",
  render: function BookingToolRender({ args, result, status }) {
    const t = useTranslations("chat")

    if (status.type === "running" || result === undefined) {
      return (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderIcon className="size-3.5 animate-spin" />
          <span>{t("bookingRunning")}</span>
        </div>
      )
    }

    const { url, embed_url } =
      typeof result === "object" && result !== null ? result : {}
    if (!url) return null

    if (embed_url) {
      return <BookingEmbed url={url} embedUrl={embed_url} />
    }

    return (
      <div className="mb-2">
        <Button size="sm" variant="outline" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <GoogleCalendarIcon className="size-4" />
            {args.button_label || t("bookingButton")}
          </a>
        </Button>
      </div>
    )
  },
})
