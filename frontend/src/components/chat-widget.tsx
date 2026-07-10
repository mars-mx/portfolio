"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { MessageCircleIcon, Maximize2Icon, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Erst beim ersten Öffnen laden — assistant-ui hängt sonst im Bundle jeder Seite.
const Assistant = dynamic(
  () => import("@/components/assistant").then((m) => m.Assistant),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground animate-pulse">●</span>
      </div>
    ),
  },
)

export function ChatWidget() {
  const t = useTranslations("chat")
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  // Nach dem ersten Öffnen bleibt der Assistant gemountet (nur per CSS
  // versteckt), damit der Gesprächsverlauf das Schließen überlebt.
  const [mounted, setMounted] = useState(false)

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
            "border-border bg-background fixed right-4 bottom-4 z-50 flex h-[min(42rem,calc(100dvh-5rem))] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border shadow-lg print:hidden",
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
                className="text-muted-foreground hover:text-foreground size-8"
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
            <Assistant variant="widget" />
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
