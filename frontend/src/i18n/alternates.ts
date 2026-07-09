import type { Metadata } from "next"

import { getPathname } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"

type Href = Parameters<typeof getPathname>[0]["href"]

// Canonical + hreflang-Alternates für eine statische Route (ohne Params).
export function localeAlternates(
  locale: string,
  href: Href
): Metadata["alternates"] {
  return {
    canonical: getPathname({ locale: locale as Locale, href }),
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, getPathname({ locale: l, href })])
    ),
  }
}
