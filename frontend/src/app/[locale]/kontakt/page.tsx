import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { localeAlternates } from "@/i18n/alternates"
import type { Locale } from "@/i18n/routing"
import { PageShell } from "@/components/page-shell"
import { ContactForm } from "@/components/contact-form"
import { BorderBeam } from "@/components/ui/border-beam"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "kontakt" })

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/kontakt"),
  }
}

export default async function KontaktPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("kontakt")

  return (
    <PageShell title={t("title")}>
      <p>{t("intro")}</p>
      <div className="relative mt-2 overflow-hidden rounded-xl border border-border/60 bg-card p-6">
        <ContactForm />
        <BorderBeam
          size={120}
          duration={10}
          colorFrom="#a1a1aa"
          colorTo="#fafafa"
          className="opacity-70"
        />
      </div>
    </PageShell>
  )
}
