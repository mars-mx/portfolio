"use client"

import { useEffect, useState } from "react"
import { MessageCircleIcon, Maximize2Icon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { AssistantClient } from "@/components/assistant-client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Öffnet das Widget von außen (mobiler "Chat"-Nav-Link in chat-nav-link.tsx).
export const CHAT_OPEN_EVENT = "mx-chat:open"

export function ChatWidget() {
  const t = useTranslations("chat")
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  // Nach dem ersten Öffnen bleibt der Assistant gemountet (nur per CSS
  // versteckt), damit der Gesprächsverlauf das Schließen überlebt.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const openChat = () => {
      setOpen(true)
      setMounted(true)
    }
    window.addEventListener(CHAT_OPEN_EVENT, openChat)
    return () => window.removeEventListener(CHAT_OPEN_EVENT, openChat)
  }, [])

  // Auf /chat läuft der Chat schon als Seite, dort braucht es kein Widget.
  if (pathname === "/chat") return null

  return (
    <>
      {mounted && (
        <div
          role="dialog"
          aria-label={t("widgetTitle")}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className={cn(
            // Mobil Vollbild, ab sm das schwebende Panel unten rechts.
            "bg-background fixed inset-0 z-50 flex flex-col overflow-hidden print:hidden",
            "sm:border-border sm:inset-auto sm:right-4 sm:bottom-4 sm:h-[min(42rem,calc(100dvh-5rem))] sm:w-[calc(100vw-2rem)] sm:max-w-md sm:rounded-2xl sm:border sm:shadow-lg",
            open ? "fade-in slide-in-from-bottom-2 animate-in duration-200" : "hidden",
          )}
        >
          <div className="border-border/60 flex items-center justify-between border-b py-1.5 ps-3.5 pe-1.5">
            <span className="text-sm font-medium">{t("widgetTitle")}</span>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                asChild
                aria-label={t("widgetExpand")}
                // Mobil ist das Widget schon Vollbild — Expand wäre redundant.
                className="text-muted-foreground hover:text-foreground hidden size-8 sm:inline-flex"
              >
                <Link href="/chat">
                  <Maximize2Icon className="size-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label={t("widgetClose")}
                className="text-muted-foreground hover:text-foreground size-8"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <AssistantClient variant="widget" />
          </div>
        </div>
      )}

      <Button
        size="icon"
        aria-label={t("widgetOpen")}
        onClick={() => {
          setOpen(true)
          setMounted(true)
        }}
        className={cn(
          "animate-breathe motion-reduce:animate-none fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg print:hidden",
          open && "hidden",
        )}
      >
        <MessageCircleIcon className="size-5" />
      </Button>
    </>
  )
}
