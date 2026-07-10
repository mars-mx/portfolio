import type { Locale } from "@/i18n/routing"

export const siteConfig = {
  name: "Marius Schäffer",
  brand: "MX Digital",
  url: "https://mxdigital.de",
  email: "marius@mxdigital.de",
  phone: "+49 1520 9608934",
  whatsapp: "https://wa.me/4915251600215",
  social: {
    github: "https://github.com/mars-mx",
    linkedin: "https://linkedin.com/in/mars-mx/",
  },
} as const

/** Href der PDF-Route (app/profil.pdf) — genutzt von der Profil-Seite und dem Chat-Download-Button. */
export function profilPdfHref(locale: Locale): string {
  return locale === "de" ? "/profil.pdf" : `/profil.pdf?locale=${locale}`
}

export const siteText: Record<
  Locale,
  { tagline: string; description: string }
> = {
  de: {
    tagline: "Softwareentwickler mit Fokus auf KI",
    description:
      "Ich entwickle LLM-Agentensysteme für den Enterprise-Einsatz: Tool-Anbindung & RAG, Context Engineering. Produktionsreif, messbar, DSGVO-konform.",
  },
  en: {
    tagline: "Software engineer focused on AI",
    description:
      "I build LLM agent systems for enterprise use: tool integration & RAG, context engineering. Production-ready, measurable, GDPR-compliant.",
  },
}
