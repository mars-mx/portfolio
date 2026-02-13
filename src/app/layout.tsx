import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {routing} from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{locale?: string}>;
}>;

export default async function RootLayout({children, params}: RootLayoutProps) {
  const {locale} = await params;
  const lang = locale && routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale;

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-neutral-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
