"use client"

import type { ComponentProps } from "react"

import { Link } from "@/i18n/navigation"
import { CHAT_OPEN_EVENT } from "@/components/chat-widget"

// "Chat" in der Navigation: mobil öffnet er das Vollbild-Widget statt auf
// /chat zu navigieren — Breakpoint (sm = 40rem) wie das Widget-Layout in
// chat-widget.tsx. Ab sm bleibt es die normale Navigation zur Chat-Seite.
export function ChatNavLink(props: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      {...props}
      href="/chat"
      onClick={(e) => {
        if (window.matchMedia("(min-width: 40rem)").matches) return
        e.preventDefault()
        window.dispatchEvent(new Event(CHAT_OPEN_EVENT))
      }}
    />
  )
}
