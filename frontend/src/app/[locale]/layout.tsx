import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";

import { routing } from "@/i18n/routing";
import { jsonLdScript, siteJsonLd } from "@/lib/jsonld";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://mxdigital.de"),
    title: {
      default: t("title"),
      template: "%s · Marius Schäffer",
    },
    description: t("description"),
    // openGraph bewusst ohne title/description: Next füllt beides nach dem
    // Merge aus dem aufgelösten title/description der jeweiligen Seite auf.
    // Kein url-Feld: "./" würde gegen den intern umgeschriebenen Pfad (/de/…)
    // aufgelöst und widerspräche dem Canonical ohne Locale-Präfix.
    openGraph: {
      type: "website",
      siteName: "Marius Schäffer — MX Digital",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: locale === "de" ? "en_US" : "de_DE",
      images: [
        {
          url: "/marius_schaeffer.jpg",
          width: 968,
          height: 1039,
          alt: "Marius Schäffer",
        },
      ],
    },
    // Porträt statt 1200×630-Card, daher "summary" statt "summary_large_image".
    twitter: {
      card: "summary",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Auf Seiten mit [data-chat-page] (Chat) wird body auf Viewport-Höhe
          fixiert, damit nur der Thread-Viewport scrollt statt der Seite. */}
      <body className="min-h-full flex flex-col has-[[data-chat-page]]:h-full">
        {/* WebSite + Person — statische Werte aus site.ts/profile.ts, keine Nutzereingaben. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd(locale)) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <SiteHeader />
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <SiteFooter />
            <ChatWidget />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
