import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
        <p className="mb-6 text-xs uppercase tracking-[0.24em] text-neutral-400">
          MARS MX — PORTFOLIO
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Designing and building digital products with clear structure and
          modern taste.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
          A minimal landing foundation built with Next.js, React, Tailwind CSS
          v4, and shadcn/ui. More sections and project content will follow in
          upcoming issues.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button className="rounded-full px-6">View work</Button>
          <Button variant="outline" className="rounded-full px-6">
            Contact
          </Button>
        </div>
      </section>
    </main>
  );
}
