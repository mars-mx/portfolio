# Wissensdokumente schreiben

Regeln für Markdown-Dateien in diesem Ordner. Sie folgen direkt daraus, wie
`app/agent/knowledge.py` die Dokumente für die semantische Suche zerlegt —
wer dagegen schreibt, produziert Chunks, die nicht gefunden werden oder ohne
Kontext beim Agenten ankommen.

## Wie gechunkt wird

- Jeder `## `-Abschnitt wird ein **eigener, unabhängiger Chunk**. Text vor der
  ersten H2 (Präambel) wird ein eigener Chunk ohne Überschrift. `###` und
  tiefer trennen nicht — sie bleiben im Chunk ihres H2-Abschnitts.
- Ein Chunk trägt als einzigen Kontext das Präfix `{title} — {heading}` plus
  die Frontmatter-`description`. Mehr sieht weder das Embedding noch der
  Agent bei einem Suchtreffer.
- Abschnitte über 4000 Zeichen werden an Absatzgrenzen (Leerzeilen) weiter
  geteilt — in Absätzen schreiben, keine Textwände.
- HTML-Kommentare (`<!-- … -->`) werden entfernt: weder embedded noch dem
  Agenten angezeigt. Geeignet für Hinweise an Bearbeiter.
- `README.md` und diese `CLAUDE.md` ignoriert der Loader (`IGNORED_FILES`).

## Regeln

1. **Jeder H2-Abschnitt muss für sich allein verständlich sein.** Die Suche
   liefert einzelne Chunks, nie das umliegende Dokument (das sieht der Agent
   nur bei explizitem `read_document`). Keine Verweise wie „wie oben
   beschrieben", keine Pronomen mit Bezug in einen anderen Abschnitt — das
   Subjekt (z. B. „Marius", der Projektname) in jedem Abschnitt neu nennen.
2. **Abschnitte thematisch geschlossen halten**: eine Besucherfrage sollte
   von einem einzelnen Chunk beantwortbar sein.
3. **Frontmatter ist Pflicht**: nur `key: value`-Zeilen zwischen
   `---`-Delimitern, kein YAML (keine Listen, keine Verschachtelung).
   `title` und `description` setzen. Die `description` ist eine Zeile,
   keyword-reich — sie wird in jeden Chunk embedded und steht im
   Dokument-Index der Agent-Instructions.
4. **Präambel = Kurzzusammenfassung** des Dokuments in 2–4 Zeilen; sie wird
   ein eigener Chunk ohne Überschrift.
5. **Dateiname = Doc-ID** für den Agenten: kebab-case, sprechend
   (z. B. `contact-software`).
6. `website-*.md` sind **generiert** (`make knowledge`) — nie von Hand
   editieren, Quelle ist `frontend/src/lib/profile.ts`/`site.ts`.
7. Das Repo ist **öffentlich**: für Projekt-Hintergründe gelten dieselben
   Anonymisierungsregeln wie für die Website (Kunden nur als Branche,
   keine Interna).
8. **Sparsam mit Bindestrichen**: keine Ketten mit Produktnamen (nicht
   „CONTACT-Elements-Umgebung", sondern „Umgebung auf Basis von CONTACT
   Elements"), Komposita lieber umformulieren oder zusammenschreiben
   („Chemiebranche").
9. Nach Änderungen re-embedded der Dev-Server automatisch
   (`--reload-include '*.md'`); manuell: `make index`.
