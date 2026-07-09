"""Datei-basierte Wissensbasis für den Website-Assistenten.

Markdown-Dokumente aus backend/knowledge/ werden heading-aware gechunkt, per
OpenAI-Embeddings indiziert und mit numpy exakt durchsucht. Bewusst ohne
Vektor-Datenbank: exakte Suche über ein normalisiertes float32-Array ist bis
in die Zehntausende Chunks unkritisch — eine Vektor-DB rechtfertigt sich über
Betriebsanforderungen (Laufzeit-Upserts, Filter, Multi-Tenancy), nicht über
Suchgeschwindigkeit. Der Index liegt als JSON-Cache in backend/.cache/ und
wird nur bei Content-, Modell- oder Chunker-Änderungen neu embedded.
"""

import asyncio
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from openai import AsyncOpenAI

from app.core.config import settings

# Bei Änderungen an der Chunking-Logik hochzählen — invalidiert den Cache.
CHUNKER_VERSION = "3"

# Abschnitte über dieser Länge werden an Absatzgrenzen weitergeteilt.
MAX_CHUNK_CHARS = 4000

_BACKEND_ROOT = Path(__file__).resolve().parents[2]
KNOWLEDGE_DIR = _BACKEND_ROOT / "knowledge"
INDEX_PATH = _BACKEND_ROOT / ".cache" / "knowledge-index.json"


@dataclass
class Document:
    """Ein Wissensdokument: Doc-ID (Dateistamm), Frontmatter-Metadaten, Body."""

    name: str
    title: str
    description: str
    body: str


@dataclass
class Chunk:
    """Ein Suchtreffer-Kandidat: H2-Abschnitt mit Kontext-Präfix im Text."""

    doc: str
    heading: str
    text: str


@dataclass
class KnowledgeBase:
    """Geladener Index: Dokumente, Chunks und normalisierte Embedding-Matrix."""

    documents: list[Document]
    chunks: list[Chunk]
    matrix: np.ndarray
    from_cache: bool

    async def search(self, query: str, k: int = 5) -> list[dict[str, str | float]]:
        """Liefert die k ähnlichsten Chunks (Cosine = Dot-Product, da normalisiert)."""
        if not self.chunks:
            return []
        [vector] = await embed_texts([query])
        scores = self.matrix @ vector
        top = np.argsort(scores)[::-1][:k]
        return [
            {
                "document": self.chunks[i].doc,
                "heading": self.chunks[i].heading,
                "text": self.chunks[i].text,
                "score": round(float(scores[i]), 3),
            }
            for i in top
        ]


def _read_files() -> list[tuple[str, str]]:
    """Liest alle Wissensdateien als sortierte (Dateiname, Rohtext)-Paare, ohne README.md."""
    if not KNOWLEDGE_DIR.is_dir():
        return []
    return sorted(
        (path.name, path.read_text(encoding="utf-8"))
        for path in KNOWLEDGE_DIR.glob("*.md")
        if path.name != "README.md"
    )


def _parse_frontmatter(raw: str) -> tuple[dict[str, str], str]:
    """Trennt simples `key: value`-Frontmatter (kein YAML) vom Markdown-Body."""
    lines = raw.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, raw
    meta: dict[str, str] = {}
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            return meta, "\n".join(lines[i + 1 :])
        if ":" in line:
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()
    return {}, raw  # kein schließender Delimiter → alles als Body behandeln


def _parse_documents(files: list[tuple[str, str]]) -> list[Document]:
    """Baut aus (Dateiname, Rohtext)-Paaren Document-Objekte."""
    documents = []
    for name, raw in files:
        meta, body = _parse_frontmatter(raw)
        # HTML-Kommentare (z. B. der GENERIERT-Hinweis) sind kein Inhalt —
        # sie würden sonst mit embedded und dem Agenten angezeigt.
        body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)
        stem = Path(name).stem
        documents.append(
            Document(
                name=stem,
                title=meta.get("title", stem),
                description=meta.get("description", ""),
                body=body.strip(),
            )
        )
    return documents


def load_documents() -> list[Document]:
    """Lädt alle Wissensdokumente aus backend/knowledge/ (ohne README.md)."""
    return _parse_documents(_read_files())


def _split_paragraphs(text: str, limit: int) -> list[str]:
    """Teilt übergroßen Text an Absatzgrenzen in Stücke bis ~limit Zeichen."""
    parts: list[str] = []
    current = ""
    for paragraph in text.split("\n\n"):
        candidate = f"{current}\n\n{paragraph}" if current else paragraph
        if current and len(candidate) > limit:
            parts.append(current)
            current = paragraph
        else:
            current = candidate
    if current:
        parts.append(current)
    return parts


