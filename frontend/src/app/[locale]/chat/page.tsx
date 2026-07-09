import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { localeAlternates } from "@/i18n/alternates"
import type { Locale } from "@/i18n/routing"
import { Assistant } from "@/components/assistant"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "chat" })

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/chat"),
  }
}

export default async function ChatPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fester Viewport-Ausschnitt unterhalb des sticky Headers (h-14 = 3.5rem);
  // der Thread scrollt intern, nicht die Seite.
  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-5xl flex-col px-4 sm:px-6">
      <Assistant />
    </div>
  )
}
