import type { Metadata } from "next"
import Image from "next/image"

import { PageShell } from "@/components/page-shell"
import { BlurFade } from "@/components/ui/blur-fade"
import { GlassHoverCard } from "@/components/glass-hover-card"

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Marius Schäffer — Softwareentwickler mit Fokus auf KI. Werdegang, Ausbildung und Tech-Stack.",
}

type TimelineItem = {
  period: string
  title: string
  org?: string
  note?: string
  details?: string
}

const werdegang: TimelineItem[] = [
  {
    period: "2025 – heute",
    title: "CTO & Gründer",
    org: "SX Solutions GbR",
    note: "Mitgründer und technischer Kopf. Wir automatisieren Geschäftsprozesse mit KI — von der ersten Idee über die Architektur bis zum produktiven Betrieb.",
  },
  {
    period: "2023 – heute",
    title: "Selbstständiger Softwareentwickler",
    note: "Freiberufliche Umsetzung von Web-Apps, individueller Software und KI-Lösungen — von der Anforderung bis zum Deployment.",
  },
  {
    period: "2019 – 2023",
    title: "Softwareentwickler",
    org: "CONTACT Software GmbH",
    note: "Entwicklung im professionellen Python-Umfeld: Arbeit an großen Codebasen, Schnittstellen und produktnaher Software.",
  },
]

const ausbildung: TimelineItem[] = [
  {
    period: "2021 – 2023",
    title: "M.Sc. Wirtschaftsinformatik",
    org: "Universität Leipzig",
    note: "Vertiefung an der Schnittstelle von Softwareentwicklung, Daten und Betriebswirtschaft.",
  },
  {
    period: "2018 – 2021",
    title: "B.Sc. Wirtschaftsinformatik",
    org: "Universität Bremen",
    note: "Grundlagen in Informatik, Softwareentwicklung und Wirtschaft.",
  },
  {
    period: "2023 – 2024",
    title: "Studiengang zum Coach der Individualpsychologie",
    org: "x+1 Akademie",
    note: "Psychologie, Gesprächsführung, Führung, Konflikt & Veränderung.",
    details:
      "Menschliches Handeln, Gesprächsführung, Führung & Teamentwicklung, Konfliktmanagement, Veränderungsprozesse und unternehmerisches Denken.",
  },
]

type Projekt = {
  period: string
  title: string
  industry: string
  note: string
  stack: string[]
}

// Zeiträume teils geschätzt (freelancermap nennt keine Daten) — bei Bedarf korrigieren.
const projekte: Projekt[] = [
  {
    period: "2025 – heute",
    title: "KI-Conversion-Optimierung für Copyhero",
    industry: "SaaS",
    note: "Technische Gesamtverantwortung für das SaaS-Produkt: asynchrone AI-Processing-Queue mit Skalierung über AWS Lambda & SQS, LLM-Integration sowie mandantenfähige Nutzer- und Abrechnungsstruktur.",
    stack: ["Python", "TypeScript", "AWS", "Terraform", "OpenAI API"],
  },
  {
    period: "2024 – 2025",
    title: "PLM-Migration von CORBA zur Web-App",
    industry: "Chemie",
    note: "Umsetzung der Migration eines Enterprise-Legacy-CORBA-Clients des CONTACT-Software-PLM-Systems in eine moderne React-SPA sowie Customizing der bestehenden Python-Morepath-Schnittstellen.",
    stack: ["React", "Python", "Morepath"],
  },
  {
    period: "2024 – 2024",
    title: "KI-gestützte Leadgenerierung",
    industry: "Automotive",
    note: "Automatisierter Workflow zur Kundenidentifikation: SERP-Recherche, LLM-Analyse von Unternehmenswebsites und Aufbereitung der Ergebnisse als Report.",
    stack: ["n8n", "Google SERP API", "LLMs"],
  },
  {
    period: "2023 – 2024",
    title: "Produktdaten-Automatisierung für Google Shopping",
    industry: "E-Commerce",
    note: "Automatisierte Generierung und Pflege des Google-Shopping-Feeds in Shopify: Python-Backend mit OpenAI-API zur Datenanreicherung, betrieben auf AWS.",
    stack: ["Python", "OpenAI API", "Shopify", "AWS"],
  },
]

const stack = [
  "Python",
  "Pydantic AI",
  "TypeScript",
  "OpenAI, Anthropic & Gemini APIs",
  "RAG & Qdrant",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "Docker",
  "Terraform",
  "AWS",
  "GCP",
]

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
    <PageShell title="Über mich">
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
              Ich bin Marius Schäffer — Softwareentwickler mit Fokus auf
              Künstliche Intelligenz. Aus Begeisterung beschäftige ich mich seit
              meiner Kindheit mit allen Themen rund um den Computer.
            </p>
            <p>
              Mein Schwerpunkt sind LLM-Agentensysteme für den Enterprise-Einsatz:
              Tool-Anbindung &amp; RAG, Context Engineering und die Automatisierung
              ganzer Geschäftsprozesse — von der Architektur bis zum produktiven
              Betrieb.
            </p>
            <p>
              Neben der Technik beschäftige ich mich mit Individualpsychologie und
              Coaching — eine Perspektive, die mir hilft, Menschen und ihre
              Probleme hinter der Software wirklich zu verstehen.
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
          {stack.map((tech) => (
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
