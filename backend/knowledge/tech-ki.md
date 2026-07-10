---
title: KI-Technologien
description: Wie Marius mit RAG, Pydantic AI, Function Calling, MCP, Vektordatenbanken (Qdrant, pgvector), den APIs von OpenAI, Anthropic und Gemini, Context Engineering sowie Evals arbeitet, jeweils mit konkreten Projekten.
---

Überblick über die KI-Technologien, mit denen Marius arbeitet: was die
jeweilige Technologie ist und in welchen Projekten er sie produktiv
eingesetzt hat. Details zu den Projekten selbst stehen in der Projekthistorie.

## RAG (Retrieval Augmented Generation)

RAG verbindet ein Sprachmodell mit eigenen Daten: relevante Abschnitte werden
per semantischer Suche gefunden und dem Modell als Kontext mitgegeben, damit
es belegt antwortet statt zu halluzinieren. Marius hat mehrere RAG-Systeme
produktiv gebaut: die Wissensdatenbank eines KI-Telefonassistenten
(Kundenauftrag, mit Latenzoptimierung für den Einsatz im Telefonat, auf Basis
von Qdrant), Vektorsuche mit pgvector bei seinem SaaS-Produkt Copyhero und
den Assistenten auf mxdigital.de, der auf einer dateibasierten Wissensbasis
mit Embedding-Index sucht. Wichtiger als Framework-Magie sind ihm dabei
sauberes Grounding, durchdachtes Chunking und messbare Suchqualität.

## Pydantic AI

Pydantic AI ist ein Python Framework für LLM-Agenten vom Team hinter
Pydantic: typsichere Tool-Definitionen, strukturierte Ausgaben und eine
provider-agnostische Modellanbindung. Für Marius ist es das Standardwerkzeug
für Agentensysteme: Er setzt es bei Copyhero ein (SaaS für KI-Produktseiten,
dort verantwortet er als Gründer und CTO die LLM-Integration), und auch der
Assistent auf mxdigital.de läuft als Agent auf Basis von Pydantic AI mit
angebundener Wissensbasis.

## Tool-Anbindung: Function Calling und MCP

Damit Agenten wirklich arbeiten, müssen sie Systeme und Daten ansprechen
können. Marius bindet Agenten über Function Calling und MCP (Model Context
Protocol) an: im KI-Telefonassistenten (Kundenauftrag) unter anderem
Kalender- und Drittsystem-Integrationen über FastMCP, in einem Projekt zur
KI-gestützten Leadgenerierung (Automotive) MCP in einem automatisierten
Workflow mit SERP-Recherche und LLM-Analyse.

## Vektordatenbanken: Qdrant und pgvector

Semantische Suche braucht einen Index für Embeddings. Marius wählt das
Werkzeug nach Anforderung: Qdrant als eigenständige Vektordatenbank im
KI-Telefonassistenten (Kundenauftrag, latenzkritisch), pgvector für
Vektorsuche direkt in PostgreSQL bei Copyhero, und für kleine Wissensbasen
bewusst auch einen einfachen dateibasierten Embedding-Index wie beim
Assistenten auf mxdigital.de.

## LLM-Provider: OpenAI, Anthropic und Gemini

Marius arbeitet provider-agnostisch mit den APIs und SDKs von OpenAI,
Anthropic und Google (Gemini). Die Modellwahl richtet sich nach dem
Anwendungsfall (Qualität, Latenz, Kosten); durch Abstraktion über Frameworks
wie Pydantic AI bleiben Modelle austauschbar, statt eine Anwendung an einen
Anbieter zu ketten.

## Context Engineering

Context Engineering ist die Disziplin hinter zuverlässigen LLM-Systemen:
gezielt gestalten, was das Modell wann sieht. Dazu gehören Prompt-Design,
Memory, Retrieval und der Umgang mit dem Token-Budget. Das ist einer von
Marius' drei Schwerpunkten (neben Enterprise-Agentensystemen und
Tool-Anbindung mit RAG): Prompts, Memory und Retrieval so gestaltet, dass
Ergebnisse messbar besser werden.

## Evals und Monitoring

Verlässliche LLM-Systeme brauchen Messung statt Bauchgefühl. Evals und
Monitoring gehören fest zu Marius' Leistungsangebot für Agentensysteme
(produktionsreif statt Proof of Concept). Im KI-Telefonassistenten
(Kundenauftrag) hat er die LLM-Evaluierung aufgebaut, mit der die Qualität
der Antworten systematisch geprüft wird.
