import type {ReactNode} from "react";
import {NextIntlClientProvider, hasLocale} from "next-intl";
import {getMessages, getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing, type AppLocale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import {LanguageSwitcher} from "@/components/layout/language-switcher";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({locale, namespace: "Metadata"});

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations("Footer");

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-neutral-800 px-6 py-4 sm:px-10">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-end">
            <LanguageSwitcher locale={locale as AppLocale} />
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-800 px-6 py-6 text-sm text-neutral-400 sm:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-4">
            <Link className="hover:text-neutral-100" href="/impressum">
              {t("imprint")}
            </Link>
            <Link className="hover:text-neutral-100" href="/datenschutz">
              {t("privacy")}
            </Link>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
