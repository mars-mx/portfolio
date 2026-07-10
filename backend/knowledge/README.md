# Wissensbasis

Markdown-Dokumente für den Website-Assistenten (RAG). Der Loader in
`app/agent/knowledge.py` liest alle `*.md`-Dateien in diesem Verzeichnis —
diese README und die CLAUDE.md werden ignoriert. Der Dateistamm ist die
Doc-ID, die dem Agenten angezeigt wird (z. B. `website-projekte`).

Schreibregeln für Dokumente (Frontmatter, Chunk-Grenzen, in sich
geschlossene Abschnitte) stehen in [CLAUDE.md](CLAUDE.md).

## Generierte Dateien

Die `website-*.md`-Dateien werden aus `frontend/src/lib/profile.ts` generiert
(`make knowledge`) — nicht von Hand editieren, Content-Änderungen dort
vornehmen. Handgeschriebene Hintergrund-Dokumente können daneben ergänzt
werden und erscheinen ohne Code-Änderung im Index.
