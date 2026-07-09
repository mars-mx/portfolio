"""Pydantic-AI-Agent für den Website-Assistenten.

Die Fakten über Marius kommen zur Laufzeit aus der Wissensbasis
(backend/knowledge/, siehe app.agent.knowledge): der Agent sucht per Tool
und antwortet nur auf Basis der Treffer.
"""

import logging

from pydantic_ai import Agent

from app.agent.knowledge import get_knowledge_base, load_documents
from app.core.config import settings

logger = logging.getLogger("mxdigital")

INSTRUCTIONS = """\
Du bist der KI-Assistent auf mxdigital.de, der persönlichen Website von Marius Schäffer.
Du beantwortest Besucherfragen zu Marius: Profil, Schwerpunkte, Projekthistorie, Werdegang,
Tech-Stack und Kontaktmöglichkeiten.

# Verhalten
- Antworte in der Sprache des Nutzers (Deutsch oder Englisch).
- Bleib beim Thema: Marius, seine Arbeit, Kontakt. Lenke Off-Topic-Fragen freundlich zurück.
- Erfinde keine Details. Antworte kompakt und konkret.

# Grounding
- Beantworte Faktenfragen ausschließlich auf Basis der Wissensbasis: Suche zuerst mit
  search_knowledge oder lies ein ganzes Dokument mit read_document.
- Nenne im Antworttext das Quelldokument, aus dem die Information stammt.
- Was die Suche nicht hergibt, weißt du nicht — sag das offen.
- Bei Kontaktwunsch oder Interesse an Zusammenarbeit: Kontaktdaten aus der Wissensbasis
  heraussuchen und konkret nennen.
"""

# defer_model_check: Modellstring erst beim ersten Run auflösen — die App
# startet damit auch, wenn der Provider-Key (noch) nicht gesetzt ist.
agent = Agent(settings.ai_model, instructions=INSTRUCTIONS, defer_model_check=True)


@agent.instructions
def document_index() -> str:
    """Baut pro Run den Dokument-Index — neue Dateien erscheinen ohne Code-Änderung."""
    documents = load_documents()
    if not documents:
        return "# Wissensbasis\nDerzeit sind keine Dokumente verfügbar."
    lines = "\n".join(f"- {doc.name}: {doc.description or doc.title}" for doc in documents)
    return f"# Wissensbasis\nVerfügbare Dokumente:\n{lines}"


@agent.tool_plain
async def search_knowledge(query: str) -> list[dict[str, str | float]] | str:
    """Durchsucht die Wissensbasis semantisch und liefert die relevantesten Abschnitte.

    Args:
        query: Suchanfrage in natürlicher Sprache (Deutsch oder Englisch).
    """
    try:
        kb = await get_knowledge_base()
        return await kb.search(query)
    except Exception:  # ehrlicher Fehler statt abgebrochenem Run
        # Details nur ins Log — die Tool-Rückgabe erreicht via Stream den Browser.
        logger.exception("Wissensbasis-Suche fehlgeschlagen")
        return "Die Wissensbasis ist momentan nicht erreichbar."


@agent.tool_plain
def read_document(name: str) -> str:
    """Liest ein Wissensdokument vollständig (Markdown ohne Frontmatter).

    Args:
        name: Dokumentname aus dem Dokument-Index, z. B. "website-projekte".
    """
    documents = {doc.name: doc for doc in load_documents()}
    if name not in documents:
        verfuegbar = ", ".join(sorted(documents)) or "derzeit keine"
        return f'Unbekanntes Dokument "{name}". Verfügbare Dokumente: {verfuegbar}.'
    return documents[name].body
