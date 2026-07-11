"use client"

import { MessageCircleIcon } from "lucide-react"

import { CHAT_OPEN_EVENT } from "@/components/chat-widget"
import { Button } from "@/components/ui/button"

export function ChatCta({ label }: { label: string }) {
  return (
    <Button
      size="lg"
      className="cursor-pointer active:translate-y-px"
      onClick={() => window.dispatchEvent(new Event(CHAT_OPEN_EVENT))}
    >
      <MessageCircleIcon className="size-4" />
      {label}
    </Button>
  )
}
