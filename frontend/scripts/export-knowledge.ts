// Exportiert die Website-Inhalte als Markdown-Wissensdokumente für den
// KI-Agenten des Backends. Single Source of Truth: src/lib/profile.ts + site.ts.
// Ausführen: pnpm run export:knowledge

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { profileContent, techStack, type TimelineItem } from "../src/lib/profile"
import { siteConfig, siteText } from "../src/lib/site"

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../backend/knowledge")

const GENERATED_NOTE =
  "<!-- GENERIERT aus frontend/src/lib/profile.ts + site.ts — nicht von Hand editieren. Regenerieren: make knowledge -->"

// Die Wissensbasis ist deutsch — der Agent antwortet trotzdem in der Sprache des Nutzers.
const profile = profileContent.de
const text = siteText.de

// Frontmatter bewusst flach (nur key: value) — Contract mit dem Mini-Parser des Backends.
function doc(title: string, description: string, body: string): string {
  return `---\ntitle: ${title}\ndescription: ${description}\n---\n${GENERATED_NOTE}\n\n${body}\n`
}

function station(item: TimelineItem): string {
  const kopf = item.org ? `**${item.title}**, ${item.org}` : `**${item.title}**`
  const beschreibung = [item.note, item.details].filter(Boolean).join(" ")
  return `- ${kopf} (${item.period})${beschreibung ? ` — ${beschreibung}` : ""}`
}

const profil = [
  `**${siteConfig.name}** — ${text.tagline} (${siteConfig.brand}, ${siteConfig.url}).`,
  text.description,
  ...profile.services.map(
    (s) => `## ${s.title}\n\n${s.description}\n\n**Tech:** ${s.tags.join(", ")}`,
  ),
  `## Tech-Stack\n\n${techStack.map((t) => `- ${t}`).join("\n")}`,
].join("\n\n")

const projekte = profile.projekte
  .map((p) =>
    [
      `## ${p.title}`,
      `**Zeitraum:** ${p.period}\n**Rolle:** ${p.role}\n**Branche:** ${p.industry}`,
      p.note,
      `**Stack:** ${p.stack.join(", ")}`,
    ].join("\n\n"),
  )
  .join("\n\n")

const werdegang = [
  `## Werdegang\n\n${profile.werdegang.map(station).join("\n")}`,
  `## Ausbildung\n\n${profile.ausbildung.map(station).join("\n")}`,
].join("\n\n")

const socialLabels: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn" }

const kontakt = [
  "## Kontakt",
  [
    `- **E-Mail:** ${siteConfig.email}`,
    `- **WhatsApp:** ${siteConfig.whatsapp}`,
    ...Object.entries(siteConfig.social).map(
      ([key, url]) => `- **${socialLabels[key] ?? key}:** ${url}`,
    ),
    `- **Website:** ${siteConfig.url}`,
  ].join("\n"),
].join("\n\n")

const files: Record<string, string> = {
  "website-profil.md": doc(
    "Profil & Leistungen",
    "Wer Marius Schäffer ist, welche Leistungen er anbietet und mit welchem Tech-Stack er arbeitet.",
    profil,
  ),
  "website-projekte.md": doc(
    "Projekte",
    "Projekthistorie von Marius Schäffer mit Zeitraum, Rolle, Branche und Stack je Projekt.",
    projekte,
  ),
  "website-werdegang.md": doc(
    "Werdegang & Ausbildung",
    "Berufliche Stationen und Abschlüsse von Marius Schäffer.",
    werdegang,
  ),
  "website-kontakt.md": doc(
    "Kontakt",
    "E-Mail, WhatsApp und Social-Media-Profile von Marius Schäffer.",
    kontakt,
  ),
}

mkdirSync(OUT_DIR, { recursive: true })
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(OUT_DIR, name), content)
}
console.log(`${Object.keys(files).length} Wissensdokumente nach ${OUT_DIR} geschrieben.`)
