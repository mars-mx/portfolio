"use client"

import { AssistantRuntimeProvider } from "@assistant-ui/react"
import {
  AssistantChatTransport,
  useChatRuntime,
} from "@assistant-ui/react-ai-sdk"

import { KnowledgeSearchToolUI } from "@/components/assistant-ui/knowledge-search-tool"
import { Thread } from "@/components/assistant-ui/thread"

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8210"

export function Assistant() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${apiUrl}/api/chat`,
    }),
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <KnowledgeSearchToolUI />
      <Thread />
    </AssistantRuntimeProvider>
  )
}
