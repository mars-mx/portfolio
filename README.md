# portfolio

## Internationalisierung (de/en)

Das Projekt nutzt jetzt **next-intl** als SSR-fähiges i18n-Framework im Next.js App Router.

### Aktuelles Setup

- Unterstützte Locales: `de`, `en`
- Default-Locale: `de`
- Locale-Routing über Prefix: `/de/...`, `/en/...`
- Root `/` leitet auf `/de` weiter
- Middleware erzwingt konsistentes Locale-Routing

### Struktur

- `src/i18n/routing.ts` → zentrale Locale-Definition
- `src/i18n/navigation.ts` → locale-aware `Link`, `redirect`, Router-Helper
- `src/i18n/request.ts` → SSR-Message-Loading pro Locale
- `middleware.ts` → Routing/Locale-Erkennung
- `messages/de.json`, `messages/en.json` → Übersetzungen
- `src/app/[locale]/...` → lokalisierte Seiten

### Pflege/Erweiterung

1. Neue Texte in **beiden** Dateien ergänzen: `messages/de.json` und `messages/en.json`
2. Neue Seiten unter `src/app/[locale]/...` anlegen
3. Übersetzungen über `getTranslations(...)` (Server Components) abrufen

So bleibt die Struktur zwischen Deutsch/Englisch synchron und ist für weitere Sprachen vorbereitet.

## Deployment workflow (manual production deploys)

This project is configured to **not** auto-deploy production on every Git push.

### What is configured

- `vercel.json` sets `git.deploymentEnabled.main = false`
- Result: pushes to `main` do not trigger automatic Vercel deployments

### Team deploy flow

1. Create an issue
2. Create a branch
3. Open a PR
4. Merge PR into `main`
5. Trigger deployment manually (intentional deploy), e.g.:
   - via Vercel dashboard **Deploy** action, or
   - via CLI: `vercel --prod`

This keeps production releases explicit and predictable.
