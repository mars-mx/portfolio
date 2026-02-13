import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum | MX Digital",
  description: "Impressum von MX Digital",
};

export default function LegalNoticePage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Impressum</h1>

      <p className="mt-8 text-sm text-neutral-400">Angaben gemäß § 5 DDG</p>

      <div className="mt-4 space-y-1 text-neutral-200">
        <p>Marius Schäffer</p>
        <p>MX Digital</p>
        <p>Hollerallee 87</p>
        <p>28209 Bremen</p>
        <p>Deutschland</p>
      </div>

      <h2 className="mt-10 text-xl font-medium">Kontakt</h2>
      <div className="mt-3 space-y-1 text-neutral-200">
        <p>E-Mail: marius@mxdigital.de</p>
      </div>

      <h2 className="mt-10 text-xl font-medium">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <div className="mt-3 space-y-1 text-neutral-200">
        <p>Marius Schäffer</p>
        <p>Hollerallee 87</p>
        <p>28209 Bremen</p>
      </div>

      <p className="mt-10 text-sm leading-6 text-neutral-400">
        Hinweis: Die Pflichtangaben wurden entsprechend der gesetzlichen Mindestanforderungen für geschäftsmäßige
        Telemedien (insb. § 5 DDG und § 18 MStV) zusammengestellt.
      </p>
    </section>
  );
}
