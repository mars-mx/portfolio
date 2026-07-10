---
title: Web und Infrastruktur
description: Wie Marius mit Python, FastAPI, TypeScript, React, Next.js, PostgreSQL, Docker, Kubernetes, Terraform und AWS arbeitet, jeweils mit konkreten Projekten und Stationen.
---

Überblick über die Web- und Infrastrukturtechnologien, mit denen Marius
arbeitet: was er mit der jeweiligen Technologie gebaut hat und woher die
Erfahrung stammt. Details zu den Projekten stehen in der Projekthistorie.

## Python und FastAPI

Python ist Marius' Hauptsprache seit 2019: professionelle Entwicklung in
großen Codebasen bei CONTACT Software, danach durchgehend in eigenen und
Kundenprojekten. Für Backends ist FastAPI sein Standard: bei seinem
SaaS-Produkt Copyhero, im KI-Telefonassistenten (Kundenauftrag) und im
Backend des Assistenten auf mxdigital.de. Im PLM-Umfeld customized er
außerdem bestehende Python-Schnittstellen auf Basis von Morepath.

## TypeScript, React und Next.js

Im Frontend arbeitet Marius mit TypeScript und React. Er hat für einen
Kunden aus der Chemiebranche einen Legacy CORBA Client eines PLM-Systems in
eine moderne React SPA migriert, React bereits beim Aufbau des CONTACT
Portals eingesetzt und nutzt Next.js unter anderem für das Dashboard des
KI-Telefonassistenten (Kundenauftrag) und für mxdigital.de selbst.

## PostgreSQL

Für relationale Datenhaltung setzt Marius auf PostgreSQL: bei Copyhero trägt
es die mandantenfähige Nutzer- und Abrechnungsstruktur und übernimmt mit
pgvector zusätzlich die Vektorsuche. In einem E-Commerce-Projekt zur
Produktdaten-Automatisierung lief die Datenhaltung auf AWS RDS.

## Docker und Kubernetes

Marius kennt den Betrieb von Software in Kubernetes aus der Praxis, nicht
nur vom Deployment-Manifest: Das CONTACT Portal, an dem er mitgebaut hat,
war die erste Anwendung von CONTACT Software, die produktiv in Kubernetes
lief, und er arbeitete eng mit dem Cloud Ops Team zusammen, als die ersten
SaaS-Kunden live gingen. Heute betreibt er sein SaaS-Produkt Copyhero in
Kubernetes; Docker ist als Container-Grundlage in allen seinen Deployments
gesetzt.

## Terraform und AWS

Infrastructure as Code mit Terraform kennt Marius aus dem Enterprise-Umfeld
bei CONTACT Software. Mit AWS arbeitet er seit 2019: produktiver Betrieb des
CONTACT Portals, serverlose Verarbeitung mit Lambda und SQS bei Copyhero
(asynchrone AI-Processing-Queue) sowie in einem E-Commerce-Projekt zur
automatisierten Pflege eines Google-Shopping-Feeds.
