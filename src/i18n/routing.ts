import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "always",
  pathnames: {
    "/datenschutz": {
      de: "/datenschutz",
      en: "/privacy",
    },
  },
});

export type AppLocale = (typeof routing.locales)[number];
