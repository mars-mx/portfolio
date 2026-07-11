import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { localeAlternates } from "@/i18n/alternates"
import type { Locale } from "@/i18n/routing"
import { PageShell } from "@/components/page-shell"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "impressum" })

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/impressum"),
  }
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("impressum")
  const tLegal = await getTranslations("legal")

  return (
    <PageShell title={t("title")}>
      {/* Rechtstext bleibt deutsch — auf EN nur ein Hinweis. */}
      {locale === "en" ? <p className="text-sm italic">{tLegal("germanOnly")}</p> : null}
      <p className="text-foreground">
        Marius Schäffer
        <br />
        MX Digital
        <br />
        Hollerallee 87
        <br />
        28209 Bremen
        <br />
        Deutschland
      </p>
      <p>
        Tel.: 015209608934
        <br />
        E-Mail:{" "}
        <a
          href="mailto:marius@mxdigital.de"
          className="underline underline-offset-2 hover:text-foreground"
        >
          marius@mxdigital.de
        </a>
      </p>
      <p>Umsatzsteuer-Identifikationsnummer: DE369297586</p>
      <p>
        Verantwortliche/r i.S.d. § 18 Abs. 2 MStV:
        <br />
        Marius Schäffer, Hollerallee 87, 28209 Bremen
      </p>
    </PageShell>
  )
}
