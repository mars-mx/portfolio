"use client"

import { makeAssistantToolUI } from "@assistant-ui/react"
import { ChevronDownIcon, LoaderIcon, SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type SearchKnowledgeArgs = {
  query: string
}

type KnowledgeChunk = {
  document: string
  heading: string
  text: string
  score: number
}

// Contract mit dem Backend-Tool `search_knowledge` (backend/app/agent/assistant.py).
type SearchKnowledgeResult = KnowledgeChunk[]

function isKnowledgeChunks(result: unknown): result is KnowledgeChunk[] {
  return (
    Array.isArray(result) &&
    result.every(
      (r) => typeof r === "object" && r !== null && "document" in r && "text" in r,
    )
  )
}

/**
 * Eigene Tool-UI für die Wissensbasis-Suche: zeigt die durchsuchte Query und
 * die Quell-Dokumente an, statt des generischen Tool-Fallbacks.
 */
export const KnowledgeSearchToolUI = makeAssistantToolUI<
  SearchKnowledgeArgs,
  SearchKnowledgeResult
>({
  toolName: "search_knowledge",
  render: function KnowledgeSearchToolRender({ args, result, status }) {
    const t = useTranslations("chat")

    if (status.type === "running" || result === undefined) {
      return (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderIcon className="size-3.5 animate-spin" />
          <span>
            {t("searchRunning")}
            {args.query ? <> „{args.query}“</> : null}
          </span>
        </div>
      )
    }

    if (!isKnowledgeChunks(result)) {
      return (
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <SearchIcon className="size-3.5" />
          <span>{t("searchFailed")}</span>
        </div>
      )
    }

    const documents = [...new Set(result.map((chunk) => chunk.document))]

    return (
      <Collapsible className="group/knowledge-search mb-2">
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs",
            "text-muted-foreground transition-colors hover:bg-muted/50",
          )}
        >
          <SearchIcon className="size-3.5 shrink-0" />
          <span className="shrink-0">{t("searchTitle")}</span>
          <span className="flex min-w-0 flex-1 flex-wrap gap-1">
            {documents.map((doc) => (
              <span
                key={doc}
                className="rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]"
              >
                {doc}
              </span>
            ))}
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=open]/knowledge-search:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1 space-y-3 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("searchQuery")}: „{args.query}“
            </p>
            {result.map((chunk, i) => (
              <div key={i} className="space-y-1">
                <p className="flex items-baseline gap-2 text-xs font-medium">
                  <span className="font-mono">{chunk.document}</span>
                  <span className="text-muted-foreground">{chunk.heading}</span>
                  <span className="ml-auto tabular-nums text-[10px] text-muted-foreground">
                    {chunk.score.toFixed(2)}
                  </span>
                </p>
                <p className="line-clamp-3 text-xs text-muted-foreground">
                  {chunk.text}
                </p>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  },
})
