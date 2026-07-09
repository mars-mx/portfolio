# MX Digital — KI-Assistent (Assistant UI + Pydantic AI)

> Framework-Recherche für einen vollständig gestreamten KI-Chat-Assistenten:
> [assistant-ui](https://www.assistant-ui.com) im Frontend, [Pydantic AI](https://pydantic.dev/docs/ai/) im Backend.
> Stand: **Juli 2026** (recherchiert gegen die Live-Doku beider Frameworks; Repo-Stand: Next.js 16.2.9 / React 19.2.4, FastAPI ≥0.137 / Python 3.12).

---

## Entscheidung (TL;DR)

| Bereich | Entscheidung | Zweite Wahl |
|---|---|---|
| Wire-Protokoll | **AI SDK „UI Message Stream“** (SSE) — beide Frameworks sprechen es nativ und offiziell | AG-UI |
| Frontend | **`useChatRuntime` + `AssistantChatTransport`** aus `@assistant-ui/react-ai-sdk` (v1.x → AI SDK v6) | `useDataStreamRuntime` |
| Backend | **`VercelAIAdapter`** aus `pydantic_ai.ui.vercel_ai` (pydantic-ai 2.7.0) mit `sdk_version=6` | `AGUIAdapter` |
| State | **Stateless Backend** — Frontend sendet die volle `UIMessage[]`-Historie pro Request | Persistenz via `on_complete`-Callback |
| Modell | `openai:gpt-5-mini` (Responses API, direkt gegen die OpenAI API) | `openai:gpt-5.2` (Flaggschiff) |

**Zur Einordnung des Namens „Vercel“:** Der `VercelAIAdapter` hat nichts mit Vercel
als Dienst (Hosting, AI Gateway) zu tun — es läuft **kein Traffic über Vercel**. Der
Name bezeichnet ausschließlich das Wire-Protokoll des Vercel **AI SDK** („UI Message
Stream“), also das Format, in dem Frontend und Backend miteinander streamen. Die
LLM-Calls macht Pydantic AI **direkt gegen die OpenAI API**.

**Warum das ohne Hacks funktioniert:** Pydantic AI liefert mit `VercelAIAdapter` einen
first-party Emitter für das AI-SDK-UI-Message-Stream-Protokoll, und assistant-uis
`AssistantChatTransport` ist ein first-party Consumer genau dieses Protokolls
(erweitert `DefaultChatTransport` aus dem AI SDK und akzeptiert beliebige absolute
URLs — cross-origin zu FastAPI ist explizit vorgesehen). Kein Protokoll wird auf
irgendeiner Seite nachgebaut; die Kompatibilität entsteht über den gemeinsamen
offiziellen Standard, nicht über eine Bastel-Brücke.

```
Next.js (Port 3210)                          FastAPI (Port 8210)
┌─────────────────────────────┐              ┌──────────────────────────────┐
│ <Thread /> (shadcn registry)│              │ @app.post("/api/chat")       │
│   useChatRuntime            │  POST        │   VercelAIAdapter            │
│   AssistantChatTransport ───┼─────────────▶│    .dispatch_request(...)    │
│   api: {API_URL}/api/chat   │  UIMessage[] │      └─ Agent (Pydantic AI)  │
│                             │◀─────────────┼─         openai:gpt-5-mini   │
│  rendert Text/Reasoning/    │  SSE:        │  run_stream_events() →       │
│  Tool-Calls streamend       │  UI Message  │  UI-Message-Stream-Chunks    │
└─────────────────────────────┘  Stream      └──────────────────────────────┘
```

---

## 1. Das gemeinsame Protokoll: AI SDK UI Message Stream

- **Request:** Der Transport POSTet JSON mit `{ id, messages: UIMessage[], trigger, system, tools, … }`.
  Genau dieses Format parst `VercelAIAdapter.build_run_input()` (Validierungsfehler → HTTP 422).
  Da die **volle Historie** bei jedem Request mitkommt, braucht das Backend keinerlei Session-State.
- **Response:** SSE (`text/event-stream`, Header `x-vercel-ai-ui-message-stream: v1`) mit typisierten
  Chunks: `text-start/-delta/-end`, `reasoning-start/-delta/-end`, `tool-input-start/-delta/-available`,
  `tool-output-available/-error`, `start-step/finish-step`, `error`, `finish`, `done`.
- **Versions-Pairing (wichtig):** Das Protokoll existiert in v5- und v6-Semantik.
  Beide Seiten müssen zusammenpassen:

  | AI-SDK-Generation | Frontend-Paket | Backend-Einstellung |
  |---|---|---|
  | **v6 (aktuell, empfohlen)** | `@assistant-ui/react-ai-sdk@1.x` (zieht `ai@^6`, `@ai-sdk/react@^3`) | `VercelAIAdapter`-Aufrufe mit `sdk_version=6` |
  | v5 (legacy) | `@assistant-ui/react-ai-sdk@0.x` | Default `sdk_version=5` |

  Wir nehmen **v6**: aktuelle Paketlinie, und Tool-Approval / Human-in-the-Loop
  (`tool-approval-request`-Chunks) gibt es nur dort.

---

## 2. Frontend: assistant-ui

### Paketlandschaft (npm-Stände 2026-07-09)

| Paket | Version | Zweck |
|---|---|---|
| `@assistant-ui/react` | 0.14.26 | Core: Primitives (Thread/Composer/Message), Runtime-Provider |
| `@assistant-ui/react-ai-sdk` | 1.3.40 | **Unser Runtime**: `useChatRuntime`, `AssistantChatTransport` (AI SDK v6) |
| `@assistant-ui/react-markdown` | 0.14.5 | Streaming-Markdown (`MarkdownText`, remark-gfm) |
| `@assistant-ui/react-data-stream` | 0.12.18 | Alternative: `useDataStreamRuntime` (leichter, kein HITL) |
| `@assistant-ui/react-ag-ui` | 0.0.44 | Alternative: AG-UI-Runtime (noch 0.0.x) |
| `@assistant-ui/styles` | 0.3.7 | Nur für Nicht-Tailwind-Projekte — für uns irrelevant |
| `assistant-stream` (PyPI) | 0.0.34 | Python-Backend für AssistantTransport — für uns irrelevant (s. Absagen) |

### Runtime-Wahl

Die Doku („Pick a Runtime“) positioniert `useChatRuntime` als empfohlenen,
funktionsreichsten Default (Persistenz-Adapter, resumable Streams, HITL).
`AssistantChatTransport` akzeptiert alle `HttpChatTransportInitOptions`
(`api`, `headers`, `credentials`, `body`, `fetch`, `prepareSendMessagesRequest`)
und leitet — anders als der nackte `DefaultChatTransport` — auch `system` und
Frontend-`tools` (als JSON Schema) ans Backend weiter.

```tsx
"use client";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

export function Assistant() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/api/chat`, // cross-origin OK, plain fetch
    }),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

