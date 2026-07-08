# MX Digital — Konzept

> Relaunch der Homepage **mxdigital.de** als moderne Developer-Site.
> Clean, plain, GitHub-artig. Light & Dark Mode. Next.js Frontend + FastAPI Backend.

---

## 1. Ziel & Vision

Aufwertung der bestehenden Portfolio-Seite von **Marius Schäffer / MX Digital**
(Softwareentwickler mit Fokus auf KI — LLM-Agentensysteme, Tool-Anbindung & RAG,
Context Engineering) zu einer technisch sauberen, schnellen und ästhetisch
zurückhaltenden Developer-Homepage.

**Leitbild:** „Wie eine GitHub-Profilseite, nur als persönliche Marke." —
viel Whitespace, monospace-Akzente, dezente Borders, keine grellen Farben,
Inhalt vor Effekt. Animationen subtil (MagicUI / Framer Motion), nie verspielt.

### Erfolgskriterien

- [ ] Lighthouse: Performance / Accessibility / Best Practices / SEO jeweils ≥ 95
- [x] Voll funktionsfähiger Light/Dark Mode (System-Preference + Toggle, kein Flash)
- [ ] Responsiv von 320px bis Ultrawide
- [x] Bestehende Inhalte (Über mich, Impressum, Datenschutz) übernommen
- [x] Kontaktformular schreibt an das FastAPI-Backend
- [x] Klare Trennung Frontend/Backend, lokal mit einem Befehl startbar (`make dev`)

---

## 2. Architektur

Monorepo mit klarer Trennung von Frontend und Backend.

```
mxdigital/
├── docs/
│   └── concept.md          # dieses Dokument
├── frontend/               # Next.js 16 (App Router, TypeScript)
│   ├── src/app/            # Routes & Layouts
│   ├── src/components/     # UI-Komponenten (shadcn) + MagicUI
│   ├── src/lib/            # Utils, API-Client
│   └── ...
├── backend/                # FastAPI (Python 3.12+, uv)
│   ├── app/
│   │   ├── main.py         # App-Entry, Router-Mounting, CORS
│   │   ├── api/            # Endpoints (z.B. contact, health)
│   │   ├── core/           # Config, Settings
│   │   └── schemas/        # Pydantic-Modelle
│   ├── pyproject.toml
│   └── ...
└── README.md
```

### Datenfluss

```
Browser ──▶ Next.js (SSR/SSG, Vercel-tauglich)
                │
                │ fetch() JSON  (z.B. POST /api/contact)
                ▼
            FastAPI ──▶ Validierung (Pydantic) ──▶ E-Mail-Versand / Persistenz
```

Das Frontend ist weitgehend statisch (Marketing/Portfolio). Das Backend
übernimmt dynamische Aufgaben: Kontaktformular, später optional Projekt-API,
Blog-Daten, Analytics-Proxy.

---

## 3. Tech-Stack

### Frontend

| Bereich        | Wahl                          | Begründung |
|----------------|-------------------------------|------------|
| Framework      | Next.js 16 (App Router)       | SSG/SSR, beste DX, Vercel |
| Sprache        | TypeScript                    | Typsicherheit |
| Styling        | Tailwind CSS v4               | Utility-first, schnell |
| Komponenten    | shadcn/ui                     | unstyled-by-default, voller Code-Besitz |
| Effekte        | MagicUI + Framer Motion (`motion`) | subtile Animationen |
| Theming        | next-themes                   | Light/Dark ohne Flash |
| Icons          | lucide-react                  | konsistent zu shadcn |
| Fonts          | Geist Sans + Geist Mono       | klar, developer-affin |
| PDF            | @react-pdf/renderer           | Profil-Onepager als `/profil.pdf`-Route |

### Backend

| Bereich        | Wahl                          | Begründung |
|----------------|-------------------------------|------------|
| Framework      | FastAPI                       | async, OpenAPI, Pydantic |
| Runtime/Tooling| uv                            | schnelles Dependency-/Env-Management |
| Validierung    | Pydantic v2                   | Schemas + Settings |
| Server         | uvicorn                       | ASGI Dev/Prod |
| Mailversand    | später: SMTP / Resend / Postmark | Kontaktformular |

---

## 4. Design-System

Orientierung an GitHubs Primer — neutral, hoher Kontrast bei Text, dezente
Akzentfarbe.

### Farben (über shadcn CSS-Variablen / Tailwind)

- **Neutralbasis:** neutral Graustufen (shadcn baseColor `neutral`)
- **Akzent:** bewusst keiner — durchgehend neutrale Palette (siehe §10)
- **Light & Dark:** über `:root` und `.dark` CSS-Variablen (oklch) in `globals.css`

### Typografie

- Headlines: Geist Sans, fett, eng (tracking-tight)
- Body: Geist Sans, ruhige Zeilenhöhe
- Code/Akzente: Geist Mono

### Prinzipien

- Großzügiger Whitespace, schmale Content-Spalte (max-w ~3xl–5xl)
- 1px-Borders statt Schatten, abgerundete Ecken dezent
- Bewegung: Fade/Slide beim Scrollen, Hover-Microinteractions — kurz & subtil
- Barrierefrei: Fokus-States, ausreichende Kontraste, `prefers-reduced-motion`

