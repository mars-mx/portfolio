import Link from "next/link"

import { siteConfig } from "@/lib/site"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono font-semibold">{siteConfig.name}</span>
          <span className="text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.brand}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground">
            Datenschutz
          </Link>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
            aria-label="GitHub"
          >
            <GitHubIcon className="size-4" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
            aria-label="LinkedIn"
          >
            <LinkedInIcon className="size-4" />
          </a>
        </nav>
      </div>
    </footer>
  )
}
