"use client"

import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/lib/site"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ChatNavLink } from "@/components/chat-nav-link"
import { ContactMenuItems } from "@/components/contact-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Hamburger-Menü unterhalb von sm — bündelt Navigation, Kontakt und
// Social-Links, die in der Leiste sonst keinen Platz haben.
export function MobileNav() {
  const t = useTranslations("nav")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("menu")}
          className="sm:hidden"
        >
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem asChild>
          <Link href="/">{t("home")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/ueber-mich">{t("profil")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ChatNavLink>{t("chat")}</ChatNavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ContactMenuItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={siteConfig.social.github} target="_blank" rel="noreferrer">
            <GitHubIcon />
            GitHub
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon />
            LinkedIn
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
