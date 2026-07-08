import type { Metadata } from "next"

import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = { title: "Impressum" }

export default function ImpressumPage() {
  return (
    <PageShell title="Impressum">
      <p className="text-foreground">
        Marius Schäffer
        <br />
        MX Digital
        <br />
        Hollerallee 87
        <br />
        28209 Bremen
        <br />
        Deutschland
      </p>
      <p>
        Tel.: 015251600215
        <br />
        E-Mail:{" "}
        <a
          href="mailto:marius@mxdigital.de"
          className="underline underline-offset-2 hover:text-foreground"
        >
          marius@mxdigital.de
        </a>
      </p>
      <p>Umsatzsteuer-Identifikationsnummer: DE369297586</p>
      <p>
        Verantwortliche/r i.S.d. § 18 Abs. 2 MStV:
        <br />
        Marius Schäffer, Hollerallee 87, 28209 Bremen
      </p>
    </PageShell>
  )
}
