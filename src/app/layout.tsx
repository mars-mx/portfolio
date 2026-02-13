import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MX Digital Portfolio",
  description: "Portfolio von MX Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-neutral-100 antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-neutral-800 px-6 py-6 text-sm text-neutral-400 sm:px-10">
            <div className="mx-auto flex w-full max-w-5xl flex-wrap gap-4">
              <Link className="hover:text-neutral-100" href="/impressum">
                Impressum
              </Link>
              <Link className="hover:text-neutral-100" href="/datenschutz">
                Datenschutzerklärung
              </Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
