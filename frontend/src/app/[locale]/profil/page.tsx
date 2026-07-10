import type { Metadata } from "next"
import Image from "next/image"
import { ArrowLeft, FileDown } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { profilPdfHref, siteConfig, siteText } from "@/lib/site"
import { profileContent, techStack, type TimelineItem } from "@/lib/profile"
import { Button } from "@/components/ui/button"

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "profil" })

  return {
    title: t("title"),
    description: t("metaDescription"),
    robots: { index: false },
  }
}

function SheetHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-zinc-400">
      {children}
    </h2>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[8px] leading-relaxed text-zinc-500">
      {children}
    </span>
  )
}

function ReaderHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
      {children}
    </h2>
  )
}

function ReaderTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {items.map((item) => (
        <li key={item.period + item.title}>
          <p className="font-mono text-xs text-muted-foreground/70">
            {item.period}
          </p>
          <p className="mt-0.5 font-medium">{item.title}</p>
          {item.org ? (
            <p className="text-sm text-muted-foreground">{item.org}</p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default async function ProfilPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("profil")
  const tSections = await getTranslations("sections")
  const { services, werdegang, ausbildung, projekte } = profileContent[locale]
  const { tagline, description } = siteText[locale]

  const stand = new Intl.DateTimeFormat(locale === "de" ? "de-DE" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date())
  const standLine = t("stand", { date: stand })

  const pdfHref = profilPdfHref(locale)

  return (
    <>
      <style>{`
        @page { size: A4; margin: 0; }
        #profil-sheet {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          html, body { background: #fff !important; }
        }
      `}</style>

      <div className="bg-muted/40 print:bg-white">
        {/* Toolbar — nur am Bildschirm */}
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 sm:px-6 print:hidden">
          <Link
            href="/ueber-mich"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </Link>
          <Button size="sm" asChild>
            <a href={pdfHref} download>
              <FileDown className="size-4" />
              {t("download")}
            </a>
          </Button>
        </div>

        {/* Reader-Ansicht — auf schmalen Viewports passt der A4-Bogen nicht */}
        <div className="mx-auto max-w-2xl px-4 pb-16 sm:px-6 lg:hidden print:hidden">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-mono text-2xl font-semibold">
                {siteConfig.name}
              </h1>
              <p className="mt-1 text-muted-foreground">{tagline}</p>
            </div>
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full border">
              <Image
                src="/marius_schaeffer.jpg"
                alt="Marius Schäffer"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>
          </header>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>{siteConfig.email}</span>
            <span>{siteConfig.phone}</span>
            <span>mxdigital.de</span>
          </div>

          <section className="mt-10 border-t pt-8">
            <ReaderHeading>{tSections("schwerpunkte")}</ReaderHeading>
            <ul className="mt-5 space-y-5">
              {services.map((s) => (
                <li key={s.title} className="grid grid-cols-[24px_1fr] gap-x-3">
                  <span className="pt-0.5 font-mono text-xs text-muted-foreground/70">
                    {s.index}
                  </span>
                  <div>
                    <h3 className="font-medium">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <ReaderHeading>{tSections("projekthistorie")}</ReaderHeading>
            <ul className="mt-5 space-y-6">
              {projekte.map((p) => (
                <li key={p.period + p.title}>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground/70">
                    {p.period} · {p.industry} · {p.role}
                  </p>
                  <h3 className="mt-1 font-medium">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {p.note}
                  </p>
                  <p className="mt-1.5 font-mono text-xs text-muted-foreground/70">
                    {p.stack.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <ReaderHeading>{tSections("werdegang")}</ReaderHeading>
            <ReaderTimeline items={werdegang} />
          </section>

          <section className="mt-10">
            <ReaderHeading>{tSections("ausbildung")}</ReaderHeading>
            <ReaderTimeline items={ausbildung} />
          </section>

          <section className="mt-10">
            <ReaderHeading>{tSections("techStack")}</ReaderHeading>
            <ul className="mt-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 border-t pt-4 font-mono text-xs text-muted-foreground/70">
            <p>linkedin.com/in/mars-mx · github.com/mars-mx</p>
            <p className="mt-1">{standLine}</p>
          </div>
        </div>

        {/* A4-Bogen — ab lg und im Druck */}
        <div className="hidden overflow-x-auto pb-12 lg:block print:block print:overflow-visible print:pb-0">
          <div
            id="profil-sheet"
            className="mx-auto flex h-[297mm] w-[210mm] shrink-0 flex-col bg-white px-[14mm] py-[11mm] text-zinc-900 shadow-xl ring-1 ring-black/5 print:shadow-none print:ring-0"
          >
            {/* Kopfzeile */}
            <div className="flex items-baseline justify-between border-b border-zinc-200 pb-2.5 font-mono text-[8px] uppercase tracking-[0.25em] text-zinc-400">
              <span>
                {siteConfig.brand} — {t("title")}
              </span>
              <span>mxdigital.de</span>
            </div>

            {/* Kopf */}
            <header className="mt-5 flex items-start justify-between gap-8">
              <div className="min-w-0">
                <h1 className="font-mono text-[27px] font-semibold leading-tight">
                  {siteConfig.name}
                </h1>
                <p className="mt-1 text-[13px] text-zinc-500">{tagline}</p>
                <p className="mt-3.5 max-w-[112mm] text-[10px] leading-relaxed text-zinc-600">
                  {description}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[8.5px] text-zinc-500">
                  <span>{siteConfig.email}</span>
                  <span>{siteConfig.phone}</span>
                  <span>mxdigital.de</span>
                </div>
              </div>
              <div className="relative size-[32mm] shrink-0 overflow-hidden rounded-full border border-zinc-200">
                <Image
                  src="/marius_schaeffer.jpg"
                  alt="Marius Schäffer"
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
            </header>

            {/* Inhalt */}
            <div className="mt-6 grid flex-1 grid-cols-[1.55fr_1fr] gap-x-8 border-t border-zinc-200 pt-5">
              {/* Hauptspalte */}
              <div className="min-w-0 space-y-6">
                <section>
                  <SheetHeading>{tSections("schwerpunkte")}</SheetHeading>
                  <ul className="mt-3 space-y-3.5">
                    {services.map((s) => (
                      <li key={s.title} className="grid grid-cols-[16px_1fr] gap-x-2">
                        <span className="pt-px font-mono text-[8.5px] text-zinc-400">
                          {s.index}
                        </span>
                        <div>
                          <h3 className="text-[11px] font-semibold leading-snug">
                            {s.title}
                          </h3>
                          <p className="mt-0.5 text-[9.5px] leading-relaxed text-zinc-600">
                            {s.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <SheetHeading>{tSections("projekthistorie")}</SheetHeading>
                  <ul className="mt-3 space-y-4">
                    {projekte.map((p) => (
                      <li key={p.period + p.title}>
                        <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-400">
                          {p.period} · {p.industry} · {p.role}
                        </p>
                        <h3 className="mt-0.5 text-[11px] font-semibold leading-snug">
                          {p.title}
                        </h3>
                        <p className="mt-0.5 text-[9.5px] leading-relaxed text-zinc-600">
                          {p.note}
                        </p>
                        <p className="mt-1 font-mono text-[8px] text-zinc-400">
                          {p.stack.join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Seitenspalte */}
              <div className="min-w-0 space-y-6 border-l border-zinc-200 pl-6">
                <section>
                  <SheetHeading>{tSections("werdegang")}</SheetHeading>
                  <ul className="mt-3 space-y-3">
                    {werdegang.map((item) => (
                      <li key={item.period + item.title}>
                        <p className="font-mono text-[8px] text-zinc-400">
                          {item.period}
                        </p>
                        <p className="text-[10px] font-medium leading-snug">
                          {item.title}
                        </p>
                        {item.org ? (
                          <p className="text-[9px] text-zinc-500">{item.org}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <SheetHeading>{tSections("ausbildung")}</SheetHeading>
                  <ul className="mt-3 space-y-3">
                    {ausbildung.map((item) => (
                      <li key={item.period + item.title}>
                        <p className="font-mono text-[8px] text-zinc-400">
                          {item.period}
                        </p>
                        <p className="text-[10px] font-medium leading-snug">
                          {item.title}
                        </p>
                        {item.org ? (
                          <p className="text-[9px] text-zinc-500">{item.org}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <SheetHeading>{tSections("techStack")}</SheetHeading>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {techStack.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Fußzeile */}
            <div className="mt-4 flex items-baseline justify-between border-t border-zinc-200 pt-2.5 font-mono text-[8px] text-zinc-400">
              <span>
                {siteConfig.name} · {siteConfig.brand} · mxdigital.de ·
                linkedin.com/in/mars-mx · github.com/mars-mx
              </span>
              <span>{standLine}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
