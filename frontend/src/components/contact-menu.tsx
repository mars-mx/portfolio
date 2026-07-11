"use client"

import { ChevronDown, Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"
import { WhatsAppIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Props = {
  label: string
  size?: React.ComponentProps<typeof Button>["size"]
  variant?: React.ComponentProps<typeof Button>["variant"]
  className?: string
}

// Die beiden Kontakt-Einträge (WhatsApp, E-Mail) — auch im mobilen
// Hamburger-Menü (mobile-nav.tsx) eingebunden.
export function ContactMenuItems() {
  const t = useTranslations("contactMenu")

  // mailto: läuft ohne verknüpftes Mail-Programm (oder im eingebetteten
  // Browser) ins Leere — deshalb zusätzlich kopieren und bestätigen.
  async function handleEmailClick() {
    try {
      await navigator.clipboard.writeText(siteConfig.email)
      toast.success(t("emailCopied"), { description: siteConfig.email })
    } catch {
      toast(siteConfig.email)
    }
  }

  return (
    <>
      <DropdownMenuItem asChild className="cursor-pointer active:translate-y-px">
        <a
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />
          {t("whatsapp")}
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer active:translate-y-px">
        <a href={`mailto:${siteConfig.email}`} onClick={handleEmailClick}>
          <Mail />
          {t("email")}
        </a>
      </DropdownMenuItem>
    </>
  )
}

export function ContactMenu({ label, size, variant, className }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn("cursor-pointer active:translate-y-px", className)}
        >
          {label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="bg-popover/80 backdrop-blur-md supports-[backdrop-filter]:bg-popover/60"
      >
        <ContactMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
