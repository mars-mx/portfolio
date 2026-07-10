import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  // Deutsch bleibt ohne Prefix auf den bisherigen Pfaden, Englisch unter /en/…
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/ueber-mich": { de: "/ueber-mich", en: "/about" },
    "/profil": { de: "/profil", en: "/profile" },
    "/chat": "/chat",
    // Rechtstexte bleiben deutsch, daher auch keine übersetzten Pfade.
    "/impressum": "/impressum",
    "/datenschutz": "/datenschutz",
  },
})

export type Locale = (typeof routing.locales)[number]
