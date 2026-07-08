import type { Metadata } from "next"

import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = { title: "Impressum" }

export default function ImpressumPage() {
  return (
    <PageShell title="Impressum">
      <p className="font-mono text-sm">
        TODO: Impressum nach § 5 TMG aus der bestehenden Seite übernehmen.
      </p>
    </PageShell>
  )
}
