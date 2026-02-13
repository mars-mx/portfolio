"use client";

import {useTranslations} from "next-intl";
import {routing, type AppLocale} from "@/i18n/routing";
import {Link, usePathname} from "@/i18n/navigation";

type LanguageSwitcherProps = {
  locale: AppLocale;
};

const labels: Record<AppLocale, string> = {
  de: "DE",
  en: "EN",
};

export function LanguageSwitcher({locale}: LanguageSwitcherProps) {
  const t = useTranslations("Language");
  const pathname = usePathname();

  return (
    <nav aria-label={t("switchLabel")} className="flex items-center gap-2">
      {routing.locales.map((item) => {
        const isActive = item === locale;

        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            className={`rounded-full border px-3 py-1 text-xs tracking-[0.14em] transition ${
              isActive
                ? "border-neutral-500 bg-neutral-800 text-neutral-100"
                : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-100"
            }`}
          >
            {labels[item]}
          </Link>
        );
      })}
    </nav>
  );
}
