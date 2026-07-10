// Reines Durchreich-Layout: <html>/<body> rendert weiterhin das
// [locale]-Layout. Existiert nur, damit app/not-found.tsx als Root-404
// greifen kann (next-intl-Pattern für nicht gematchte Routen).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
