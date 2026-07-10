---
title: PLM-Migration von CORBA zur Web-App
description: Hintergrund zum Migrationsprojekt von Marius (seit 2024, Kunde aus der Chemiebranche): Legacy User Exits und Customizing eines PLM-Systems von CONTACT Software für das Web UI umbauen.
---

Marius migriert seit 2024 als Freelancer für einen Kunden aus der
Chemiebranche einen Legacy CORBA Client des PLM-Systems von CONTACT Software
in eine moderne Webanwendung (React SPA). Die eigentliche Arbeit steckt dabei
weniger im neuen Frontend als im gewachsenen Customizing dahinter.

## Hauptproblem: bestehendes Customizing in User Exits

Das Hauptproblem der Migration: Das bestehende Customizing liegt als User
Exits vor, und wesentliche APIs daraus sind im Web UI nicht mehr vorhanden.
Die Legacy User Exits lassen sich deshalb nicht einfach übernehmen, sondern
müssen analysiert und in User Exits überführt werden, die das Web UI
unterstützt.

## Vorgehen

Marius' Vorgehen bei der Migration:

- Analyse der bestehenden Geschäftsprozesse und Fachobjekte
- Überführung der Legacy User Exits in User Exits, die im Web UI funktionieren
- Anpassung der Konfiguration für die webspezifische Darstellung von
  Fachobjekten

## Klassische Fehlerquellen

Klassische Fehlerquellen bei der Migration von Customizing ins Web UI:
Post Mask Handling, File Handling und Maskenupdates über PowerScript
Customizing. Nichts davon übernimmt das Web UI nativ; jede dieser Funktionen
braucht eigenes Customizing, um migriert zu werden. Marius kennt diese
Stolpersteine aus der Praxis.
