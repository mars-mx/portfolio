import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.agent.knowledge import get_knowledge_base
from app.api.routes import router
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mxdigital")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    """Baut/lädt beim Start den Wissensbasis-Index; Fehler blockieren den Start nicht."""
    try:
        kb = await get_knowledge_base()
        logger.info(
            "Wissensbasis geladen: %d Chunks aus %d Dokumenten (%s)",
            len(kb.chunks),
            len(kb.documents),
            "Cache" if kb.from_cache else "neu embedded",
        )
    except Exception:
        logger.warning(
            "Wissensbasis konnte nicht geladen werden — search_knowledge meldet den Fehler beim Aufruf",
            exc_info=True,
        )
    yield


app = FastAPI(title=settings.app_name, version=settings.version, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "version": settings.version}
