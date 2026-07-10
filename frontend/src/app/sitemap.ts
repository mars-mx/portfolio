import type { MetadataRoute } from "next"

import { getPathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

const BASE_URL = "https://mxdigital.de"

// Statische Routen ohne Params. Reihenfolge/Pfade kommen aus routing.ts
// (single source of truth, gleiche Basis wie i18n/alternates.ts).
// /profil fehlt bewusst: die Seite ist noindex, noindexte URLs gehören
// nicht in die Sitemap.
// lastModified: Datum von Hand nachziehen, wenn Inhalt der Seite sich
// ändert (kein Git-Log-Zugriff zur Laufzeit möglich, da der Docker-
// Standalone-Build kein .git enthält).
const routes: { href: keyof typeof routing.pathnames; lastModified: string }[] = [
  { href: "/", lastModified: "2026-07-10" },
  { href: "/ueber-mich", lastModified: "2026-07-10" },
  { href: "/chat", lastModified: "2026-07-10" },
  { href: "/impressum", lastModified: "2026-07-09" },
  { href: "/datenschutz", lastModified: "2026-07-09" },
]

function absoluteUrl(pathname: string): string {
  return pathname === "/" ? BASE_URL : `${BASE_URL}${pathname}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ href, lastModified }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(getPathname({ locale, href })),
      ])
    )

    return {
      url: absoluteUrl(getPathname({ locale: routing.defaultLocale, href })),
      lastModified,
      alternates: {
        languages: {
          ...languages,
          "x-default": absoluteUrl(
            getPathname({ locale: routing.defaultLocale, href })
          ),
        },
      },
    }
  })
}
