# Wissensbasis

Markdown-Dokumente für den Website-Assistenten (RAG). Der Loader in
`app/agent/knowledge.py` liest alle `*.md`-Dateien in diesem Verzeichnis —
diese README wird ignoriert. Der Dateistamm ist die Doc-ID, die dem Agenten
angezeigt wird (z. B. `website-projekte`).

## Konventionen

- **Frontmatter**: nur `key: value`-Zeilen zwischen `---`-Delimitern (kein
  YAML). Ausgewertet werden `title` (Kontext-Präfix der Chunks) und
  `description` (eine Zeile für den Dokument-Index in den Agent-Instructions);
  `generated: true` markiert generierte Dateien.
- **`## `-Überschriften sind Chunk-Grenzen**: jeder H2-Abschnitt wird ein
  eigener Suchtreffer. Abschnitte thematisch geschlossen halten.

## Generierte Dateien

Die `website-*.md`-Dateien werden aus `frontend/src/lib/profile.ts` generiert
(`make knowledge`) — nicht von Hand editieren, Content-Änderungen dort
vornehmen. Handgeschriebene Hintergrund-Dokumente können daneben ergänzt
werden und erscheinen ohne Code-Änderung im Index.