def _build_chunks(doc: str, heading: str, prefix: str, body: str) -> list[Chunk]:
    """Erzeugt aus einem Abschnitt einen oder (bei Überlänge) mehrere Chunks."""
    pieces = _split_paragraphs(body, MAX_CHUNK_CHARS) if len(body) > MAX_CHUNK_CHARS else [body]
    return [Chunk(doc=doc, heading=heading, text=f"{prefix}\n\n{piece}") for piece in pieces]


def chunk_document(document: Document) -> list[Chunk]:
    """Zerteilt ein Dokument an H2-Überschriften.

    Jeder Chunk trägt Dokument-Kontext im embedded Text: "{Titel} — {Überschrift}"
    plus die Frontmatter-Description. Ohne die Description verlieren Chunks ihre
    Dokument-Semantik und kurze Dokumente werden zu Similarity-Magneten.
    """
    context = f"{document.title}\n{document.description}".strip()
    parts = re.split(r"^## +(.*)$", document.body, flags=re.MULTILINE)
    chunks: list[Chunk] = []
    preamble = parts[0].strip()
    if preamble:
        chunks.extend(_build_chunks(document.name, "", context, preamble))
    for heading, body in zip(parts[1::2], parts[2::2]):
        heading, body = heading.strip(), body.strip()
        if body:
            prefix = f"{document.title} — {heading}\n{document.description}".strip()
            chunks.extend(_build_chunks(document.name, heading, prefix, body))
    return chunks


def _index_hash(files: list[tuple[str, str]]) -> str:
    """Content-Hash über Embedding-Modell, Chunker-Version und alle Dateien."""
    h = hashlib.sha256()
    for part in (settings.embedding_model, CHUNKER_VERSION):
        h.update(part.encode())
        h.update(b"\x00")
    for name, content in files:  # _read_files() liefert bereits sortiert
        h.update(name.encode())
        h.update(b"\x00")
        h.update(content.encode())
        h.update(b"\x00")
    return h.hexdigest()


_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    """Ein Client für alle Embedding-Calls; lazy, damit der Import ohne Key läuft."""
    global _client
    if _client is None:
        _client = AsyncOpenAI()
    return _client


async def embed_texts(texts: list[str]) -> np.ndarray:
    """Embeddet alle Texte in einem Batch-Call und normalisiert die Vektoren.

    Der API-Key kommt aus der Prozessumgebung (OPENAI_API_KEY).
    """
    response = await _get_client().embeddings.create(model=settings.embedding_model, input=texts)
    vectors = np.array([item.embedding for item in response.data], dtype=np.float32)
    return vectors / np.linalg.norm(vectors, axis=1, keepdims=True)


def _read_cache() -> dict | None:
    """Liest den Index-Cache; bei fehlender oder kaputter Datei None."""
    if not INDEX_PATH.is_file():
        return None
    try:
        return json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


async def load_knowledge_base() -> KnowledgeBase:
    """Lädt den Index aus dem Cache oder baut ihn neu (ein Embedding-Batch-Call)."""
    files = _read_files()
    documents = _parse_documents(files)
    index_hash = _index_hash(files)

    cached = _read_cache()
    if cached and cached.get("hash") == index_hash:
        chunks = [Chunk(doc=c["doc"], heading=c["heading"], text=c["text"]) for c in cached["chunks"]]
        matrix = (
            np.array([c["vector"] for c in cached["chunks"]], dtype=np.float32)
            if chunks
            else np.zeros((0, 0), dtype=np.float32)
        )
        return KnowledgeBase(documents, chunks, matrix, from_cache=True)

    chunks = [chunk for document in documents for chunk in chunk_document(document)]
    if not chunks:
        return KnowledgeBase(documents, [], np.zeros((0, 0), dtype=np.float32), from_cache=False)

    matrix = await embed_texts([chunk.text for chunk in chunks])
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(
        json.dumps(
            {
                "hash": index_hash,
                "model": settings.embedding_model,
                "chunks": [
                    {"doc": c.doc, "heading": c.heading, "text": c.text, "vector": v}
                    for c, v in zip(chunks, matrix.tolist())
                ],
            }
        ),
        encoding="utf-8",
    )
    return KnowledgeBase(documents, chunks, matrix, from_cache=False)


_kb: KnowledgeBase | None = None
_kb_lock = asyncio.Lock()


async def get_knowledge_base() -> KnowledgeBase:
    """Liefert die geladene Wissensbasis; lädt sie beim ersten Zugriff.

    Der Lock verhindert, dass parallele erste Requests doppelt embedden,
    falls der Load im Lifespan fehlgeschlagen ist.
    """
    global _kb
    if _kb is None:
        async with _kb_lock:
            if _kb is None:
                _kb = await load_knowledge_base()
    return _kb
