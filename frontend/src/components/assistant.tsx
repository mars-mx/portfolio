"use client"

import { useState } from "react"
import { AssistantRuntimeProvider } from "@assistant-ui/react"
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk"
import type { UIMessage } from "ai"
import { useTranslations } from "next-intl"

import { BookingToolUI } from "@/components/assistant-ui/booking-tool"
import { KnowledgeSearchToolUI } from "@/components/assistant-ui/knowledge-search-tool"
import { ProfileDownloadToolUI } from "@/components/assistant-ui/profile-download-tool"
import { Thread } from "@/components/assistant-ui/thread"
import { ChatConsent, hasChatConsent } from "@/components/chat-consent"
import { ChatGate } from "@/components/chat-gate"
import { clearChatSession, getChatSessionToken } from "@/lib/chat-session"

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8210"
// Ist der Site Key gesetzt, verlangt der Chat eine Turnstile-Challenge —
// das Backend prüft dann jede /api/chat-Anfrage (TURNSTILE_SECRET_KEY).
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

// Widget und /chat mounten jeweils eine eigene Assistant-Instanz mit eigenem
// Chat-State. Der Verlauf wird deshalb in sessionStorage gespiegelt, damit er
// den Wechsel zwischen beiden (Expand-Button im Widget) überlebt. Der Restore
// passiert beim Mount, deshalb darf der Assistant nur clientseitig rendern
// (ssr: false via assistant-client.tsx) — sonst Hydration-Mismatch.
const MESSAGES_KEY = "mx-chat-messages"

function loadMessages(): UIMessage[] {
  try {
    const raw = sessionStorage.getItem(MESSAGES_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : []
  } catch {
    // sessionStorage blockiert oder Inhalt korrupt — leer starten.
    return []
  }
}

// "/clear" im Eingabefeld setzt die Unterhaltung zurück (kein UI-Button —
// bewusst unaufdringlich). Wird im Transport abgefangen, bevor es ans
// Backend geht.
const CLEAR_COMMAND = "/clear"

function lastUserText(messages: UIMessage[]): string {
  const last = messages.findLast((m) => m.role === "user")
  if (!last) return ""
  return last.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim()
}

export function Assistant({
  variant = "page",
}: {
  variant?: "page" | "widget"
}) {
  // Reset per "/clear": Verlauf löschen und die Chat-Instanz per key neu
  // mounten — useChat übernimmt initiale messages nur bei der Erzeugung,
  // nachträglich leeren lässt sich die Instanz nicht.
  const [chatKey, setChatKey] = useState(0)

  return (
    <AssistantChat
      key={chatKey}
      variant={variant}
      onReset={() => {
        try {
          sessionStorage.removeItem(MESSAGES_KEY)
        } catch {
          // Remount setzt den sichtbaren Chat trotzdem zurück.
        }
        setChatKey((k) => k + 1)
      }}
    />
  )
}

function AssistantChat({
  variant,
  onReset,
}: {
  variant: "page" | "widget"
  onReset: () => void
}) {
  const t = useTranslations("chat")
  // sessionStorage ist beim ersten Render verfügbar, weil der Assistant nur
  // clientseitig rendert (ssr: false via assistant-client.tsx).
  const [gate, setGate] = useState<"locked" | "open">(() =>
    !turnstileSiteKey || getChatSessionToken() ? "open" : "locked",
  )
  // Datenschutz-Zustimmung kommt vor allem anderen — solange sie fehlt,
  // mountet auch das Turnstile-Gate nicht (keine Cloudflare-Challenge ohne
  // Zustimmung).
  const [consented, setConsented] = useState(hasChatConsent)

  const [initialMessages] = useState(loadMessages)
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${apiUrl}/api/chat`,
      headers: (): Record<string, string> => {
        const token = getChatSessionToken()
        return token ? { "X-Chat-Session": token } : {}
      },
      // 401 = Session abgelaufen/ungültig → Gate wieder zeigen; der Verlauf
      // bleibt erhalten, weil nur das Overlay eingeblendet wird.
      fetch: async (input, init) => {
        const { messages } = JSON.parse(String(init?.body)) as {
          messages: UIMessage[]
        }
        if (lastUserText(messages) === CLEAR_COMMAND) {
          onReset()
          // Leerer, sofort terminierter Stream statt Backend-Antwort — die
          // alte Chat-Instanz ist durch den Remount ohnehin verworfen.
          return new Response("data: [DONE]\n\n", {
            headers: { "content-type": "text/event-stream" },
          })
        }
        const response = await fetch(input, init)
        if (response.status === 401) {
          clearChatSession()
          setGate("locked")
        }
        // 429 (Rate-Limit des Reverse Proxy) liefert einen HTML-Body — den
        // würde die AI SDK sonst wörtlich als Fehlertext in den Thread
        // stellen. Stattdessen mit verständlicher Meldung fehlschlagen;
        // MessageError in thread.tsx zeigt sie unter der Nachricht an.
        if (response.status === 429) {
          throw new Error(t("errorRateLimit"))
        }
        return response
      },
    }),
    messages: initialMessages,
    onFinish: ({ messages }) => {
      // Endet der Austausch mit "/clear", nichts speichern — sonst landet
      // der gerade gelöschte Verlauf sofort wieder in sessionStorage.
      if (lastUserText(messages) === CLEAR_COMMAND) return
      try {
        sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
      } catch {
        // Speichern darf den Chat nie brechen.
      }
    },
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <KnowledgeSearchToolUI />
      <ProfileDownloadToolUI />
      <BookingToolUI />
      <div className="relative flex h-full min-h-0 flex-1 flex-col">
        <Thread variant={variant} />
        {!consented ? (
          <ChatConsent onAccepted={() => setConsented(true)} />
        ) : (
          gate === "locked" &&
          turnstileSiteKey && (
            <ChatGate
              siteKey={turnstileSiteKey}
              onVerified={() => setGate("open")}
            />
          )
        )}
      </div>
    </AssistantRuntimeProvider>
  )
}
