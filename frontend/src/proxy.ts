import createMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Alles außer Next-Interna und Pfaden mit Dateiendung (z. B. /profil.pdf)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
