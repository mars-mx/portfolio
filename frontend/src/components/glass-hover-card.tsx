"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

/**
 * Hover-Panel mit echtem Liquid-Glass-Blur.
 *
 * Bewusst KEIN Radix-Popover: das positioniert seinen Content über einen
 * Eltern-Container mit `transform`, und in transformierten Vorfahren wenden
 * Browser `backdrop-filter` nicht an → kein Blur. Hier portalen wir das Panel
 * direkt an <body> und positionieren per top/left, damit der Blur greift.
 */
export function GlassHoverCard({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(
    null
  )
  const [mounted, setMounted] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => setMounted(true), [])

  function show() {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const width = 288 // w-72
    const left = Math.min(r.left, window.innerWidth - width - 16)
    setCoords({ top: r.bottom + 8, left: Math.max(16, left) })
    setOpen(true)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        className="w-fit cursor-help text-left text-sm text-muted-foreground underline decoration-dotted decoration-muted-foreground/40 underline-offset-4"
      >
        {trigger}
      </button>

      {mounted && open && coords
        ? createPortal(
            <div
              role="tooltip"
              style={{ position: "fixed", top: coords.top, left: coords.left }}
              className={cn(
                "liquid-glass z-50 w-72 rounded-lg border border-white/20 bg-popover/20 p-3.5 text-sm text-popover-foreground shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_-1px_0_0_rgba(255,255,255,0.08)]",
                className
              )}
            >
              {children}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
