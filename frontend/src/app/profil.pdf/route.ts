import { createElement, type ReactElement } from "react"
import type { NextRequest } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"

import { routing } from "@/i18n/routing"
import { ProfilPdf, type ProfilPdfLabels } from "@/components/profil-pdf"

// Liegt außerhalb von app/[locale] (der Proxy-Matcher klammert Pfade mit
// Dateiendung aus) — die Sprache kommt deshalb als Query-Parameter.
export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("locale")
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const t = await getTranslations({ locale, namespace: "profil" })
  const tSections = await getTranslations({ locale, namespace: "sections" })

  const now = new Date()
  const stand = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(now)

  const labels: ProfilPdfLabels = {
    title: t("title"),
    stand: t("stand", { date: stand }),
    schwerpunkte: tSections("schwerpunkte"),
    projekthistorie: tSections("projekthistorie"),
    werdegang: tSections("werdegang"),
    ausbildung: tSections("ausbildung"),
    techStack: tSections("techStack"),
  }

  const datum = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`
  const filename = `${datum}_${t("title")}_Marius_Schäffer.pdf`
  const filenameAscii = `${datum}_${t("title")}_Marius_Schaeffer.pdf`

  const buffer = await renderToBuffer(
    createElement(ProfilPdf, { locale, labels }) as ReactElement<DocumentProps>
  )

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameAscii}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  })
}
