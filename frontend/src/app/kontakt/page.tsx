import type { Metadata } from "next"

import { PageShell } from "@/components/page-shell"
import { ContactForm } from "@/components/contact-form"
import { BorderBeam } from "@/components/ui/border-beam"

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Schreib mir — Projekt, Idee oder Frage. Ich melde mich.",
}

export default function KontaktPage() {
  return (
    <PageShell title="Kontakt">
      <p>Eine Idee, ein Projekt oder eine Frage? Schreib mir — ich melde mich.</p>
      <div className="relative mt-2 overflow-hidden rounded-xl border border-border/60 bg-card p-6">
        <ContactForm />
        <BorderBeam
          size={120}
          duration={10}
          colorFrom="#a1a1aa"
          colorTo="#fafafa"
          className="opacity-70"
        />
      </div>
    </PageShell>
  )
}
