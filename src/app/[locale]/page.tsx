import {getTranslations, setRequestLocale} from "next-intl/server";
import {Button} from "@/components/ui/button";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <section className="mx-auto flex min-h-[calc(100vh-133px)] w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
      <p className="mb-6 text-xs uppercase tracking-[0.24em] text-neutral-400">
        MARS MX — PORTFOLIO
      </p>

      <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        {t("headline")}
      </h1>

      <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
        {t("description")}
      </p>

      <div className="mt-12 flex flex-wrap gap-4">
        <Button className="rounded-full px-6">{t("viewWork")}</Button>
        <Button variant="outline" className="rounded-full px-6">
          {t("contact")}
        </Button>
      </div>
    </section>
  );
}
