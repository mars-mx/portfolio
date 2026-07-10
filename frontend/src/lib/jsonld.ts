import { getPathname } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { profileContent, techStack } from "@/lib/profile"
import { siteConfig, siteText } from "@/lib/site"

// Stabile Entitäts-IDs — auf allen Seiten identisch, damit sich die
// Graphen von Layout und Unterseiten aufeinander beziehen können.
const PERSON_ID = `${siteConfig.url}/#person`
const WEBSITE_ID = `${siteConfig.url}/#website`

// "<" escapen, damit aus den Daten nie ein "</script>" im Markup entstehen kann.
export function jsonLdScript(graph: object): string {
  return JSON.stringify(graph).replace(/</g, "\\u003c")
}

/** WebSite + Person — seitenweit, gerendert im Locale-Layout. */
export function siteJsonLd(locale: Locale) {
  const { tagline, description } = siteText[locale]
  const { services, ausbildung } = profileContent[locale]

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteConfig.url,
        name: siteConfig.name,
        alternateName: siteConfig.brand,
        description,
        inLanguage: locale,
        publisher: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: siteConfig.name,
        url: siteConfig.url,
        image: `${siteConfig.url}/marius_schaeffer.jpg`,
        jobTitle: tagline,
        description,
        email: siteConfig.email,
        // Bewusst kein `telephone`: site.ts und Impressum nennen
        // unterschiedliche Nummern — erst klären, dann ergänzen.
        sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
        worksFor: [
          { "@type": "Organization", name: siteConfig.brand, url: siteConfig.url },
          { "@type": "Organization", name: "SX Solutions GbR" },
        ],
        alumniOf: ausbildung.flatMap((item) =>
          item.org ? [{ "@type": "EducationalOrganization", name: item.org }] : []
        ),
        knowsAbout: [...services.map((s) => s.title), ...techStack],
      },
    ],
  }
}

/** ProfilePage + BreadcrumbList für /ueber-mich und /profil. */
export function profilePageJsonLd({
  locale,
  href,
  pageName,
  homeLabel,
}: {
  locale: Locale
  href: "/ueber-mich" | "/profil"
  pageName: string
  homeLabel: string
}) {
  const homePath = getPathname({ locale, href: "/" })
  const homeUrl = homePath === "/" ? siteConfig.url : `${siteConfig.url}${homePath}`
  const pageUrl = `${siteConfig.url}${getPathname({ locale, href })}`
  const breadcrumbId = `${pageUrl}/#breadcrumb`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeLabel, item: homeUrl },
          { "@type": "ListItem", position: 2, name: pageName, item: pageUrl },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}/#profilepage`,
        url: pageUrl,
        name: `${pageName} · ${siteConfig.name}`,
        inLanguage: locale,
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: { "@id": PERSON_ID },
      },
    ],
  }
}
