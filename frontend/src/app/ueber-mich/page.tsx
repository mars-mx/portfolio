import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { FileDown } from "lucide-react"

import {
  ausbildung,
  projekte,
  techStack,
  werdegang,
  type TimelineItem,
} from "@/lib/profile"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/ui/blur-fade"
import { GlassHoverCard } from "@/components/glass-hover-card"

export const metadata: Metadata = {
  title: "Profil",
  description:
    "Marius Schäffer, Softwareentwickler mit Fokus auf KI. Werdegang, Ausbildung und Tech-Stack.",
}

function Timeline({ items }: { items: TimelineItem[] }) {
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
                  Inhalte
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

export default function UeberMichPage() {
  return (
    <PageShell
      title="Profil"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link href="/profil">
            <FileDown className="size-4" />
            PDF
          </Link>
        </Button>
      }
    >
      <BlurFade delay={0.1}>
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
            <p>
              Ich bin Marius Schäffer, Softwareentwickler mit Fokus auf
              Künstliche Intelligenz. Aus Begeisterung beschäftige ich mich seit
              meiner Kindheit mit allen Themen rund um den Computer.
            </p>
            <p>
              Mein Schwerpunkt sind LLM-Agentensysteme für den Enterprise-Einsatz:
              Tool-Anbindung &amp; RAG, Context Engineering und die Automatisierung
              ganzer Geschäftsprozesse, von der Architektur bis zum produktiven
              Betrieb.
            </p>
            <p>
              Neben der Technik beschäftige ich mich mit Individualpsychologie und
              Coaching. Am Ende des Tages ist Software ein Tool, das Menschen
              hilft, ihre Aufgaben &amp; Ziele zu erreichen.
            </p>
          </div>
        </div>
      </BlurFade>

      <Section title="Werdegang">
        <Timeline items={werdegang} />
      </Section>

      <Section title="Projekthistorie">
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

      <Section title="Ausbildung">
        <Timeline items={ausbildung} />
      </Section>

      <Section title="Tech-Stack">
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
