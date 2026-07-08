import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"
import { GitHubIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { DotPattern } from "@/components/ui/dot-pattern"
import { BlurFade } from "@/components/ui/blur-fade"

const services = [
  {
    index: "01",
    title: "Enterprise LLM-Agentensysteme",
    description:
      "Agentensysteme, die im Unternehmen produktiv laufen — Architektur, Orchestrierung, Evaluierung und Betrieb. Produktionsreif statt Proof of Concept.",
    tags: ["Python", "Pydantic AI", "Multi-Agent-Architekturen", "Evals & Monitoring"],
  },
  {
    index: "02",
    title: "Tool-Anbindung & RAG",
    description:
      "Agenten, die wirklich arbeiten: angebunden an Ihre Systeme und Daten — Function Calling, MCP und RAG-Pipelines mit sauberem Grounding.",
    tags: ["MCP", "Function Calling", "FastAPI", "Qdrant"],
  },
  {
    index: "03",
    title: "Context Engineering",
    description:
      "Die Disziplin hinter zuverlässigen LLM-Systemen: Was das Modell wann sieht — Prompts, Memory und Retrieval gezielt gestaltet, für messbar bessere Ergebnisse.",
    tags: ["OpenAI, Anthropic & Gemini SDKs", "Prompt-Design", "Memory", "Token-Budget"],
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
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(420px_circle_at_center,white,transparent)]",
            "opacity-60"
          )}
        />
        <div className="mx-auto flex max-w-5xl flex-col-reverse items-start gap-10 px-4 py-24 sm:px-6 sm:py-32 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <BlurFade delay={0.1}>
              <Link
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                className="group mb-6 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-sm"
              >
                <AnimatedShinyText className="inline-flex items-center gap-1.5">
                  <GitHubIcon className="size-3.5" />
                  <span>github.com/mars-mx</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </Link>
            </BlurFade>

            <BlurFade delay={0.2}>
              <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Hi, ich bin {siteConfig.name}.
                <br />
                <span className="text-muted-foreground">{siteConfig.tagline}.</span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.3}>
              <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                {siteConfig.description}
              </p>
            </BlurFade>

            <BlurFade delay={0.4}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/kontakt">
                    Kontakt aufnehmen
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={siteConfig.social.github} target="_blank" rel="noreferrer">
                    <GitHubIcon className="size-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.2} className="shrink-0">
            <div className="relative size-32 overflow-hidden rounded-full border border-border/60 bg-muted sm:size-40 lg:size-52">
              <Image
                src="/marius_schaeffer.jpg"
                alt="Marius Schäffer"
                fill
                sizes="(min-width: 1024px) 13rem, (min-width: 640px) 10rem, 8rem"
                className="object-cover"
                priority
              />
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Schwerpunkte */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <BlurFade inView>
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Schwerpunkte
          </h2>
        </BlurFade>
        <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
          {services.map((s, i) => (
            <BlurFade key={s.title} inView delay={0.1 + i * 0.1}>
              <div className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-4">
                <span className="font-mono text-sm text-muted-foreground/80">
                  {s.index}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
                    {s.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Tech-Stack */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <BlurFade inView>
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            Tech-Stack
          </h2>
        </BlurFade>
        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((t, i) => (
            <BlurFade key={t} inView delay={i * 0.05}>
              <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                {t}
              </span>
            </BlurFade>
          ))}
        </div>
      </section>

    </>
  )
}
