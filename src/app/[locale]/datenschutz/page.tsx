import {getTranslations, setRequestLocale} from "next-intl/server";

type PrivacyPolicyPageProps = {
  params: Promise<{locale: string}>;
};

export default async function PrivacyPolicyPage({params}: PrivacyPolicyPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>

      <div className="mt-8 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
        <p className="font-medium">{t("placeholderTitle")}</p>
        <p className="mt-2 text-sm leading-6">{t("placeholderText")}</p>
      </div>
    </section>
  );
}