---

## 5. Seitenstruktur (Information Architecture)

| Route             | Inhalt |
|-------------------|--------|
| `/`               | Hero (Name, Tagline, CTAs), Schwerpunkte, Tech-Stack |
| `/ueber-mich`     | Werdegang, Projekthistorie, Ausbildung, Tech-Stack |
| `/kontakt`        | Kontaktformular → FastAPI |
| `/profil`         | Profil-Onepager (HTML-Ansicht) |
| `/profil.pdf`     | gleicher Inhalt als serverseitig generiertes PDF |
| `/impressum`      | Impressum (rechtlich erforderlich) |
| `/datenschutz`    | Datenschutzerklärung |
| (optional) `/blog`     | Technische Artikel |

Inhalte liegen als Daten in `src/lib/site.ts` (Name, Tagline, Nav, Social) und
`src/lib/profile.ts` (Schwerpunkte, Projekthistorie, Werdegang, Ausbildung,
Tech-Stack) — Seiten und PDF konsumieren dieselbe Quelle.

### Globale Elemente

- **Header:** Name/Brand links, Nav (Home, Profil, Kontakt), Theme-Toggle, GitHub/LinkedIn
- **Footer:** Nav, Social-Links, Impressum/Datenschutz, Copyright

### Startseiten-Sektionen

1. **Hero** — Name + Tagline, zwei CTAs (Kontakt, GitHub)
2. **Schwerpunkte** — Enterprise LLM-Agentensysteme, Tool-Anbindung & RAG, Context Engineering als Cards
3. **Tech-Stack** — statische Badge-Reihe

Das Kontaktformular lebt auf `/kontakt` (nicht auf der Startseite); die
Projekthistorie auf `/ueber-mich` bzw. im Profil-PDF.

---

## 6. Backend-API (Entwurf)

| Methode | Pfad             | Zweck |
|---------|------------------|-------|
| GET     | `/api/health`    | Healthcheck (Status, Version) |
| POST    | `/api/contact`   | Kontaktformular: Name, E-Mail, Nachricht |

**Contact-Payload (Pydantic):**

```json
{
  "name": "string (1–100)",
  "email": "EmailStr",
  "message": "string (1–5000)"
}
```

Antwort: `200 { "ok": true }` oder `422` bei Validierungsfehler.
Spam-Schutz später via Honeypot/Rate-Limit. CORS auf die Frontend-Domain begrenzt.

**Aktueller Stand:** Die Anfrage wird validiert und nur protokolliert —
der Mailversand (Resend/Postmark/SMTP) ist noch nicht angebunden.

---

## 7. Konfiguration & Umgebungen

- **Frontend:** `NEXT_PUBLIC_API_URL` zeigt auf das Backend (lokal `http://localhost:8210`)
- **Backend:** `.env` mit `CORS_ORIGINS`, später Mail-Credentials
- **Lokale Ports:** bewusst nicht 3000/8000 — Frontend `3210`, Backend `8210`;
  `make dev` setzt `NEXT_PUBLIC_API_URL` und `CORS_ORIGINS` automatisch passend
- **Secrets:** nie committen; `.env.example` als Vorlage

---

## 8. Deployment (Vorschlag)

- **Frontend:** Vercel (native Next.js-Unterstützung, Preview-Deploys)
- **Backend:** Container (Docker) auf Fly.io / Railway / eigener VPS
- **Domain:** `mxdigital.de` → Frontend, `api.mxdigital.de` → Backend

---

## 9. Roadmap

**Phase 0 — Bootstrap (dieser Schritt)**
- [x] Konzept
- [x] Next.js + Tailwind + shadcn + MagicUI + next-themes
- [x] FastAPI + uv, Health-/Contact-Stub
- [x] Lauffähige Startseite & README

**Phase 1 — Inhalt & Design**
- [x] Hero, Schwerpunkte, Footer/Header final
- [x] Über mich, Impressum, Datenschutz migrieren
- [x] Theme-Feinschliff (neutrale oklch-Palette, Geist)
- [x] Profil-Onepager `/profil` mit PDF-Download `/profil.pdf`

**Phase 2 — Funktion**
- [x] Kontaktformular ↔ Backend (eigene Seite `/kontakt`)
- [ ] Mailversand anbinden (Backend loggt bisher nur)
- [x] Projekthistorie mit echten Inhalten (`/ueber-mich`, Profil-PDF)
- [ ] SEO (OG-Images, Sitemap — Metadata pro Seite vorhanden)

**Phase 3 — Optional**
- [ ] Blog
- [ ] Analytics (privacy-friendly)
- [ ] i18n (DE/EN)

---

## 10. Offene Entscheidungen / Annahmen

- **Mailversand:** Anbieter noch offen (Resend/Postmark/SMTP) — Stub vorerst.
- **Projekte:** entschieden — statische Daten in `src/lib/profile.ts`
  (Projekthistorie), keine API.
- **Backend-Notwendigkeit:** Für eine reine Portfolio-Seite optional; hier
  bewusst vorgesehen für Kontaktformular und spätere dynamische Features.
- **Akzentfarbe:** entschieden — keine; durchgehend neutrale shadcn-Palette
  (baseColor „neutral").
