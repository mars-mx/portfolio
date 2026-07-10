"""CLI: baut oder aktualisiert den Wissensbasis-Index (Docker-Build, `make index`).

Aufruf aus backend/ mit gesetztem OPENAI_API_KEY:

    python -m app.agent.build_index
"""

import asyncio

from app.agent.knowledge import load_knowledge_base


async def main() -> None:
    kb = await load_knowledge_base()
    quelle = "Cache-Hit, keine API-Calls" if kb.from_cache else "neu embedded"
    print(f"Wissensbasis-Index: {len(kb.chunks)} Chunks aus {len(kb.documents)} Dokumenten ({quelle})")


if __name__ == "__main__":
    asyncio.run(main())
