// Statisch gerendert: Inhalt ist fix, kein Request-Bezug.
export const dynamic = "force-static"

const content = `# Marius Schäffer — MX Digital

> Freelance software engineer (Germany) specializing in enterprise LLM agent
> systems: tool integration & RAG, context engineering. Builds production-grade,
> measurable, GDPR-compliant AI systems for businesses. Trading as MX Digital;
> co-founder/CTO of SX Solutions GbR.

Marius Schäffer develops LLM agent systems for enterprise use (architecture,
orchestration, evaluation, operations); connects agents to real systems and
data via function calling, MCP, and RAG pipelines with clean grounding; and
practices context engineering (prompt design, memory, token budgeting) for
reliable, measurable results.

Tech stack: Python, Pydantic AI, TypeScript, OpenAI/Anthropic/Gemini APIs,
RAG & Qdrant, React, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes,
Terraform, AWS, Azure AI Foundry.

Career: CTO & co-founder, SX Solutions GbR (2025–present) · Freelance software
developer, MX Digital (2023–present) · Software developer, CONTACT Software
GmbH (2019–2023).

Education: M.Sc. Wirtschaftsinformatik, Universität Leipzig (2021–2023) ·
B.Sc. Wirtschaftsinformatik, Universität Bremen (2018–2021).

## Pages

- [Home](https://mxdigital.de/): Services overview — enterprise LLM agent
  systems, tool integration & RAG, context engineering.
- [Profil](https://mxdigital.de/ueber-mich): Full career history, education,
  project history, and tech stack.
- [Profile (English)](https://mxdigital.de/en/about): English version.
- [PDF résumé](https://mxdigital.de/profil.pdf): Downloadable structured résumé.
- [Chat](https://mxdigital.de/chat): AI assistant that answers questions about
  Marius Schäffer's work, skills, and experience.

## Optional

- [Impressum](https://mxdigital.de/impressum): Legal/business registration details.
- [Datenschutz](https://mxdigital.de/datenschutz): Privacy policy.
- [GitHub](https://github.com/mars-mx): Code and open-source activity.
- [LinkedIn](https://linkedin.com/in/mars-mx/): Professional profile.
`

export function GET() {
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
