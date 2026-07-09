import type { Locale } from "@/i18n/routing"

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
  role: string
  note: string
  stack: string[]
}

export type Service = {
  index: string
  title: string
  description: string
  tags: string[]
}

export type ProfileContent = {
  services: Service[]
  werdegang: TimelineItem[]
  ausbildung: TimelineItem[]
  projekte: Projekt[]
}

// Sprachneutral — Technologienamen werden nicht übersetzt.
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

export const profileContent: Record<Locale, ProfileContent> = {
  de: {
    services: [
      {
        index: "01",
        title: "Enterprise LLM-Agentensysteme",
        description:
          "Agentensysteme, die im Unternehmen produktiv laufen: Architektur, Orchestrierung, Evaluierung und Betrieb. Produktionsreif statt Proof of Concept.",
        tags: ["Python", "Pydantic AI", "Multi-Agent-Architekturen", "Evals & Monitoring"],
      },
      {
        index: "02",
        title: "Tool-Anbindung & RAG",
        description:
          "Agenten, die wirklich arbeiten: angebunden an Ihre Systeme und Daten über Function Calling, MCP und RAG-Pipelines mit sauberem Grounding.",
        tags: ["MCP", "Function Calling", "FastAPI", "Qdrant"],
      },
      {
        index: "03",
        title: "Context Engineering",
        description:
          "Die Disziplin hinter zuverlässigen LLM-Systemen: Was das Modell wann sieht. Prompts, Memory und Retrieval gezielt gestaltet, für messbar bessere Ergebnisse.",
        tags: ["OpenAI, Anthropic & Gemini SDKs", "Prompt-Design", "Memory", "Token-Budget"],
      },
    ],
    werdegang: [
      {
        period: "2025 – heute",
        title: "CTO & Gründer",
        org: "SX Solutions GbR",
        note: "Mitgründer und technischer Kopf. Wir automatisieren Geschäftsprozesse mit KI, von der ersten Idee über die Architektur bis zum produktiven Betrieb.",
      },
      {
        period: "2023 – heute",
        title: "Selbstständiger Softwareentwickler",
        org: "MX Digital",
        note: "Freiberufliche Umsetzung von Web-Apps, individueller Software und KI-Lösungen, von der Anforderung bis zum Deployment.",
      },
      {
        period: "2019 – 2023",
        title: "Softwareentwickler",
        org: "CONTACT Software GmbH",
        note: "Entwicklung im professionellen Python-Umfeld: Arbeit an großen Codebasen, Schnittstellen und produktnaher Software.",
      },
    ],
    ausbildung: [
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
    ],
    projekte: [
      {
        period: "2025 – heute",
        title: "KI-Telefonassistent als Self-Service-SaaS",
        industry: "SaaS",
        role: "Kundenauftrag",
        note: "Entwicklung eines KI-Telefonassistenten als Self-Service-SaaS: Wissensdatenbank mit Latenzoptimierung, LLM-Evaluierung, Telefonnummern-Provisionierung, Kalender- und Drittsystem-Integrationen sowie Dashboard und Endkunden-Onboarding.",
        stack: ["Python", "LiveKit SDK", "FastAPI", "FastMCP", "Qdrant", "Next.js (React)"],
      },
      {
        period: "2025 – heute",
        title: "Copyhero — KI-Produktseiten für Shopify",
        industry: "SaaS",
        role: "Gründer & CTO",
        note: "Technische Gesamtverantwortung für das SaaS-Produkt: asynchrone AI-Processing-Queue mit Skalierung über AWS Lambda & SQS, LLM-Integration sowie mandantenfähige Nutzer- und Abrechnungsstruktur.",
        stack: ["FastAPI", "Pydantic AI", "PostgreSQL", "pgvector"],
      },
      {
        period: "2024 – 2026",
        title: "PLM-Migration von CORBA zur Web-App",
        industry: "Chemie",
        role: "Kundenauftrag",
        note: "Umsetzung der Migration eines Enterprise-Legacy-CORBA-Clients des CONTACT-Software-PLM-Systems in eine moderne React-SPA sowie Customizing der bestehenden Python-Morepath-Schnittstellen.",
        stack: ["React", "Python", "Morepath", "REST"],
      },
      {
        period: "2024 – 2024",
        title: "KI-gestützte Leadgenerierung",
        industry: "Automotive",
        role: "Kundenauftrag",
        note: "Automatisierter Workflow zur Kundenidentifikation: SERP-Recherche, LLM-Analyse von Unternehmenswebsites und Aufbereitung der Ergebnisse als Report.",
        stack: ["n8n", "SERP API", "DataForSEO", "MCP"],
      },
      {
        period: "2023 – 2024",
        title: "Produktdaten-Automatisierung für Google Shopping",
        industry: "E-Commerce",
        role: "Kundenauftrag",
        note: "Automatisierte Generierung und Pflege des Google-Shopping-Feeds in Shopify: Python-Backend mit OpenAI-API zur Datenanreicherung, betrieben auf AWS.",
        stack: ["GraphQL", "AWS", "Python", "Lambda", "SQS", "RDS"],
      },
    ],
  },
  en: {
    services: [
      {
        index: "01",
        title: "Enterprise LLM Agent Systems",
        description:
          "Agent systems that run productively in the enterprise: architecture, orchestration, evaluation and operations. Production-ready instead of proof of concept.",
        tags: ["Python", "Pydantic AI", "Multi-agent architectures", "Evals & monitoring"],
      },
      {
        index: "02",
        title: "Tool Integration & RAG",
        description:
          "Agents that actually get work done: connected to your systems and data via function calling, MCP and RAG pipelines with clean grounding.",
        tags: ["MCP", "Function Calling", "FastAPI", "Qdrant"],
      },
      {
        index: "03",
        title: "Context Engineering",
        description:
          "The discipline behind reliable LLM systems: what the model sees, and when. Prompts, memory and retrieval deliberately designed, for measurably better results.",
        tags: ["OpenAI, Anthropic & Gemini SDKs", "Prompt design", "Memory", "Token budget"],
      },
    ],
    werdegang: [
      {
        period: "2025 – present",
        title: "CTO & Founder",
        org: "SX Solutions GbR",
        note: "Co-founder and technical lead. We automate business processes with AI, from the first idea through architecture to production operations.",
      },
      {
        period: "2023 – present",
        title: "Freelance Software Engineer",
        org: "MX Digital",
        note: "Freelance development of web apps, custom software and AI solutions, from requirements to deployment.",
      },
      {
        period: "2019 – 2023",
        title: "Software Engineer",
        org: "CONTACT Software GmbH",
        note: "Development in a professional Python environment: working on large codebases, interfaces and product-related software.",
      },
    ],
    ausbildung: [
      {
        period: "2021 – 2023",
        title: "M.Sc. Information Systems",
        org: "Leipzig University",
        note: "Specialization at the intersection of software engineering, data and business.",
      },
      {
        period: "2018 – 2021",
        title: "B.Sc. Information Systems",
        org: "University of Bremen",
        note: "Foundations in computer science, software engineering and business.",
      },
      {
        period: "2023 – 2024",
        title: "Coaching Program in Individual Psychology",
        org: "x+1 Akademie",
        note: "Psychology, conversation skills, leadership, conflict & change.",
        details:
          "Human behavior, conversation skills, leadership & team development, conflict management, change processes and entrepreneurial thinking.",
      },
    ],
    projekte: [
      {
        period: "2025 – present",
        title: "AI Phone Assistant as Self-Service SaaS",
        industry: "SaaS",
        role: "Client project",
        note: "Development of an AI phone assistant as a self-service SaaS: knowledge base with latency optimization, LLM evaluation, phone number provisioning, calendar and third-party integrations, plus a dashboard and end-customer onboarding.",
        stack: ["Python", "LiveKit SDK", "FastAPI", "FastMCP", "Qdrant", "Next.js (React)"],
      },
      {
        period: "2025 – present",
        title: "Copyhero — AI Product Pages for Shopify",
        industry: "SaaS",
        role: "Founder & CTO",
        note: "Overall technical responsibility for the SaaS product: asynchronous AI processing queue scaling via AWS Lambda & SQS, LLM integration, and a multi-tenant user and billing structure.",
        stack: ["FastAPI", "Pydantic AI", "PostgreSQL", "pgvector"],
      },
      {
        period: "2024 – 2026",
        title: "PLM Migration from CORBA to a Web App",
        industry: "Chemicals",
        role: "Client project",
        note: "Migration of an enterprise legacy CORBA client of the CONTACT Software PLM system to a modern React SPA, plus customizing of the existing Python Morepath interfaces.",
        stack: ["React", "Python", "Morepath", "REST"],
      },
      {
        period: "2024 – 2024",
        title: "AI-Powered Lead Generation",
        industry: "Automotive",
        role: "Client project",
        note: "Automated workflow for customer identification: SERP research, LLM analysis of company websites and preparation of the results as a report.",
        stack: ["n8n", "SERP API", "DataForSEO", "MCP"],
      },
      {
        period: "2023 – 2024",
        title: "Product Data Automation for Google Shopping",
        industry: "E-commerce",
        role: "Client project",
        note: "Automated generation and maintenance of the Google Shopping feed in Shopify: Python backend with the OpenAI API for data enrichment, running on AWS.",
        stack: ["GraphQL", "AWS", "Python", "Lambda", "SQS", "RDS"],
      },
    ],
  },
}