### UI-Komposition & Styling

- **shadcn-Registry** (passt zu unserem Setup): `npx shadcn@latest add https://r.assistant-ui.com/thread.json`
  (plus `markdown-text.json` etc.). Die Komponenten werden **ins Repo kopiert** und sind mit
  Tailwind-Klassen gebaut — Theming = Klassen anpassen bzw. unsere bestehenden
  oklch-Tokens aus `globals.css`. Tailwind v4 wird von der Doku selbst verwendet, kein Extra-Setup.
- Komposition über Primitives (`ThreadPrimitive.*`, `ComposerPrimitive.*`,
  `MessagePrimitive.Parts`); Slots wie `AssistantMessage`, `Welcome`, `ToolFallback`
  per `components`-Prop überschreibbar.
- **Streaming-Features out of the box:** progressives Markdown, Reasoning-Parts
  (Reasoning-Summaries der Modelle werden gerendert), Tool-Call-Streaming inkl. argumentweisem
  Status, Generative UI (`defineToolkit` mit `render({ args, result, status })`),
  Abbrechen über den Composer (AbortSignal), optional resumable Streams.

---

## 3. Backend: Pydantic AI

### Version & Installation

- Aktuell **pydantic-ai 2.7.0** (PyPI, 2026-07-09; sehr hohe Release-Frequenz). Python ≥3.10.
- Für unseren Stack reicht die Slim-Variante mit gezielten Extras:

  ```bash
  uv add "pydantic-ai-slim[openai,ui]"
  ```

  `ui` bringt die Starlette-Helfer der UI-Adapter; der Vercel-Adapter selbst liegt im Core
  (kein eigenes Extra). Nur AG-UI bräuchte zusätzlich `ag-ui`.

### Agent & Streaming (Kurzfassung)

- `Agent('openai:gpt-5-mini', instructions=...)`; Tools via `@agent.tool`
  (mit `RunContext[Deps]`) bzw. `@agent.tool_plain`; typisierte Dependencies über `deps_type`.
- `instructions` statt `system_prompt` verwenden — harmoniert mit dem Adapter-Default
  `manage_system_prompt='server'` (clientseitige System-Prompts werden verworfen und
  durch die des Agents ersetzt).
- Streaming-APIs: `run_stream()` (Text/Output-Snapshots), **`run_stream_events()`**
  (Event-Iterator über den gesamten Tool-Call-Loop — darauf bauen die UI-Adapter),
  `iter()` (Graph-Ebene).

### `VercelAIAdapter` — der offizielle Weg zum Frontend

Doku-verbatim ist die Anbindung ein Einzeiler pro Route:

