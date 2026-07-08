import Link from "next/link"

import { siteConfig } from "@/lib/site"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            MX
          </span>
          <span className="hidden sm:inline">{siteConfig.brand}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {siteConfig.nav.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <Button variant="ghost" size="icon" asChild aria-label="GitHub">
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild aria-label="LinkedIn">
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
