import Link from "next/link"
import { Geist } from "next/font/google"

import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })

// Rendert eigenes <html>/<body>, weil das Root-Layout nur durchreicht.
// Fängt v. a. Pfade mit Dateiendung ab (z. B. /foo.xml), die der
// Proxy-Matcher ausklammert und die keine gültige Locale sind — ohne
// diese Seite würde notFound() im [locale]-Layout im Prod-Build mit
// einem 500 statt 404 antworten.
export default function NotFound() {
  return (
    <html lang="de" className={`${geistSans.className} antialiased`}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border border-border px-8 py-6 text-center">
          <h1 className="text-lg font-semibold">404 – Seite nicht gefunden</h1>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Zur Startseite
          </Link>
        </div>
      </body>
    </html>
  )
}
