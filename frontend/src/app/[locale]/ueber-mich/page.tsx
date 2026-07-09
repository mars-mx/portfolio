import type { Metadata } from "next"
import Image from "next/image"
import { FileDown } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { localeAlternates } from "@/i18n/alternates"
import type { Locale } from "@/i18n/routing"
import { profileContent, techStack, type TimelineItem } from "@/lib/profile"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { GlassHoverCard } from "@/components/glass-hover-card"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: localeAlternates(locale, "/ueber-mich"),
  }
}

function Timeline({
  items,
  detailsLabel,
}: {
  items: TimelineItem[]
  detailsLabel: string
}) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li
          key={item.period + item.title}
          className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4"
        >
          <span className="font-mono text-sm text-muted-foreground/80">
            {item.period}
          </span>
          <div>
            <p className="font-medium text-foreground">
              {item.title}
              {item.org ? (
                <span className="text-muted-foreground"> · {item.org}</span>
              ) : null}
            </p>
            {item.note && item.details ? (
              <GlassHoverCard trigger={item.note}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                  {detailsLabel}
                </p>
                <p className="mt-1.5 leading-relaxed text-foreground/90">
                  {item.details}
                </p>
              </GlassHoverCard>
            ) : item.note ? (
              <p className="text-sm text-muted-foreground">{item.note}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <BlurFade inView className="mt-12 block">
      <section>
        <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </section>
    </BlurFade>
  )
}

export default async function UeberMichPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("about")
  const tSections = await getTranslations("sections")
  const { werdegang, ausbildung, projekte } = profileContent[locale]

  return (
    <PageShell
      title={t("title")}
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/profil">
            <FileDown className="size-4" />
            PDF
          </Link>
        </Button>
      }
    >
      <div className="motion-safe:animate-[hero-enter_0.4s_ease-out_0.1s_backwards]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full border bg-muted sm:size-32">
            <Image
              src="/marius_schaeffer.jpg"
              alt="Marius Schäffer"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <p>{t("intro1")}</p>
            <p>{t("intro2")}</p>
            <p>{t("intro3")}</p>
          </div>
        </div>
      </div>

      <Section title={tSections("werdegang")}>
        <Timeline items={werdegang} detailsLabel={t("inhalte")} />
      </Section>

      <Section title={tSections("projekthistorie")}>
        <ul className="space-y-5">
          {projekte.map((p) => (
            <li
              key={p.period + p.title}
              className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4"
            >
              <span className="font-mono text-sm text-muted-foreground/80">
                {p.period}
              </span>
              <div>
                <p className="font-medium text-foreground">
                  {p.title}
                  <span className="text-muted-foreground"> · {p.industry}</span>
                </p>
                <p className="text-sm text-muted-foreground">{p.note}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {p.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={tSections("ausbildung")}>
        <Timeline items={ausbildung} detailsLabel={t("inhalte")} />
      </Section>

      <Section title={tSections("techStack")}>
        <ul className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </Section>
    </PageShell>
  )
}
