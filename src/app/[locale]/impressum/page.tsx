import {getTranslations, setRequestLocale} from "next-intl/server";

type LegalNoticePageProps = {
  params: Promise<{locale: string}>;
};

export default async function LegalNoticePage({params}: LegalNoticePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Imprint");

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>

      <p className="mt-8 text-sm text-neutral-400">{t("legalBasis")}</p>

      <div className="mt-4 space-y-1 text-neutral-200">
        <p>Marius Schäffer</p>
        <p>MX Digital</p>
        <p>Virchowstraße 3</p>
        <p>04157 Leipzig</p>
        <p>{t("country")}</p>
      </div>

      <h2 className="mt-10 text-xl font-medium">{t("contactHeading")}</h2>
      <div className="mt-3 space-y-1 text-neutral-200">
        <p>E-Mail: marius@mxdigital.de</p>
      </div>

      <h2 className="mt-10 text-xl font-medium">{t("responsibleHeading")}</h2>
      <div className="mt-3 space-y-1 text-neutral-200">
        <p>Marius Schäffer</p>
        <p>Virchowstraße 3</p>
        <p>04157 Leipzig</p>
      </div>

      <p className="mt-10 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        {t("todoNotice")}
      </p>
    </section>
  );
}
