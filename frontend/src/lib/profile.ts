export type TimelineItem = {
  period: string
  title: string
  org?: string
  note?: string
  details?: string
}

export type Projekt = {
  period: string
  title: string
  industry: string
  note: string
  stack: string[]
}

export type Service = {
  index: string
  title: string
  description: string
  tags: string[]
}

export const services: Service[] = [
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

export const werdegang: TimelineItem[] = [
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

export const ausbildung: TimelineItem[] = [
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

export const projekte: Projekt[] = [
  {
    period: "2025 – heute",
    title: "KI-Telefonassistent als Self-Service-SaaS",
    industry: "SaaS",
    note: "Entwicklung eines KI-Telefonassistenten als Self-Service-SaaS: Wissensdatenbank mit Latenzoptimierung, LLM-Evaluierung, Telefonnummern-Provisionierung, Kalender- und Drittsystem-Integrationen sowie Dashboard und Endkunden-Onboarding.",
    stack: ["Python", "LiveKit SDK", "FastAPI", "FastMCP", "Qdrant", "Next.js (React)"],
  },
  {
    period: "2025 – heute",
    title: "KI-Conversion-Optimierung für Copyhero",
    industry: "SaaS",
    note: "Technische Gesamtverantwortung für das SaaS-Produkt: asynchrone AI-Processing-Queue mit Skalierung über AWS Lambda & SQS, LLM-Integration sowie mandantenfähige Nutzer- und Abrechnungsstruktur.",
    stack: ["FastAPI", "Pydantic AI", "PostgreSQL", "pgvector"],
  },
  {
    period: "2024 – heute",
    title: "PLM-Migration von CORBA zur Web-App",
    industry: "Chemie",
    note: "Umsetzung der Migration eines Enterprise-Legacy-CORBA-Clients des CONTACT-Software-PLM-Systems in eine moderne React-SPA sowie Customizing der bestehenden Python-Morepath-Schnittstellen.",
    stack: ["React", "Python", "Morepath", "REST"],
  },
  {
    period: "2024 – 2024",
    title: "KI-gestützte Leadgenerierung",
    industry: "Automotive",
    note: "Automatisierter Workflow zur Kundenidentifikation: SERP-Recherche, LLM-Analyse von Unternehmenswebsites und Aufbereitung der Ergebnisse als Report.",
    stack: ["n8n", "SERP API", "DataForSEO", "MCP"],
  },
  {
    period: "2023 – 2024",
    title: "Produktdaten-Automatisierung für Google Shopping",
    industry: "E-Commerce",
    note: "Automatisierte Generierung und Pflege des Google-Shopping-Feeds in Shopify: Python-Backend mit OpenAI-API zur Datenanreicherung, betrieben auf AWS.",
    stack: ["GraphQL", "AWS", "Python", "Lambda", "SQS", "RDS"],
  },
]

export const techStack = [
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
