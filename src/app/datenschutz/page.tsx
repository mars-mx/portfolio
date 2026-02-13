import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | MX Digital",
  description: "Datenschutzhinweise von MX Digital",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Datenschutzerklärung</h1>

      <div className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
        <p className="font-medium">Platzhalter</p>
        <p className="mt-2 text-sm leading-6">
          Diese Datenschutzerklärung ist aktuell ein bewusst gekennzeichneter Platzhalter und wird in einem
          nachfolgenden Schritt vollständig ausgearbeitet.
        </p>
      </div>
    </section>
  );
}
