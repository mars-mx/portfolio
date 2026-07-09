import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/lib/site"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ContactMenu } from "@/components/contact-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"

const navItems = [
  { key: "home", href: "/" },
  { key: "profil", href: "/ueber-mich" },
] as const

export function SiteHeader() {
  const t = useTranslations("nav")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-semibold">
          {siteConfig.name}
          <span className="hidden text-muted-foreground sm:inline">
            {" "}
            · {siteConfig.brand}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className={item.href === "/" ? "hidden sm:inline-flex" : undefined}
            >
              <Link href={item.href}>{t(item.key)}</Link>
            </Button>
          ))}
          <ContactMenu size="sm" variant="ghost" label={t("kontakt")} />
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="GitHub"
            className="hidden sm:inline-flex"
          >
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="LinkedIn"
            className="hidden sm:inline-flex"
          >
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon className="size-4" />
            </a>
          </Button>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
