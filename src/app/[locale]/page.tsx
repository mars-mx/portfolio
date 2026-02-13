import {getTranslations, setRequestLocale} from "next-intl/server";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Hero");

  return (
    <main className="mx-auto flex min-h-[calc(100vh-133px)] w-full max-w-4xl items-center justify-center px-6 py-20 sm:px-10">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900/60 p-10 text-center shadow-2xl shadow-black/20 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">{t("label")}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          {t("name")}
        </h1>
        <p className="mt-4 text-lg text-neutral-200 sm:text-2xl">{t("role")}</p>
      </section>
    </main>
  );
}
