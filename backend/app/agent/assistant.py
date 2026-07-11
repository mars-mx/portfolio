"""Pydantic-AI-Agent für den Website-Assistenten.

Die Fakten über Marius kommen zur Laufzeit aus der Wissensbasis
(backend/knowledge/, siehe app.agent.knowledge): der Agent sucht per Tool
und antwortet nur auf Basis der Treffer.
"""

import logging

from pydantic_ai import Agent
from pydantic_ai.capabilities import WebSearch

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
- Fragt jemand nach dem Profil oder Lebenslauf als PDF, Datei oder Download, rufe
  offer_profile_download auf — der Nutzer bekommt dann direkt einen Download-Button.

# Grounding
- Fakten über Marius beantwortest du ausschließlich auf Basis der Wissensbasis: Suche
  zuerst mit search_knowledge oder lies ein ganzes Dokument mit read_document.
- Erwähne Wissensbasis, Tools oder Quelldokumente im Antworttext nicht — die Quellen
  sieht der Nutzer separat in der Oberfläche. Antworte direkt, als wüsstest du es einfach.
- Was die Suche nicht hergibt, weißt du nicht — sag das offen.
- Bei Kontaktwunsch oder Interesse an Zusammenarbeit: Kontaktdaten aus der Wissensbasis
  heraussuchen und konkret nennen.
"""

WEB_SEARCH_INSTRUCTIONS = """\
- Für allgemeine oder aktuelle Fragen rund um Marius' Themen (z. B. Technologien,
  Versionen, Begriffe) kannst du zusätzlich die Websuche nutzen — lege Marius dabei
  nichts in den Mund, was nicht aus der Wissensbasis stammt.
"""

BOOKING_INSTRUCTIONS = """\
- Möchte jemand einen Termin, ein Kennenlernen oder ein Gespräch mit Marius
  vereinbaren, rufe offer_booking auf — der Nutzer bekommt dann direkt einen
  Buchungs-Button für Marius' Kalender.
"""

# defer_model_check: Modellstring erst beim ersten Run auflösen — die App
# startet damit auch, wenn der Provider-Key (noch) nicht gesetzt ist.
# WebSearch nutzt die native Websuche des Modells, serverseitig beim Provider
# (OpenAI Responses API) — nur mit WEB_SEARCH=true, siehe app.core.config.
agent = Agent(
    settings.ai_model,
    instructions=INSTRUCTIONS
    + (WEB_SEARCH_INSTRUCTIONS if settings.web_search else "")
    + (BOOKING_INSTRUCTIONS if settings.booking_url else ""),
    capabilities=[WebSearch()] if settings.web_search else [],
    defer_model_check=True,
)


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
def offer_profile_download(button_label: str) -> str:
    """Zeigt dem Nutzer einen Download-Button für Marius' aktuelles Profil als PDF.

    Rufe dieses Tool genau einmal auf, wenn jemand nach dem Profil, Lebenslauf/CV
    oder einer PDF-Version fragt.

    Args:
        button_label: Beschriftung des Buttons in der Sprache des Nutzers,
            z. B. "Jetzt herunterladen" oder "Download now".
    """
    # Reiner UI-Trigger: Den Button rendert das Frontend
    # (profile-download-tool.tsx), der PDF-Link liegt dort.
    # Die Rückgabe fordert explizit eine Textantwort an — eine leere Antwort
    # nach dem Tool-Call zählt bei Pydantic-AI als Output-Retry und bricht
    # den Run ab ("Exceeded maximum output retries").
    return (
        "Der Download-Button wird dem Nutzer angezeigt. "
        "Antworte jetzt mit einem kurzen Satz in der Sprache des Nutzers, sinngemäß: "
        '"Klicke auf die Schaltfläche, um das aktuelle Profil direkt herunterzuladen." '
        "Ohne Link, der Button ist schon da."
    )


if settings.booking_url:

    @agent.tool_plain
    def offer_booking(button_label: str) -> dict[str, str]:
        """Zeigt dem Nutzer Marius' Buchungskalender direkt im Chat an.

        Rufe dieses Tool genau einmal auf, wenn jemand einen Termin, ein
        Kennenlernen oder ein Gespräch mit Marius vereinbaren möchte.

        Args:
            button_label: Beschriftung in der Sprache des Nutzers,
                z. B. "Termin buchen" oder "Book a meeting".
        """
        # Der Buchungslink lebt bewusst nur im Backend (BOOKING_URL): Er erreicht
        # den Browser ausschließlich als Tool-Ergebnis über den Turnstile-
        # geschützten Chat-Stream, das Frontend rendert daraus das Widget
        # (booking-tool.tsx). Einbettbar ist nur die Schedule-URL mit ?gv=true —
        # der Kurzlink (calendar.app.google) verwirft den Parameter beim
        # Redirect; ohne embed_url bleibt es beim Button.
        embeddable = "calendar.google.com" in settings.booking_url
        return {
            "url": settings.booking_url,
            "embed_url": f"{settings.booking_url}?gv=true" if embeddable else "",
            "hint": (
                "Der Buchungskalender wird dem Nutzer direkt im Chat angezeigt. "
                "Antworte jetzt mit einem kurzen Satz in der Sprache des Nutzers, "
                'sinngemäß: "Such dir hier direkt einen passenden Termin aus." '
                "Nenne die URL nicht, der Kalender ist schon da."
            ),
        }


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