```python
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import Response

from pydantic_ai import Agent
from pydantic_ai.ui.vercel_ai import VercelAIAdapter

agent = Agent('openai:gpt-5-mini', instructions='...')
app = FastAPI()

@app.post('/api/chat')
async def chat(request: Request) -> Response:
    return await VercelAIAdapter.dispatch_request(request, agent=agent)
```

- Parst den `useChat`-Request (`UIMessage[]`), konvertiert via `load_messages()` in
  Pydantic-AI-`ModelMessage`-Historie, ruft intern `run_stream_events()` auf und
  streamt die UI-Message-Stream-Chunks als Starlette-SSE-Response zurück. Vollständig async.
- **Sanitization per Default** (Adapter ist keine Auth-Grenze): Client-System-Prompts
  gestrippt, hängende Tool-Calls verworfen, nur http/https-Datei-URLs, Uploads nur
  mit `allow_uploaded_files=True`.
- **Persistenz-Hook:** `on_complete`-Callback erhält das fertige `AgentRunResult` —
  der sanktionierte Ort, falls wir Konversationen später speichern wollen.
- **HITL:** Tool mit `requires_approval=True` + `sdk_version=6` → `tool-approval-request`
  streamt zum Client, Entscheidung kommt im Folge-Request zurück (`ToolApproved`/`ToolDenied`).
- Feinere Kontrolle statt `dispatch_request`: `build_run_input()` → `adapter.run_stream()` →
  `encode_stream()` → eigene `StreamingResponse` (Media-Type-Konstante `SSE_CONTENT_TYPE`).

### OpenAI-Spezifika

- Env-Var `OPENAI_API_KEY` (über unsere pydantic-settings `.env` verdrahten) oder
  explizit `OpenAIProvider(api_key=...)`.
- Der bare Prefix **`openai:<model>` nutzt die moderne Responses API**
  (`OpenAIResponsesModel`) — empfohlener Default. Für die Legacy Chat Completions API
  bzw. OpenAI-kompatible Dritt-Endpoints (`OpenAIProvider(base_url=...)`) gibt es den
  Prefix `openai-chat:`.
- Modell-IDs in der aktuellen Doku: `gpt-5.2` (Flaggschiff, in allen UI-Adapter-Beispielen)
  und `gpt-5-mini` (kosteneffizient — sinnvoller Default für einen Website-Assistenten).
- **Reasoning ist Opt-in:** erst mit `OpenAIResponsesModelSettings(openai_reasoning_effort=...,
  openai_reasoning_summary=...)` streamen Reasoning-Summaries als `reasoning-*`-Chunks
  (assistant-ui rendert sie); ohne diese Settings kommen schlicht keine Reasoning-Chunks.

---

## 4. Integration in dieses Repo

| Schritt | Wo | Was |
|---|---|---|
| Backend-Dependency | `backend/pyproject.toml` | `uv add "pydantic-ai-slim[openai,ui]"` |
| Agent-Definition | z. B. `backend/app/agent/` | `Agent('openai:gpt-5-mini', instructions=...)`; Instructions aus dem Profil-Content speisen |
| Chat-Route | `backend/app/api/routes.py` | `POST /api/chat` → `VercelAIAdapter.dispatch_request(request, agent=agent)` |
| Config | `backend/app/core/config.py` | `openai_api_key` in `Settings` aufnehmen (`.env`) |
| Frontend-Dependencies | `frontend/` | `pnpm add @assistant-ui/react @assistant-ui/react-ai-sdk @assistant-ui/react-markdown ai @ai-sdk/react` |
| UI-Komponenten | `frontend/src/components/assistant-ui/` | via shadcn-Registry (`thread.json`, `markdown-text.json`), dann an Zinc-Theme anpassen |
| Einstiegspunkt | `frontend/src/app/[locale]/…` | Chat-Seite oder Dialog/Sheet; UI-Copy zweisprachig über next-intl |
| API-URL | bereits vorhanden | `NEXT_PUBLIC_API_URL` wird von `make dev` gesetzt (3210 → 8210) |
| CORS | bereits vorhanden | `CORSMiddleware` mit `CORS_ORIGINS` reicht — Streaming läuft über `fetch`, nicht `EventSource`; nur `POST` + `content-type` nötig |
| Locale → Agent | Transport-`body` | z. B. `body: { locale }` mitschicken; Backend liest es aus dem Request und gibt es dem Agent als Dependency/Instruction-Kontext |

---

## 5. Alternativen & Absagen

