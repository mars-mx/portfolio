"use client"

import { useLocale, useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

// Zeigt die aktuell aktive Sprache; ein Klick wechselt zur jeweils anderen.
export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations("localeSwitcher")
  const other = locale === "de" ? "en" : "de"

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="font-mono text-xs uppercase text-muted-foreground"
    >
      <Link
        href={pathname}
        locale={other}
        hrefLang={other}
        aria-label={t("label")}
      >
        {locale}
      </Link>
    </Button>
  )
}
