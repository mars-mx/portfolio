# MX Digital — Konzept

> Relaunch der Homepage **mxdigital.de** als moderne Developer-Site.
> Clean, plain, GitHub-artig. Light & Dark Mode. Next.js Frontend + FastAPI Backend.

---

## 1. Ziel & Vision

Aufwertung der bestehenden Portfolio-Seite von **Marius Schäffer / MX Digital**
(Softwareentwickler & Webdesigner) zu einer technisch sauberen, schnellen und
ästhetisch zurückhaltenden Developer-Homepage.

**Leitbild:** „Wie eine GitHub-Profilseite, nur als persönliche Marke." —
viel Whitespace, monospace-Akzente, dezente Borders, keine grellen Farben,
Inhalt vor Effekt. Animationen subtil (MagicUI / Framer Motion), nie verspielt.

### Erfolgskriterien

- [ ] Lighthouse: Performance / Accessibility / Best Practices / SEO jeweils ≥ 95
- [ ] Voll funktionsfähiger Light/Dark Mode (System-Preference + Toggle, kein Flash)
- [ ] Responsiv von 320px bis Ultrawide
- [ ] Bestehende Inhalte (Über mich, Impressum, Datenschutz) übernommen
- [ ] Kontaktformular schreibt an das FastAPI-Backend
- [ ] Klare Trennung Frontend/Backend, lokal mit einem Befehl startbar

---

## 2. Architektur

Monorepo mit klarer Trennung von Frontend und Backend.

```
mxdigital/
├── docs/
│   └── concept.md          # dieses Dokument
├── frontend/               # Next.js 15 (App Router, TypeScript)
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
| Framework      | Next.js 15 (App Router)       | SSG/SSR, beste DX, Vercel |
| Sprache        | TypeScript                    | Typsicherheit |
| Styling        | Tailwind CSS v4               | Utility-first, schnell |
| Komponenten    | shadcn/ui                     | unstyled-by-default, voller Code-Besitz |
| Effekte        | MagicUI + Framer Motion (`motion`) | subtile Animationen |
| Theming        | next-themes                   | Light/Dark ohne Flash |
| Icons          | lucide-react                  | konsistent zu shadcn |
| Fonts          | Geist Sans + Geist Mono       | klar, developer-affin |

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

- **Neutralbasis:** zinc / neutral Graustufen
- **Akzent:** ein einziger Akzent-Ton (z.B. Blau/Indigo), sparsam eingesetzt
- **Light & Dark:** über `:root` und `.dark` CSS-Variablen (HSL/oklch)

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
| `/`               | Hero (Name, Tagline), Leistungen, Tech-Stack, ausgewählte Projekte, Kontakt-CTA |
| `/ueber-mich`     | Werdegang, Skills, Foto, ausführlicher Text |
| `/impressum`      | Impressum (rechtlich erforderlich) |
| `/datenschutz`    | Datenschutzerklärung |
| (optional) `/projekte` | Projekt-Übersicht |
| (optional) `/blog`     | Technische Artikel |

### Globale Elemente

- **Header:** Logo/Name links, Nav (Home, Über mich), Theme-Toggle, GitHub/LinkedIn
- **Footer:** Nav, Social-Links, Impressum/Datenschutz, Copyright

### Startseiten-Sektionen

1. **Hero** — „Hi, ich bin Marius Schäffer" + Tagline, zwei CTAs (Kontakt, GitHub)
2. **Leistungen** — Webdesign / Softwareentwicklung als Cards
3. **Tech-Stack** — Logo-/Badge-Reihe (subtile MagicUI Marquee o.ä.)
4. **Projekte** — Auswahl (Cards mit Link)
5. **Kontakt** — Formular → FastAPI

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

---

## 7. Konfiguration & Umgebungen

- **Frontend:** `NEXT_PUBLIC_API_URL` zeigt auf das Backend (lokal `http://localhost:8000`)
- **Backend:** `.env` mit `CORS_ORIGINS`, später Mail-Credentials
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
- [ ] Hero, Leistungen, Footer/Header final
- [ ] Über mich, Impressum, Datenschutz migrieren
- [ ] Theme-Feinschliff (Farben, Typo)

**Phase 2 — Funktion**
- [ ] Kontaktformular ↔ Backend, Mailversand
- [ ] Projekte-Sektion mit echten Inhalten
- [ ] SEO (Metadata, OG-Images, Sitemap)

**Phase 3 — Optional**
- [ ] Blog
- [ ] Analytics (privacy-friendly)
- [ ] i18n (DE/EN)

---

## 10. Offene Entscheidungen / Annahmen

- **Mailversand:** Anbieter noch offen (Resend/Postmark/SMTP) — Stub vorerst.
- **Projekte:** Inhalte/Quellen noch zu definieren (statisch vs. API).
- **Backend-Notwendigkeit:** Für eine reine Portfolio-Seite optional; hier
  bewusst vorgesehen für Kontaktformular und spätere dynamische Features.
- **Akzentfarbe:** konkret noch festzulegen (Default: shadcn „zinc"/neutral).
