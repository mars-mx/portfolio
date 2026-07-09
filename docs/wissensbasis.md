# Wissensbasis des Chat-Assistenten

Der KI-Assistent (`/chat`) beantwortet Faktenfragen über eine file-basierte
RAG-Pipeline — Markdown-Dateien als Content, OpenAI-Embeddings, exakte
numpy-Suche. Bewusst ohne Vektor-Datenbank (Begründung unten).

## Architektur

```
frontend/src/lib/profile.ts ──(make knowledge)──▶ backend/knowledge/website-*.md
                                                  backend/knowledge/*.md  (handgeschrieben)
                                                          │
                                                          ▼  Chunking + Embeddings
                                              backend/.cache/knowledge-index.json
                                                          │
                                                          ▼  numpy Top-k (Cosine)
                                        Agent-Tools: search_knowledge / read_document
```

**Content-Layer** (`backend/knowledge/`): Markdown mit simplem Frontmatter
(`title`, `description`). Die `website-*.md` werden per `make knowledge` aus
`frontend/src/lib/profile.ts`/`site.ts` generiert — die Website bleibt Single
Source of Truth, nichts wird doppelt gepflegt. Zusätzliche Hintergrund-Dokumente
werden einfach als neue `.md`-Datei daneben gelegt; sie erscheinen ohne
Code-Änderung im Dokument-Index des Agenten. Achtung: Das Repo ist öffentlich —
für Projekt-Hintergründe gelten dieselben Anonymisierungsregeln wie für die
Website.

**Indexing** (`backend/app/agent/knowledge.py`): Dokumente werden an
H2-Überschriften gechunkt. Jeder Chunk trägt Dokument-Kontext im embedded Text
(`{title} — {heading}` plus Frontmatter-Description) — ohne diesen Kontext
verlieren Chunks ihre Dokument-Semantik und kurze Dokumente werden zu
Similarity-Magneten. Embeddings kommen aus einem
Batch-Call an `text-embedding-3-small`; der Index liegt als JSON-Cache in
`backend/.cache/` (gitignored), geschützt durch einen Content-Hash über
Dateiinhalte, Embedding-Modell und Chunker-Version.

**Lifecycle**: Beim App-Start wird der Hash geprüft — unverändert heißt Cache
laden ohne API-Call, geändert heißt einmalig neu embedden (1–2 s,
Centbruchteile). Es gibt keinen Seed-Schritt, den man vergessen könnte. Für
deterministische Container-Starts baut `make index` den Cache im Docker-Build
vor. Im Dev-Modus lädt uvicorn dank `--reload-include '*.md'` auch bei
Content-Änderungen neu.

**Retrieval**: Der Agent (Pydantic AI) bekommt per Instructions den
Dokument-Index und zwei Tools: `search_knowledge` (semantische Top-5-Suche,
für Präzision) und `read_document` (ganzes Dokument, für Tiefe). Grounding per
Instructions: Faktenfragen nur nach Suche beantworten, Quelldokument nennen,
Lücken offen zugeben. Das Frontend rendert die Suche sichtbar
(`knowledge-search-tool.tsx`): Query, gefundene Dokumente und Scores.

## Warum keine Vektor-Datenbank?

Eine Vektor-DB löst Probleme, die dieser Korpus (~10¹–10² Chunks) nicht hat:

- **Latenz**: Die Suche ist ein Matrix-Vektor-Produkt (BLAS). Bei 10.000
  Chunks ~1 ms, bei 100.000 ~20–50 ms — der Embedding-Call für die Query
  (~100–200 ms) dominiert bis weit darüber hinaus. Brute-Force ist hier exakt
  statt approximativ und nie der Flaschenhals.
- **RAM**: 1536 Dimensionen × float32 = 6 KB/Vektor; 100k Chunks ≈ 600 MB.
  Das bindet vor der Rechenzeit.
- **Betrieb**: Der echte Grund für Qdrant & Co. sind Laufzeit-Upserts,
  Metadaten-Filter, Multi-Tenancy, mehrere Writer — Betriebsanforderungen,
  keine Mathe-Anforderungen. Dieser Korpus ist read-only und wird im Build
  erzeugt.

Faustregel: bis ~50k Chunks auf einem read-mostly Korpus reicht Datei + numpy;
danach ist der nächste Schritt eine In-Process-ANN-Library (FAISS/hnswlib),
immer noch ohne Server. Eine Vektor-DB rechtfertigt sich über Betrieb, nicht
über Suchgeschwindigkeit.