| Option | Bewertung |
|---|---|
| **`useDataStreamRuntime`** (`@assistant-ui/react-data-stream`) | Zweite Wahl. Konsumiert dasselbe Protokoll (Auto-Detection per Header), weniger Abhängigkeiten — aber **kein Human-in-the-Loop** und weniger Features als `useChatRuntime`. Fallback, falls die AI-SDK-Paketlinie stört. |
| **AG-UI** (`AGUIAdapter` ↔ `@assistant-ui/react-ag-ui`) | Funktioniert offiziell auf beiden Seiten, bringt bidirektionalen Shared State (`StateDeps`). Aber: assistant-ui-Seite ist noch **0.0.x**, und Shared State brauchen wir nicht. Interessant, falls später CopilotKit-artige Features gewünscht sind. |
| **AssistantTransport + PyPI `assistant-stream`** | Offizieller assistant-ui-Weg für Python-Backends mit reichem internem State. Für uns strikt schlechter: Man müsste Pydantic-AI-Events **von Hand** in State-Ops übersetzen — Pydantic AI liefert den Vercel-Adapter ja bereits fertig. Zudem kündigt die Doku eine Wire-Format-Migration an (Churn-Risiko). |
| **LocalRuntime + eigener `ChatModelAdapter`** | Maximal flexibel, aber wir müssten Request/Stream-Handling selbst schreiben — genau das „Hack“-Muster, das vermieden werden soll. |
| **Eigener SSE-Emitter im Backend** | Ausgeschlossen per Anforderung; mit `VercelAIAdapter` auch schlicht unnötig. |

---

## 6. Gotchas

1. **Versions-Pairing v5/v6** (siehe §1): `@assistant-ui/react-ai-sdk@1.x` erwartet v6-Semantik —
   im Backend konsequent `sdk_version=6` setzen, sonst fehlen u. a. Tool-Approval-Chunks.
   Ein Integrationstest über die Chunk-Typen ist ratsam.
2. **React 19 / Next 16:** Ein StrictMode-Crash unter Next 16 + Turbopack
   ([assistant-ui#2925](https://github.com/assistant-ui/assistant-ui/issues/2925)) ist in
   `@assistant-ui/react` ≥0.14.x gefixt — aktuelle Version pinnen.
3. **Proxy-Buffering:** SSE erscheint „auf einen Schlag“, wenn ein Reverse-Proxy puffert —
   in Produktion Buffering für die Chat-Route deaktivieren (z. B. nginx `X-Accel-Buffering: no`).
   Lokal (uvicorn direkt) kein Thema.
4. **Alte Doku/Beispiele:** Vor-0.14-assistant-ui-APIs (`makeAssistantToolUI`-Ära) und
   Pydantic-AI-v1-Muster (`Agent.to_ag_ui()` / `AGUIApp`-Mount — **in v2 entfernt**) kursieren
   noch in Blogposts. Maßgeblich ist `dispatch_request` in einer eigenen Route.
5. **Docs-Domain:** `ai.pydantic.dev` leitet inzwischen auf `pydantic.dev/docs/ai/` um.
6. **Abbruch:** Composer-Cancel schickt ein AbortSignal; Starlette/Pydantic AI sieht den
   Disconnect serverseitig — kein Extra-Code nötig, aber beim Testen daran denken.

---

## Quellen

- assistant-ui: [Docs-Übersicht](https://www.assistant-ui.com/docs) · [Pick a Runtime](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime) · [AI SDK v6 Runtime](https://www.assistant-ui.com/docs/runtimes/ai-sdk/v6) · [Data Stream](https://www.assistant-ui.com/docs/runtimes/custom/data-stream) · [AssistantTransport](https://www.assistant-ui.com/docs/runtimes/custom/assistant-transport) · [Thread-UI](https://www.assistant-ui.com/docs/ui/thread.md) · [Markdown](https://www.assistant-ui.com/docs/ui/markdown.md) · [`AssistantChatTransport`-Quelle](https://github.com/assistant-ui/assistant-ui/blob/main/packages/react-ai-sdk/src/ui/use-chat/AssistantChatTransport.ts)
- Pydantic AI: [Install](https://pydantic.dev/docs/ai/overview/install/) · [Agents](https://pydantic.dev/docs/ai/core-concepts/agent/) · [Message History](https://pydantic.dev/docs/ai/core-concepts/message-history/) · [UI-Adapter-Übersicht](https://pydantic.dev/docs/ai/integrations/ui/overview/) · [Vercel-AI-Adapter](https://pydantic.dev/docs/ai/integrations/ui/vercel-ai/) · [AG-UI-Adapter](https://pydantic.dev/docs/ai/integrations/ui/ag-ui/) · [API-Ref `ui.vercel_ai`](https://pydantic.dev/docs/ai/api/ui/vercel_ai/) · [OpenAI-Modelle](https://pydantic.dev/docs/ai/models/openai/) · [Announcement Vercel-AI-Support](https://pydantic.dev/articles/pydantic-ai-ui-vercel-ai)
- Versionen: npm-Registry & [PyPI pydantic-ai](https://pypi.org/project/pydantic-ai/) / [assistant-stream](https://pypi.org/project/assistant-stream/), Stand 2026-07-09.
