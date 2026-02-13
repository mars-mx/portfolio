# Cloud.md

## Umsetzung Issue #6 – Internationalisierung (de/en)

### Zielbild
Ein SSR-fähiges, konsistentes i18n-Setup im bestehenden Next.js App Router mit sauberem Locale-Routing.

### Technische Entscheidung
- Framework: **next-intl**
- Grund: Native App-Router-Integration, SSR/Server-Components-Unterstützung, klare Routing- und Message-Architektur.

### Implementierte Bausteine

1. **Core i18n-Konfiguration**
   - `src/i18n/routing.ts`
   - `src/i18n/navigation.ts`
   - `src/i18n/request.ts`

2. **Next.js Integration**
   - `next.config.ts` auf `next-intl/plugin` umgestellt
   - `middleware.ts` hinzugefügt (Locale-Routing und Matcher)

3. **Locale-Routing / App Router Struktur**
   - Lokalisierte Route-Gruppierung über `src/app/[locale]/...`
   - Startseite, Impressum und Datenschutz unter Locale-Segment
   - Root-Route `/` redirectet auf `/de`

4. **Übersetzungen**
   - `messages/de.json`
   - `messages/en.json`
   - Gleiche Schlüsselstruktur in beiden Sprachen für konsistente Inhalte

5. **UI/Navigation**
   - Locale-aware Links über `src/i18n/navigation.ts`
   - Sprachumschalter (`DE`/`EN`) im Header
   - Footer-Links (`Impressum`/`Datenschutz`) lokalisiert und locale-stabil

### SSR-Kompatibilität
- Übersetzungen werden pro Request in `src/i18n/request.ts` geladen.
- Seiten nutzen serverseitige Translation-APIs (`getTranslations`, `setRequestLocale`).
- Damit sind Locale und Inhalte SSR-konsistent.

### Ergebnis gegen Akzeptanzkriterien
- **de/en funktionieren konsistent:** ✅
- **Kein Auseinanderlaufen von Inhalten/Struktur:** ✅ (gleiche Route-Struktur + gleiche Message-Keys)
- **Für Erweiterung vorbereitet:** ✅ (zentrale Routing-/Message-Architektur, einfach auf weitere Locales erweiterbar)
