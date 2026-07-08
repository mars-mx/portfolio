import type { Metadata } from "next"

import { PageShell } from "@/components/page-shell"

export const metadata: Metadata = { title: "Datenschutz" }

export default function DatenschutzPage() {
  return (
    <PageShell title="Datenschutzerklärung">
      <p className="font-mono text-sm">
        TODO: Datenschutzerklärung aus der bestehenden Seite übernehmen.
      </p>
    </PageShell>
  )
}
