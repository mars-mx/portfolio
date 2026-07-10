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

  // Füllt per Flex exakt den Raum zwischen Header und Footer. data-chat-page
  // schaltet body im Layout per has-Variante von min-h-full auf h-full: erst
  // dadurch ist die Höhe definit und der Thread-Viewport scrollt intern,
  // statt dass die Seite mit dem Chatverlauf wächst (overflow-hidden als
  // Guard, min-h-0 erlaubt dem Flex-Item zu schrumpfen). Bewusst volle
  // Breite ohne max-w: die Inhaltsspalte begrenzt der Thread selbst über
  // --thread-max-width, so liegt die Scrollbar am rechten Fensterrand.
  return (
    <div
      data-chat-page
      className="flex min-h-0 w-full flex-1 flex-col overflow-hidden"
    >
      <Assistant />
    </div>
  )
}
