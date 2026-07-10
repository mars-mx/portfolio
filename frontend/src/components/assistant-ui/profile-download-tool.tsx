"use client"

import { makeAssistantToolUI } from "@assistant-ui/react"
import { FileDown, LoaderIcon } from "lucide-react"
import { hasLocale, useLocale, useTranslations } from "next-intl"

import { routing } from "@/i18n/routing"
import { profilPdfHref } from "@/lib/site"
import { Button } from "@/components/ui/button"

// Contract mit dem Backend-Tool `offer_profile_download` (backend/app/agent/assistant.py):
// das Modell liefert die Button-Beschriftung in der Sprache des Nutzers.
type OfferProfileDownloadArgs = {
  button_label?: string
}

/**
 * Eigene Tool-UI für den Profil-Download: rendert einen Download-Button für
 * das Profil-PDF (app/profil.pdf). `display: "standalone"` hält den Button
 * außerhalb der einklappbaren "Funktionsaufrufe"-Gruppe, damit er immer
 * sichtbar ist.
 */
export const ProfileDownloadToolUI = makeAssistantToolUI<
  OfferProfileDownloadArgs,
  string
>({
  toolName: "offer_profile_download",
  display: "standalone",
  render: function ProfileDownloadToolRender({ args, status }) {
    const t = useTranslations("chat")
    const requested = useLocale()
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale

    if (status.type === "running") {
      return (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderIcon className="size-3.5 animate-spin" />
          <span>{t("profileDownloadRunning")}</span>
        </div>
      )
    }

    return (
      <div className="mb-2">
        <Button size="sm" asChild>
          <a href={profilPdfHref(locale)} download>
            <FileDown className="size-4" />
            {args.button_label || t("profileDownloadButton")}
          </a>
        </Button>
      </div>
    )
  },
})
