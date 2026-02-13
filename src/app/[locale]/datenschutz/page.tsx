import {getTranslations, setRequestLocale} from "next-intl/server";

type PrivacyPolicyPageProps = {
  params: Promise<{locale: string}>;
};

export default async function PrivacyPolicyPage({params}: PrivacyPolicyPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Privacy");

  const logItems = [
    t("logfiles.items.ip"),
    t("logfiles.items.datetime"),
    t("logfiles.items.request"),
    t("logfiles.items.referrer"),
    t("logfiles.items.userAgent"),
    t("logfiles.items.status"),
  ];

  const rightsItems = [
    t("rights.items.access"),
    t("rights.items.rectification"),
    t("rights.items.erasure"),
    t("rights.items.restriction"),
    t("rights.items.portability"),
    t("rights.items.objection"),
    t("rights.items.withdrawal"),
    t("rights.items.complaint"),
  ];

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>

      <div className="mt-8 space-y-8 text-neutral-200">
        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("intro.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("intro.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("controller.heading")}</h2>
          <div className="space-y-1 text-sm text-neutral-300">
            <p>Marius Schäffer</p>
            <p>MX Digital</p>
            <p>Virchowstraße 3, 04157 Leipzig</p>
            <p>{t("controller.phone")}</p>
            <p>{t("controller.email")}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("logfiles.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("logfiles.body")}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            {logItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-sm leading-6 text-neutral-300">{t("logfiles.encryption")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("cookies.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("cookies.body")}</p>
          <p className="text-sm leading-6 text-neutral-300">{t("cookies.legalBasis")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("contact.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("contact.body")}</p>
          <p className="text-sm leading-6 text-neutral-300">{t("contact.legalBasis")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("tools.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("tools.body")}</p>
          <p className="text-sm leading-6 text-amber-200">{t("tools.todo")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("rights.heading")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">
            {rightsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-medium">{t("retention.heading")}</h2>
          <p className="text-sm leading-6 text-neutral-300">{t("retention.body")}</p>
        </section>
      </div>
    </section>
  );
}
