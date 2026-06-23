# Projektdokumentation – Sportler Webapplikation mit Strava-Integration

**Modul**: 210
**Projekt:** Public Cloud
**Autor:** Jasmin Brawand
**Klasse:** UIFZ-2425-005
**Datum:** 22.06.2026
**GitHub**: [Link zu GitHub](https://github.com/jabrawand/210_public_cloud)

---

## Inhaltsverzeichnis

- [1. Einleitung](#1-einleitung)
  - [1.1 Ausgangslage](#11-ausgangslage)
  - [1.2 Projektziel](#12-projektziel)
  - [1.3 Projektabgrenzung](#13-projektabgrenzung)
- [2. Analyse](#2-analyse)
  - [2.1 Stakeholder](#21-stakeholder)
  - [2.2 Rollenmodell](#22-rollenmodell)
    - [2.2.1 Gast](#221-gast-unregistrierter-benutzer)
    - [2.2.2 User](#222-user-registrierter-benutzer)
    - [2.2.3 Sportler](#223-sportler-admin-benutzer)
  - [2.3 User Stories](#23-user-stories)
    - [2.3.1 Rolle Gast](#231-rolle-gast-unregistrierter-benutzer)
  - [3. Planung](#3-planung)
  - [3.2 Technologieauswahl](#32-technologieauswahl)
  - [3.3 Systemarchitektur](#33-systemarchitektur)
- [4. Umsetzung](#4-umsetzung)
- [5. Test](#5-test)
  - [5.1 Teststrategie](#51-teststrategie)
  - [5.3 Abnahmetests – User Stories](#53-abnahmetests--user-stories)
  - [5.5 Sicherheits- und RLS-Tests](#55-sicherheits--und-rls-tests)
  - [5.7 Automatisierte Unit-Tests (Vitest)](#57-automatisierte-unit-tests-vitest)
  - [5.8 Testzusammenfassung](#58-testzusammenfassung)

---

## 1. Einleitung

Dieses Dokument beschreibt die Planung, Umsetzung und Prüfung einer Fullstack-Webapplikation im Rahmen des Moduls **210 – Public Cloud**. Die Anwendung dient als persönliche Sportler-Plattform: Sie bündelt Trainings- und Wettkampfinformationen an einem Ort und macht sie für unterschiedliche Zielgruppen zugänglich.

Der Auftraggeber ist Jan Brawand, ein ambitionierter Ausdauersportler mit Fokus auf Triathlon. Sein sportliches Ziel ist der **Ironman Thun 2027**. Trainings werden regelmässig mit Garmin-Geräten aufgezeichnet und über Strava mit der Community geteilt. Für Sponsoren, Familie, Freunde und interessierte Fans soll jedoch mehr als ein Strava-Profil sichtbar sein: ein strukturierter, professioneller Webauftritt mit Wettkampfplanung, Trainingsübersicht und rollenbasierter Detailansicht.

Das Projekt wurde als **Einzelarbeit** im Zeitraum vom 15.06.2026 bis zum 27.06.2026 durchgeführt. Technisch liegt der Schwerpunkt auf Cloud-Diensten (Supabase), einer modernen React-Oberfläche und der Anbindung der Strava-API als externe Datenquelle.

### 1.1 Ausgangslage

#### Trainingserfassung und bestehende Systeme

Im Alltag des Sportlers laufen Trainingsdaten über eine etablierte Kette ab:

1. **Erfassung** – Lauf-, Rad- und Schwimmeinheiten werden mit Garmin-Uhren und -Sensoren aufgezeichnet (Distanz, Dauer, Höhe, Leistung, Herzfrequenz).
2. **Synchronisation** – Die Rohdaten werden automatisch an **Strava** übertragen und dort als Aktivitäten gespeichert.
3. **Veröffentlichung** – Auf Strava sind Trainings für Follower sichtbar; Karten, Grundstatistiken und soziale Funktionen stehen zur Verfügung.

Strava eignet sich damit gut als zentrale Quelle für **objektive Trainingsdaten**. Für den geplanten Webauftritt reicht das allein nicht aus.

#### Problemstellung

Trotz der vorhandenen Strava-Anbindung fehlt eine **eigene, kontrollierte Präsentationsplattform**. Konkret zeigen sich folgende Lücken:

| Bereich | Ist-Zustand | Auswirkung |
| ------- | ----------- | ---------- |
| Wettkämpfe | Termine, Ziele und Ergebnisse liegen verstreut (Kalender, Notizen, Event-Websites) | Kein einheitlicher Raceplan für Dritte |
| Trainingsübersicht | Strava zeigt alle Aktivitäten gleichwertig; Filter und Darstellung sind generisch | Sponsoren und Fans sehen nicht gezielt die für sie relevanten Informationen |
| Trainingsdetails | Leistungswerte (Watt, Herzfrequenz, Streckenprofil) sind auf Strava vorhanden, aber nicht in einer eigenen Oberfläche kuratiert | Kein differenzierter Zugang zwischen Öffentlichkeit und registrierten Interessenten |
| Identität & Story | Persönliche Angaben (Steckbrief, Motivation, sportliche Vergangenheit) sind auf Strava nur begrenzt darstellbar | Der Auftritt wirkt weniger wie ein professionelles Sportler-Portfolio |
| Verwaltung | Manuelle Pflege mehrerer Informationskanäle | Erhöhter Aufwand für den Sportler |

Aus Sicht der Stakeholder (vgl. Abschnitt 2.1) entsteht so ein **Informationsdefizit**: Unregistrierte Besucher erhalten keinen kompakten Überblick über Ziel, kommende Wettkämpfe und Trainingsfortschritt. Registrierte Nutzer können zwar auf Strava tiefer einsteigen, haben aber keinen dedizierten Zugang zu aufbereiteten Detaildaten innerhalb einer eigenen Marke.

#### Ableitung des Projektbedarfs

Aus der Ausgangslage folgt die Notwendigkeit einer **eigenen Webapplikation**, die:

- öffentliche Inhalte (Home, About, Raceplan, Trainingsliste) zentral bereitstellt,
- detaillierte Trainingsdaten nur für registrierte Benutzer freigibt,
- Wettkampfdaten vom Sportler selbst verwaltbar macht,
- Trainings automatisch aus Strava übernimmt, statt sie manuell zu erfassen.

Damit wird Strava nicht ersetzt, sondern als **Backend-Datenquelle** genutzt; die Webapplikation übernimmt Präsentation, Zugriffssteuerung und Wettkampfverwaltung.

### 1.2 Projektziel

#### Hauptziel

Ziel des Projekts ist die Entwicklung einer **Fullstack-Webapplikation**, mit der der Sportler seine sportliche Präsenz online abbilden kann. Besucher sollen auf einen Blick Ziel, Person und kommende Events erkennen; registrierte Nutzer sollen vertiefte Einblicke in einzelne Trainingseinheiten erhalten.

#### Funktionale Ziele

Die Anwendung soll folgende Kernfunktionen umsetzen:

| Nr. | Ziel | Kurzbeschreibung |
| --- | ---- | ---------------- |
| Z1 | Öffentliche Informationsseiten | Startseite, About-Seite und Navigation ohne Login |
| Z2 | Wettkampfplan | Anzeige geplanter und vergangener Rennen inkl. Verlinkung zu offiziellen Event-Seiten |
| Z3 | Trainingsübersicht | Liste synchronisierter Strava-Aktivitäten mit Filter nach Sportart |
| Z4 | Trainingsdetails | Detailansicht mit Karte, Statistiken und Leistungswerten (nur für eingeloggte User) |
| Z5 | Benutzerkonten | Registrierung, Login, Logout, Profilverwaltung und Kontolöschung |
| Z6 | Rollenmodell | Unterscheidung zwischen Gast, registriertem Benutzer und Sportler (Admin) |
| Z7 | Wettkampfverwaltung | Der Sportler kann Raceplan-Einträge erstellen, bearbeiten und löschen |
| Z8 | Strava-Integration | OAuth-Anbindung und serverseitige Synchronisation von Aktivitäten |

Die funktionalen Ziele werden in Abschnitt 2.4 als nummerierte Anforderungen (F1–F18) präzisiert und in Abschnitt 2.3 über User Stories mit Akzeptanzkriterien abgesichert.

#### Technische und qualitative Ziele

Neben den fachlichen Funktionen verfolgt das Projekt folgende technische Leitplanken:

- **Cloud-natives Backend** mit Supabase (PostgreSQL, Auth, Storage, Edge Functions) statt eigenem Server-Betrieb
- **Sichere Zugriffskontrolle** durch Supabase Auth und Row Level Security (RLS) auf Datenbankebene
- **Serverseitige Strava-Anbindung**, damit API-Tokens nicht im Browser exponiert werden
- **Responsives Webdesign** für Desktop und mobile Browser (keine native App)
- **Wartbare Codebasis** mit klarer Trennung von Frontend, Datenbank und Integrationslogik

#### Erfolgskriterien

Das Projekt gilt als erfolgreich umgesetzt, wenn:

1. Gäste Home, About, Raceplan und die Trainingsübersicht ohne Anmeldung nutzen können.
2. Registrierte Benutzer Trainingsdetails einsehen und ihr Profil verwalten können.
3. Der Sportler als Administrator den Raceplan per CRUD-Oberfläche pflegen kann.
4. Strava-Aktivitäten über die Edge Functions in die Datenbank synchronisiert und in der UI angezeigt werden.
5. Berechtigungen (öffentlich vs. geschützt vs. Admin) durch RLS und Frontend-Routing durchgesetzt werden.
6. Die Anwendung auf gängigen Browsern responsiv funktioniert.

### 1.3 Projektabgrenzung

Die Abgrenzung definiert den **Leistungsumfang** des Modulprojekts. Alles ausserhalb dieser Grenzen wurde bewusst zurückgestellt, um den begrenzten Zeitraum (ca. 50 geplante Stunden) realistisch einzuhalten.

#### Im Projektumfang enthalten

| Bereich | Umfang |
| ------- | ------ |
| Frontend | Single-Page-Application mit **React** und **Vite**; Seiten: Home, About, Login, Signup, Raceplan, Activities, Activity Details, Profil |
| Backend | **Supabase**: PostgreSQL-Datenbank, Auth, Storage (Bucket `images`), Edge Functions |
| Authentifizierung | E-Mail/Passwort-Registrierung und -Login über Supabase Auth; JWT-basierte Sessions |
| Rollenmodell | Drei Rollen: **Gast** (ohne Konto), **User** (registriert), **Sportler** (Admin mit `role = admin`) |
| Datenverwaltung | CRUD für Wettkämpfe (`races`) durch den Sportler; Lesen von Trainings (`strava_activities`) |
| Strava | OAuth 2.0, Token-Speicherung in `strava_connection`, Synchronisation per Edge Function (manueller Sync-Button in der UI; Webhook-Infrastruktur vorbereitet) |
| Sicherheit | RLS-Policies für `profiles`, `races` und `strava_activities`; geschützte Routen im Frontend |
| Medien | Bilder für Home und About über Supabase Storage |
| Tests | Manuelle Abnahmetests nach User Stories; automatisierte Unit-Tests (Vitest) für ausgewählte Module |
| Dokumentation | Projektdokumentation, Arbeitsjournal, README |

#### Bewusst nicht im Projektumfang

| Ausschluss | Begründung |
| ---------- | ---------- |
| Native Mobile-App (iOS/Android) | Fokus auf Webtechnologien gemäss Modul; responsives Design deckt mobile Nutzung ab |
| Mehrsprachigkeit | Auftraggeber und Zielpublikum deutschsprachig; UI teilweise Englisch, keine i18n-Infrastruktur |
| Social-Media-Funktionen (Kommentare, Likes, Teilen) | Strava deckt soziale Interaktion ab; nicht Teil der Sportler-Plattform |
| Push-Benachrichtigungen | Kein eigener Notification-Dienst vorgesehen |
| Sponsoring-, Spenden- oder Zahlungsfunktionen | Rechtlicher und technischer Zusatzaufwand; ausserhalb Modulumfang |
| Multi-Tenant / mehrere Sportler | Plattform ist auf **einen** Sportler (den Auftraggeber) ausgelegt |
| Manuelle Trainingserfassung | Trainings stammen ausschliesslich aus Strava; kein Formular zum manuellen Anlegen |
| Vollständige Webhook-Produktivlösung | Webhook-Verarbeitung wurde implementiert, in der Praxis wurde aus Zeitgründen auf manuellen Sync per UI-Button gesetzt (vgl. Arbeitsjournal 22.06.26) |
| Eigenes Server-Backend (Node/Express) | Supabase als BaaS reduziert Infrastrukturaufwand (vgl. Abschnitt 3.2) |

#### Organisatorische Rahmenbedingungen

- **Projektform:** Einzelarbeit
- **Zeitraum:** 15.06.2026 – 27.06.2026
- **Modul:** 210 Public Cloud (Fullstack-Anwendung mit Cloud-Backend und externer API)
- **Auftraggeber:** Jan Brawand (Sportler und fachlicher Ansprechpartner)
- **Entwicklung:** Jasmin Brawand

Diese Rahmenbedingungen flossen in die Arbeitsplanung (Abschnitt 3.1) und die Priorisierung der Arbeitspakete ein: Zuerst Anforderungen und Datenmodell, danach Backend und Strava-Anbindung, anschliessend Frontend und Tests.

---

## 2. Analyse

### 2.1 Stakeholder


| Stakeholder             | Interesse                                    |
| ----------------------- | -------------------------------------------- |
| Sportler / Admin        | Verwaltung von Wettkampfdaten                |
| Registrierte Benutzer   | Detailierte Trainingsinformationen           |
| Unregistrierte Benutzer | Öffentliche Informationen                    |


*Tabelle 2.1 - Stakeholderanalyse*

### 2.2 Rollenmodell

#### 2.2.1 Gast (unregistrierter Benutzer)

- Startseite ansehen
- Informationen über Sportler ansehen
- Wettkämpfe ansehen
- Trainingsübersicht ansehen
- Registrieren

#### 2.2.2 User (registrierter Benutzer)

- Alle Gast-Funktionen
- Trainigsdetails ansehen
- Eigenes Profil verwalten
- Konto löschen

#### 2.2.3 Sportler (Admin Benutzer)

- Alle User-Funktionen
- Wettkämpfe verwalten

### 2.3 User Stories

#### 2.3.1 Rolle: Gast (unregistrierter Benutzer)

##### US1: Startseite anzeigen

**Als Gast möchte ich** die Startseite aufrufen können, damit ich einen ersten Überblick über die Webapplikation erhalte.

**Akzeptanzkriterien**

- Die Startseite ist ohne Anmeldung erreichbar.
- Die Seite zeigt allgemeine Informationen wie Vorname, Nachname und Ziel des Sportlers.
- Die Navigation ist sichtbar.

---

#### US2: About-Seite anzeigen

**Als Gast möchte ich** die About-Seite ansehen können, damit ich mehr über den Sportler erfahre.

**Akzeptanzkriterien**

- Die About-Seite ist ohne Anmeldung erreichtbar.
- Informationen über den Sportler wie Steckbrief und Bild werden angezeigt.
- Die Seite kann über die Navigation aufgerufen werden.

---

#### US3: Raceplan anzeigen

**Als Gast möchte ich** die Wettkämpfe sehen können, damit weiss wann welche Events anstehen.

**Akzeptanzkriterien**

- Die Wettkampf-Seite ist ohne Anmeldung erreichbar.
- Alle geplanten Wettkämpfe werden angezeigt.
- Ein Link führt zu der offiziellen Wettkampf-Seite.

---

#### US4: Trainingsübersicht anzeigen

**Als Gast möchte ich** die Aktivitäten ansehen können, damit ich einen Überblick über die absolvierten Trainings  bekomme.

**Akzeptanzkriterien**

- Die Trainingsseite ist ohne Anmeldung erreichbar.
- Trainings werden in einer Liste dargestellt.
- Trainings können nach Sportart gefiltert werden.
- Detailinformationen sind für Gäste nicht sichtbar.

---

#### US5: Registrieren

**Als Gast möchte ich** ein Benutzerkonto erstellen können, damit ich auf zusätzliche Inhalte zugreifen kann.

**Akzeptanzkriterien**

- Ein Registrierungsformular ist über den Login-Button erreichbar.
- Benutzername, E-Mail und Passwort können eingegeben werden.
- Nach erfolgreicher Registrierung wird ein Benutzerkonto erstellt.

---

#### Rolle: User (registrierter Benutzer)

#### US6: Trainingsdetails anzeigen

**Als User möchte ich** Trainingsdetails ansehen können, damit ich genaue Informationen zu den einzelnen Trainingseinheiten bekomme.

**Akzeptanzkriterien**

- Nur angemeldete Benutzer können Trainingsdetails öffnen.
- Detailinformationen wie Herzfrequenz, Watt und Leistung werden vollständig angezeigt.
- Es kann zurück zur Trainingsübersicht navigiert werden.

---

#### US7: Benutzername verwalten

**Als User möchte ich** meinen Benutzernamen bearbeiten können, damit meine Profildaten aktuell bleiben.

**Akzeptanzkriterien**

- Ein Profilbereich ist vorhanden.
- Der Benutzername kann geändert werden.
- Änderungen werden gespeichert.
- Nach dem Speichern wird der neue Benutzername angezeigt.

---

#### US8: Konto löschen

**Als User möchte ich** mein Konto löschen können, damit ich die Plattform wie der verlassen kann.

**Akzeptanzkriterien**

- Eine Funktion zum Löschen des Kontos ist verfügbar.
- Vor dem Löschen wird eine Bestätigung verlangt.
- Das Benutzerkonto wird dauerhaft entfernt.
- Der Benutzer wird nach dem Löschen automatisch abgemeldet.

---

#### Rolle: Sportler (Admin Benutzer)

#### US9: Raceplan-Einträge erstellen

**Als Sportler möchte ich** neue Wettkämpfe anlegen können, damit die Besucher aktuelle Wettkampftermine sehen.

**Akzeptanzkriterien**

- Kann einen neuen Eintrag erstellen.
- Pflichtfelder werden angezeigt und müssen ausgefüllt werden.
- Der Eintrag ist nach dem Speichern im Raceplan ersichtlich.

---

#### US10: Raceplan-Einträge bearbeiten

**Als Sportler möchte ich** bestehende Einträge im Raceplan bearbeiten können, damit ich nach einem Wettkampf das Resultat eintragen kann.

**Akzeptanzkriterien**

- Vorhandene Einträge können ausgewählt werden.
- Änderungen können gespeichert werden.
- Die aktualisierten Daten werden im Raceplan korrekt angezeigt.

---

#### US11: Raceplan-Einträge löschen

**Als Sportler möchte ich** Raceplan-Einträge löschen können, damit veraltete oder abgesagte Wettkämpfe entfernt werden können.

**Akzeptanzkriterien**

- Vorhandene Einträge können ausgewählt und gelöscht werden.
- Vor dem entgültigen Löschen wird eine Bestätigung verlangt.
- Nach dem Löschen ist der Eintrag nicht mehr im Raceplan zu sehen.

---

### 2.4 Anforderungen

#### 2.4.1 Funktionale Anforderungen

| ID | Anforderung |
| -- | ----------- |
| F1 | Die Webapplikation stellt eine öffentlich zugängliche Startseite mit Informationen zum Sportler bereit |
| F2 | Die Webapplikation stellt eine öffentlich zugängliche Informations-Seite mit Steckbrief und Bild des Sportlers bereit |
| F3 | Die Webapplikation stellt eine öffentlich zugänglichen Wettkampf-Seite mit geplanten und vergangenen Wetkämpfen inklusive Verlinkung zu den offiziellen Veranstaltungsseiten bereit |
| F4 | Die Webapplikation stellt eine öffentlich zugängliche Trainingsübersicht bereit |
| F5 | Trainings können nach Sportart gefiltert werden |
| F6 | Benutzer können sich registrieren und ein Benutzerkonto erstellen
| F7 | Registrierte Benutzer können sich an- und abmelden |
| F8 | Registrierte Benutzer können detaillierte Trainingsinformationen einsehen |
| F9 | Registrierte Benutzer ihren Benutzernamen bearbeiten |
| F10 | Registrierte Benutzer können ihr Benutzerkonto dauerhaft löschen |
| F11 | Administratoren können Wettkampf-Einträge erstellen |
| F12 | Administratoren können Wettkampf-Einträge bearbeiten |
| F13 | Administratoren können Wettkampf-Einträge löschen |
| F14 | Die Anwendung unterscheidet sich zwischen den Rollen Gast, Benutzer und Administrator |
| F15 | Der Zugriff auf geschützte Inhalte erfolgt nur nach erfolgreicher Authentifizierung |
| F16 | Trainingsdetails sind ausschliesslich für registrierte Benutzer sichtbar |
| F17 | Wettkampf- und Trainingseinträge werden zentral in einer Datenbank gespeichert |
| F18 | Änderungen an Trainings- und Wettkampf-Daten werden unmittelbar in der Anwendung angezeigt |

#### 2.4.2 Nicht-Funktionale Anforderungen

| ID | Anforderung |
| -- | ------------ |
| NF1 | Die Anwendung muss über aktuelle Webbrowser nutzbar sein |
| NF2 |	Die Benutzeroberfläche muss responsiv sein und auf Desktop sowie mobilen Endgeräten funktionieren |
| NF3 |	Benutzerkonten müssen durch eine sichere Authentifizierung geschützt werden |
| NF4 |	Rollen und Berechtigungen müssen mittels Row Level Security (RLS) abgesichert werden |
| NF5 |	Personenbezogene Daten werden in einer PostgreSQL-Datenbank innerhalb von Supabase gespeichert |
| NF6 |	Die Anwendung muss eine intuitive und übersichtliche Benutzeroberfläche bereitstellen |
| NF7 |	Ungültige Benutzereingaben werden validiert und dem Benutzer verständlich angezeigt |
| NF8 |	Änderungen an Benutzerdaten, Trainings und Raceplan-Einträgen müssen dauerhaft gespeichert werden |

---

## 3. Planung

### 3.1 Arbeitsplanung

Das Projekt wurde im Zeitraum vom **15.06.2026** (Start) bis zum **27.06.2026** (Projektabschluss) als Einzelarbeit durchgeführt. Die Arbeitsplanung wurde in sinnvolle, kleinere Arbeitspakete eingeteilt. Dadurch konnte eine strukturierte und zielgerichtete Umsetzung sichergestellt werden.

| Arbeitspaket | Beschreibung                                            | geschätzter Aufwand | effektiver Aufwand |
| ------------ | ------------------------------------------------------- | ------------------- | ------------------ |
| AP1          | Anforderungsanalyse, User Stories und Projektplanung    | 4 Stunden           |  2 Stunden         |
| AP2          | Architektur, Datenmodell und Systemdesign               | 3 Stunden           |  2 Stunden         |
| AP3          | Backend (Supabase, Datenmodell Rollen, CRUD)            | 8 Stunden           |  Stunden           |
| AP4          | Strava-API-Integration (OAuth, Token-Management, Webhooks) | 8 Stunden   |  Stunden           |
| AP5          | Frontend (React, Routing, Views, Formulare)         | 8 Stunden          |  Stunden           |
| AP6          | Integration und Deployment                         | 3 Stunden           |  Stunden           |
| AP7          | Testdurchführung, Fehlerbehebung und Abnahmetests    | 4 Stunden           |  Stunden           |
| AP8          | Sicherheitskonzept und Projektdokumentation         | 5 Stunden           |  Stunden           |
| AP9          | Vorbereitung Fachgespräch                           | 2 Stunden           |  Stunden           |
| AP10         | Zeitreserve / Puffer für unvorhergesehenes          | 5 Stunden           |  Stunden           |

*Tabelle 3.1 – Zeitliche Arbeitsplanung als Arbeitspakete*

---

### 3.2 Technologieauswahl

Für die Umsetzung der Webapplikation wurden Technologien gewählt, die zum Modul **210 Public Cloud** passen: schnelle Entwicklung ohne eigenes Server-Backend, sichere Authentifizierung, Cloud-Datenbank und Anbindung einer externen REST-API (Strava).

#### Auswahlkriterien

| Kriterium | Bedeutung für das Projekt |
| --------- | ------------------------- |
| Cloud-Fähigkeit | Hosting und Backend in der Public Cloud (Supabase) |
| Entwicklungsgeschwindigkeit | Einzelprojekt mit begrenztem Zeitbudget (15.–27.06.2026) |
| Sicherheit | Auth, RLS und serverseitige Strava-Integration (NF3, NF4) |
| Wartbarkeit | Klare Trennung Frontend / Backend / externe API |
| Kosten | Nutzung kostenfreier Tiers für Lern- und Demo-Zwecke |

*Tabelle 3.2 – Auswahlkriterien für Technologien*

#### Technologieübersicht

| Bereich | Technologie | Version / Anmerkung | Einsatz im Projekt |
| ------- | ----------- | ------------------- | ------------------ |
| Laufzeit / Build | Node.js, Vite | Vite 8.x | Entwicklungsserver, Production-Build |
| Frontend-Framework | React | 19.x | UI-Komponenten, Routing, State |
| Routing | React Router | 7.x | Öffentliche und geschützte Seiten |
| Backend (BaaS) | Supabase | Cloud | Auth, DB, Storage, Edge Functions |
| Datenbank | PostgreSQL | via Supabase | profiles, races, strava_activities |
| Authentifizierung | Supabase Auth | JWT | Registrierung, Login, Session |
| Datei-Speicher | Supabase Storage | Bucket `images` | Bilder auf Home und About |
| Serverlogik | Supabase Edge Functions | Deno | Strava OAuth, Sync, Webhook |
| Externe API | Strava API v3 | REST + Webhooks | Trainingsdaten des Sportlers |
| Karten | Leaflet, react-leaflet | 1.9 / 5.x | Routenanzeige in Trainingsdetails |
| Polyline | @mapbox/polyline | 1.2.x | Decoding der Strava-Routen |
| Tests | Vitest, Testing Library | Vitest 4.x | Unit-Tests für Utils und Auth-Guard |
| Qualitätssicherung | ESLint | 10.x | Statische Code-Analyse |
| Versionsverwaltung | Git / GitHub | — | Quellcode, Dokumentation, Deployment |

*Tabelle 3.3 – Technologieübersicht*

#### Begründung der einzelnen Technologien

**React mit Vite**

React wurde gemäss Projektabgrenzung (Abschnitt 1.3) als Frontend-Framework festgelegt. Vite ergänzt React als modernes Build-Tool mit schnellem Dev-Server und schlankem Production-Build. Für eine übersichtliche UI mit mehreren Seiten (Home, About, Raceplan, Activities, Profil) eignet sich die komponentenbasierte Architektur von React.

**Supabase als Backend**

Statt ein eigenes Node-/Express-Backend zu betreiben, wurde Supabase als **Backend-as-a-Service** gewählt. Damit steht in einer Plattform folgendes bereit:

* **PostgreSQL** für strukturierte Daten (Wettkämpfe, Profile, Aktivitäten)
* **Auth** für Benutzerkonten und JWT-basierte Sessions
* **Row Level Security (RLS)** für rollenbasierte Zugriffe (Gast, User, Admin)
* **Storage** für öffentliche Bilder ohne separaten Dateiserver
* **Edge Functions** für sichere Strava-Integration ohne API-Keys im Frontend

Diese Kombination reduziert Infrastruktur-Aufwand und entspricht dem Cloud-Fokus des Moduls.

**PostgreSQL und RLS**

PostgreSQL ist robust, relational und gut für die vorliegenden Entitäten (Profile, Races, Activities) geeignet. RLS-Policies werden direkt in der Datenbank definiert und gelten unabhängig vom Frontend — wichtig für NF4 und für geschützte Trainingsdetails (F16).

**Strava API**

Da die Trainingsdaten des Auftraggebers bereits in Strava vorliegen, ist die Strava API v3 die naheliegende Quelle. OAuth 2.0 ermöglicht die Autorisierung; ein **Webhook** synchronisiert einzelne Aktivitäten bei Create/Update/Delete automatisch, ein **manueller Vollsync** dient als Ergänzung. Die API wird ausschliesslich serverseitig (Edge Functions) aufgerufen.

**Leaflet und Mapbox Polyline**

Für die Darstellung der Trainingsroute in den Activity Details wird Leaflet als etablierte Open-Source-Kartenbibliothek verwendet. Strava liefert Routen als encoded Polyline (`summary_polyline`); `@mapbox/polyline` decodiert diese für die Karte.
*Hinweis: den Code für die Leaflet und Polyline Darstellung wurde mit Cursor generiert*

**Vitest und Testing Library**

Vitest ist nahtlos in Vite integriert und eignet sich für Unit-Tests der ausgelagerten Hilfsfunktionen (Filter, Formatierung, Stat-Gruppen) sowie für den Test des `ProtectedRoute`-Guards (vgl. Kap. 5.7).

**Git / GitHub**

Git dient der Versionskontrolle während der gesamten Projektlaufzeit. GitHub hostet das Repository und ermöglicht Nachvollziehbarkeit der Entwicklung für Abgabe und Fachgespräch.

#### Bewusst nicht gewählte Alternativen

| Alternative | Grund der Ablehnung |
| ----------- | ------------------- |
| Eigenes Node/Express-Backend | Höherer Aufwand; Supabase deckt Auth, DB und API bereits ab |
| Firebase | PostgreSQL und SQL-basierte RLS passen besser zum Datenmodell |
| Native Mobile App | Ausserhalb der Projektabgrenzung (Abschnitt 1.3) |
| Angular / Vue | React ist in der Aufgabenstellung vorgegeben |
| Eigener Kartenanbieter (Google Maps) | Leaflet ist kostenfrei und für Polyline-Darstellung ausreichend |

*Tabelle 3.4 – Abgelehnte Alternativen*

### 3.3 Systemarchitektur

Die Webapplikation folgt einer **BaaS-Architektur (Backend as a Service)**: Das React-Frontend kommuniziert ausschliesslich mit **Supabase**. Die Anbindung an **Strava** erfolgt serverseitig über **Supabase Edge Functions**, nicht direkt aus dem Browser.

**Datenflüsse:**

1. **Benutzer → Frontend → Supabase:** Login, CRUD für Races/Profile, Lesen der Aktivitäten (über PostgreSQL mit RLS)
2. **Strava → Edge Functions → PostgreSQL:** Webhook-Ereignisse (Einzelaktivität), optionaler Vollsync; Token-Pflege intern in Shared Modules
3. **Frontend → Supabase Storage:** Öffentliche Bilder (Home, About)

```text
                    +------------------+
                    |     Benutzer     |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |  React Frontend  |
                    |  (Browser / Vite)|
                    +--------+---------+
                             |
                             | HTTPS (Supabase JS Client)
                             v
              +--------------+--------------------------------+
              |              Supabase Plattform               |
              |  +----------+  +-----------+  +-------------+ |
              |  |   Auth   |  | PostgreSQL|  |   Storage   | |
              |  | (JWT)    |  | + RLS     |  |  (Bilder)   | |
              |  +----------+  +-----------+  +-------------+ |
              |                      ^                          |
              |                      |                          |
              |              +-------+--------+                 |
              |              | Edge Functions |                 |
              |              | (Webhook, Sync,|                 |
              |              |  OAuth)        |                 |
              |              +-------+--------+                 |
              +----------------------|--------------------------+
                                     |
                         +-----------+-----------+
                         |                       |
                         v                       v
                  +-------------+        +-------------+
                  | Strava API  |        | Strava      |
                  | (REST)      |        | Webhooks    |
                  +-------------+        +-------------+
```

**Hinweise zur Darstellung:**

| Aspekt | Begründung |
| ------ | ---------- |
| Kein direkter Frontend-Zugriff auf Strava | Access Tokens und API-Keys bleiben serverseitig in Edge Functions |
| Auth und DB unter Supabase | Beide Dienste gehören zur gleichen Plattform; das Frontend nutzt einen gemeinsamen Supabase-Client |
| RLS auf PostgreSQL | Rollen (Gast, User, Admin) werden auf Datenbankebene durchgesetzt (vgl. NF4) |
| Edge Functions als Integrationslayer | Webhook mit Hintergrundverarbeitung, Shared Modules für OAuth/Token-Refresh und Aktivitäten-Sync |

*Tabelle 3.5 – Erläuterung der Systemarchitektur*

### 3.4 Datenmodell

#### Tabelle profiles

| Attribut   | Datentyp     |
| ---------- | ------------ |
| id         | uuid (PK/FK) |
| username   | text         |
| role       | text         |
| created_at | timestamp    |

#### Tabelle races

| Attribut     | Datentyp   |
| ------------ | ---------- |
| id           | int8 (PK)  |
| name         | text       |
| location     | text       |
| country_code | varchar(2) |
| race_date    | date       |
| discipline   | text       |
| distance     | text       |
| event_link   | text       |
| goal         | text       |
| result       | text       |
| updated_at   | timestamp  |
| created_at   | timestamp  |

#### Tabelle strava_activities

| Attribut               | Datentyp  |
| ---------------------- | --------- |
| id                     | int8 (PK) |
| strava_activity_id     | int8      |
| namem                  | text      |
| sport_type             | text      |
| start_date             | timestamp |
| start_date_local       | timestamp |
| distance               | numeric   |
| moving_time            | int4      |
| elapsed_time           | int4      |
| total_elevation_gain   | numeric   |
| elev_low               | numeric   |
| elev_high              | numeric   |
| average_speed          | numeric   |
| max_speed              | numeric   |
| device_watts           | boolean   |
| average_watts          | numeric   |
| weighted_average_watts | numeric   |
| max_watts              | numeric   |
| has_heartrate          | boolean   |
| average_heartrate      | numeric   |
| max_heartrate          | numeric   |
| kilojoules             | numeric   |
| summary_polyline       | text      |
| start_latlng           | numeric   |
| end_lantlng            | numeric   |
| raw_data               | jsonb     |
| synced_at              | timestamp |
| created_at             | timestamp |
| updated_at             | timestamp |

#### Tabelle strava_connection

Speichert die OAuth-Verbindung zum Strava-Konto des Sportlers (eine Zeile, `id = 1`). Wird von den Edge Functions für Token-Refresh und Vollsync verwendet.

| Attribut      | Datentyp    |
| ------------- | ----------- |
| id            | int8 (PK)   |
| access_token  | text        |
| refresh_token | text        |
| expires_at    | timestamptz |
| last_sync     | timestamptz |
| updated_at    | timestamptz |
| created_at    | timestamptz |

#### Tabelle strava_webhook_events

Deduplizierung eingehender Strava-Webhook-Events. Strava kann dasselbe Event mehrfach senden; `event_id` ist eindeutig.

| Attribut | Datentyp |
| -------- | -------- |
| id | int8 (PK) |
| event_id | int8 (unique) |
| object_id | int8 |
| received_at | timestamptz |



## 4. Umsetzung

### 4.1 Entwicklungsumgebung

Folgende Werkzeuge wurden eingerichtet:

* Cursor
* Node.js
* React
* Git
* Supabase

### 4.2 Datenbank

Für die Speicherung der Daten wurde PostgreSQL von Supabase verwendet.

Erstellte Tabellen:

* profiles
* races
* strava_activities
* strava_connection
* strava_webhook_events

### 4.3 Authentifizierung

Die Authentifizierung wurde mit Supabase Auth umgesetzt.

Funktionen:

* Registrierung
* Login
* Logout
* Rollenprüfung

### 4.4 Strava Integration

Die Strava API wurde über OAuth 2.0 angebunden. Die serverseitige Logik liegt in **Supabase Edge Functions** unter `supabase/functions/`. Geteilte Hilfsmodule (`_shared/`) werden per TypeScript-Import eingebunden — es gibt keine HTTP-Aufrufe zwischen eigenen Functions.

#### Ordnerstruktur

```text
supabase/functions/
├── _shared/
│   ├── supabase.ts              # Admin-Client (Service Role)
│   ├── strava/
│   │   ├── types.ts             # Typen für Connection und Webhook-Events
│   │   ├── oauth.ts             # Token prüfen und bei Bedarf refreshen
│   │   ├── client.ts            # Strava REST API (Einzelaktivität, Listenabruf)
│   │   └── mapper.ts            # Mapping Strava → Datenbankzeile
│   └── sync/
│       ├── sync-activity.ts     # Eine Aktivität laden/löschen
│       └── sync-all.ts          # Vollsync seit last_sync (mit Pagination)
├── strava-webhook/
│   └── index.ts                 # Webhook-Endpoint (Haupteinstieg)
└── strava-sync/
    └── index.ts                 # Manueller Vollsync (POST)
```

#### Edge Functions

| Function | Endpoint | Zweck |
| -------- | -------- | ----- |
| `strava-webhook` | `GET/POST …/functions/v1/strava-webhook` | Strava-Webhook: Subscription-Verifikation und Event-Verarbeitung |
| `strava-sync` | `POST …/functions/v1/strava-sync` | Manueller Vollsync aller Aktivitäten seit `last_sync` |

Die OAuth-Autorisierung (`strava_auth`) wurde separat umgesetzt und speichert Access Token, Refresh Token und Ablaufzeit in `strava_connection`.

#### Webhook-Ablauf

Strava sendet bei neuen, geänderten oder gelöschten Aktivitäten ein POST-Event. Der Webhook antwortet **sofort mit HTTP 200** (Strava erwartet eine Antwort innerhalb von ca. 2 Sekunden) und verarbeitet das Event anschliessend asynchron über `EdgeRuntime.waitUntil()`.

```text
Strava POST (create / update / delete)
  → Event validieren (nur object_type = activity)
  → In strava_webhook_events speichern (Deduplizierung per event_id)
  → Sofort HTTP 200 an Strava
  → Hintergrund:
       create/update → Token prüfen → GET /activities/{object_id} → upsert
       delete        → DELETE aus strava_activities
```

| aspect_type | Aktion |
| ----------- | ------ |
| `create` | Einzelne Aktivität per `object_id` von Strava laden und in `strava_activities` upserten |
| `update` | Aktivität erneut laden und upserten |
| `delete` | Zeile mit `strava_activity_id = object_id` aus `strava_activities` löschen |

Bei der Subscription-Verifikation (GET) gibt der Webhook den `hub.challenge`-Wert zurück und prüft optional den `STRAVA_VERIFY_TOKEN`.

#### Token-Management

Das Token-Refresh ist keine eigene deployte Function, sondern eine interne Hilfsfunktion in `_shared/strava/oauth.ts`:

1. Verbindung aus `strava_connection` laden (id = 1)
2. Prüfen, ob `expires_at` abgelaufen ist
3. Falls ja: neues Access Token via `refresh_token` bei Strava anfordern und in der DB speichern
4. Gültiges Access Token an den API-Aufruf weitergeben

Diese Logik wird sowohl vom Webhook (Einzelaktivität) als auch vom manuellen Vollsync (`strava-sync`) verwendet.

#### Vollsync (strava-sync)

Der Vollsync lädt alle Aktivitäten seit dem Zeitpunkt `last_sync` aus `strava_connection` (mit Pagination, 50 pro Seite), speichert sie in `strava_activities` und aktualisiert `last_sync`. Er wird eingesetzt für:

* Erstes OAuth-Setup (Initialimport)
* Manuellen Nachsync per POST auf `strava-sync`
* Optional: periodischen Cron-Job als Sicherheitsnetz

Im Normalbetrieb hält der **Webhook** die Datenbank automatisch aktuell; ein Vollsync ist nur bei Bedarf nötig.

#### Secrets (Supabase Edge Functions)

| Secret | Verwendung |
| ------ | ---------- |
| `SUPABASE_URL` | Automatisch gesetzt |
| `SUPABASE_SERVICE_ROLE_KEY` | Automatisch gesetzt |
| `STRAVA_CLIENT_ID` | OAuth und Token-Refresh |
| `STRAVA_CLIENT_SECRET` | OAuth und Token-Refresh |
| `STRAVA_VERIFY_TOKEN` | Webhook-Subscription-Verifikation |

#### Webhook bei Strava registrieren

```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=DEINE_CLIENT_ID \
  -F client_secret=STRAVA_CLIENT_SECRET \
  -F callback_url=https://DEIN-PROJECT.supabase.co/functions/v1/strava-webhook \
  -F verify_token=VERIFY_TOKEN
```

SQL für die Deduplizierungstabelle: `supabase/strava-webhook-events.sql`

### 4.5 Frontend

#### Öffentliche Seiten

* Home
* About
* Raceplan
* Activities

#### Geschützte Seiten

* Trainingsdetails
* Profilverwaltung

#### Administrationsbereich

* Raceplan verwaltung

### 4.6 Deployment

**Frontend:** Das React-Projekt (`webpage-jabra/`) wird mit Vite gebaut und als statische Seite gehostet (z. B. Vercel, Netlify oder Supabase Hosting).

**Backend (Supabase):**

* SQL-Skripte (`supabase/*.sql`) im Supabase SQL Editor ausführen (Tabellen, RLS, Views, Trigger)
* Edge Functions deployen:

```bash
supabase functions deploy strava-webhook
supabase functions deploy strava-sync
```

* Secrets in Supabase setzen: `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_VERIFY_TOKEN`
* Strava-Webhook-Subscription mit der `callback_url` auf `strava-webhook` registrieren (vgl. Abschnitt 4.4)

---

## 5. Test

Im Rahmen von **AP7 (Testdurchführung, Fehlerbehebung und Abnahmetests)** wurden die umgesetzten Funktionen gegen die User Stories (US1–US11) und die funktionalen sowie nicht-funktionalen Anforderungen geprüft. Dabei kommen **manuelle Abnahmetests** im Browser sowie **automatisierte Unit-Tests** mit Vitest zum Einsatz. E2E-Tests wurden nicht implementiert.

### 5.1 Teststrategie

| Aspekt | Vorgehen |
| ------ | -------- |
| Testart | Manuelle Abnahmetests (Black-Box) + automatisierte Unit-Tests (Vitest) |
| Testbasis | User Stories, Anforderungen F1–F18, NF1–NF8 |
| Rollen | Gast (nicht eingeloggt), User (registriert), Sportler/Admin |
| Priorität | Sicherheit (RLS, Auth) und rollenbasierte Zugriffe zuerst, danach CRUD und Darstellung |
| Automatisierung | Reine Hilfsfunktionen und Auth-Guard; Supabase/Strava nur manuell |
| Fehlerbehandlung | Gefundene Abweichungen dokumentieren, beheben und Test wiederholen |

### 5.2 Testumgebung

| Komponente | Version / Angabe |
| ---------- | ---------------- |
| Browser | Chrome / Safari (aktuell) / Brave |
| Frontend | React (Vite), lokal |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Testdaten | Mind. 1 Gast-Session, 1 User-Account, 1 Admin-Account; Strava-Aktivitäten in DB |
| Testdatum | 21.06.2026 |

### 5.3 Abnahmetests – User Stories

*Tabelle 5.1 – Abnahmetests pro User Story*

| ID | Bezug | Rolle | Testschritt | Erwartetes Ergebnis | Ergebnis |
| -- | ----- | ----- | ----------- | ------------------- | -------- |
| T-01 | US1 / F1 | Gast | `/` aufrufen ohne Login | Startseite lädt; Vorname, Nachname und Ziel des Sportlers sind sichtbar | - |
| T-02 | US1 / F1 | Gast | Navigation auf der Startseite prüfen | Links zu Home, About, Raceplan, Activities, Login und Signup sind sichtbar | - |
| T-03 | US2 / F2 | Gast | Über Navigation «About» aufrufen | About-Seite lädt ohne Login; Steckbrief und Bild werden angezeigt | - |
| T-04 | US3 / F3 | Gast | `/raceplan` aufrufen | Alle Wettkämpfe werden in einer Liste angezeigt, sortiert nach Datum | - |
| T-05 | US3 / F3 | Gast | Wettkampf-Karte aufklappen | Details (Datum, Ort, Disziplin, Distanz, Resultat) und Event-Link sind sichtbar | — |
| T-06 | US3 / F3 | Gast | Event-Link anklicken | Offizielle Veranstaltungsseite öffnet sich in neuem Tab | — |
| T-07 | US4 / F4 | Gast | `/activities` aufrufen | Trainingsübersicht lädt ohne Login; Trainings werden als Liste angezeigt | — |
| T-08 | US4 / F5 | Gast | Filter «SWIM», «BIKE», «RUN» nacheinander wählen | Liste zeigt nur passende Sportarten; «ALLE» zeigt wieder alle | — |
| T-09 | US4 / F16 | Gast | Hinweistext und Trainingskarte prüfen | Hinweis «Melde dich an…» ist sichtbar; Klick auf Training führt **nicht** zu Details | — |
| T-10 | US5 / F6 | Gast | Über Login → Signup Registrierungsformular öffnen | Formular mit Benutzername, E-Mail und Passwort ist erreichbar | — |
| T-11 | US5 / F6 | Gast | Registrierung mit gültigen Daten absenden | Erfolgsmeldung; Konto wird angelegt; Profil-Eintrag in `profiles` vorhanden | — |
| T-12 | US5 / NF7 | Gast | Registrierung mit zu kurzem Benutzernamen (< 3 Zeichen) | Browser-Validierung verhindert Absenden | — |
| T-13 | US6 / F8, F15 | User | Einloggen und auf ein Training klicken | Detailseite `/activities/:id` öffnet sich | — |
| T-14 | US6 / F8 | User | Detailseite prüfen | Distanz, Zeit, Geschwindigkeit, Höhe, HF, Watt (falls vorhanden) und Karte werden angezeigt | — |
| T-15 | US6 / F8 | User | «Zurück zur Übersicht» nutzen | Rückkehr zur Trainingsübersicht funktioniert | — |
| T-16 | US7 / F9 | User | Als eingeloggter User `/profile` aufrufen | Profilseite mit E-Mail und Benutzername ist sichtbar | — |
| T-17 | US7 / F9, F18 | User | Benutzername ändern und speichern | Erfolgsmeldung; neuer Name auf Profilseite und in der Navigation sichtbar | — |
| T-18 | US8 / F10 | User | «Konto dauerhaft löschen» wählen und Bestätigung abbrechen | Konto bleibt bestehen; User bleibt eingeloggt | — |
| T-19 | US8 / F10 | User | Löschen bestätigen (Test-Account verwenden) | Konto wird entfernt; automatische Abmeldung; Redirect zur Startseite | — |
| T-20 | US9 / F11 | Sportler | Als Admin `/raceplan` aufrufen | Button «Race hinzufügen» ist sichtbar | — |
| T-21 | US9 / F11, NF7 | Sportler | Neues Rennen mit allen Pflichtfeldern anlegen | Eintrag erscheint sofort in der Raceplan-Liste | — |
| T-22 | US9 / NF7 | Sportler | Formular ohne Pflichtfeld absenden | Browser-Validierung verhindert Speichern | — |
| T-23 | US10 / F12, F18 | Sportler | Bestehenden Eintrag bearbeiten (z. B. Resultat eintragen) | Änderungen werden gespeichert und korrekt angezeigt | — |
| T-24 | US11 / F13 | Sportler | Eintrag löschen und Bestätigung abbrechen | Eintrag bleibt im Raceplan | — |
| T-25 | US11 / F13, F18 | Sportler | Löschen bestätigen | Eintrag verschwindet aus der Liste | — |

### 5.4 Authentifizierung und Rollen

*Tabelle 5.2 – Tests für Login, Logout und rollenbasierte Oberfläche*

| ID | Bezug | Rolle | Testschritt | Erwartetes Ergebnis | Ergebnis |
| -- | ----- | ----- | ----------- | ------------------- | -------- |
| T-26 | F7 | Gast | Gültige Login-Daten eingeben | Weiterleitung zur Startseite oder zur zuvor aufgerufenen geschützten Seite | — |
| T-27 | F7 / NF7 | Gast | Login mit falschem Passwort | Fehlermeldung; kein Zugang zu geschützten Seiten | — |
| T-28 | F7 | User | «Logout» in der Navigation klicken | Session beendet; Login/Signup-Links wieder sichtbar; Benutzername verschwindet | — |
| T-29 | F14 | User | Navigation als normaler User prüfen | Kein «Race hinzufügen»; Benutzername in der Navigation sichtbar | — |
| T-30 | F14 | Sportler | Navigation als Admin prüfen | Zusätzlich Raceplan-CRUD verfügbar | — |
| T-31 | F15 | Gast | `/activities/1` direkt in der Adresszeile aufrufen | Redirect zu `/login` | — |
| T-32 | F15 | Gast | `/profile` direkt aufrufen | Redirect zu `/login` | — |

### 5.5 Sicherheits- und RLS-Tests

*Tabelle 5.3 – Tests für Row Level Security und Berechtigungen (NF3, NF4)*

| ID | Bezug | Rolle | Testschritt | Erwartetes Ergebnis | Ergebnis |
| -- | ----- | ----- | ----------- | ------------------- | -------- |
| T-33 | F16 / NF4 | Gast | Trainingsübersicht (`strava_activities_overview`) laden | SELECT erlaubt; Übersichtsdaten sichtbar | — |
| T-34 | F16 / NF4 | Gast | Vollständige Aktivitätsdetails abrufen (direkte URL) | Kein Zugriff; Redirect zu Login | — |
| T-35 | NF4 | User | Aktivitätsdetails als eingeloggter User laden | SELECT auf `strava_activities` erlaubt | — |
| T-36 | NF4 | User | Raceplan-Eintrag erstellen versuchen | Kein «Race hinzufügen»-Button; INSERT über UI nicht möglich | — |
| T-37 | NF4 | User | Raceplan-Update/-Delete über UI versuchen | Bearbeiten/Löschen-Buttons nicht sichtbar | — |
| T-38 | NF4 | Sportler | Race CRUD ausführen | INSERT, UPDATE, DELETE nur mit `role = admin` erfolgreich | — |
| T-39 | NF4 | User | Fremdes Profil per UI bearbeiten | Nur eigenes Profil unter `/profile` editierbar | — |
| T-40 | F10 / NF4 | User | Eigenes Konto löschen | RPC `delete_own_account` entfernt Profil und Auth-User | — |

### 5.6 Nicht-funktionale Tests

*Tabelle 5.4 – Nicht-funktionale Anforderungen*

| ID | Bezug | Testschritt | Erwartetes Ergebnis | Ergebnis |
| -- | ----- | ----------- | ------------------- | -------- |
| T-41 | NF1 | App in Chrome und Safari öffnen | Alle Seiten laden und sind bedienbar | — |
| T-42 | NF2 | Desktop- und Mobile-Ansicht (DevTools / Handy) prüfen | Layout passt sich an; Navigation und Inhalte bleiben lesbar | — |
| T-43 | NF6 | Alle Hauptseiten durchklicken | Einheitliches Layout, klare Navigation, verständliche Beschriftungen | — |
| T-44 | NF7 | Ungültige Formulareingaben testen (Login, Signup, Raceplan) | Validierung/Fehlermeldungen werden angezeigt | — |
| T-45 | NF8 | Raceplan-Eintrag speichern, Seite neu laden | Daten bleiben in der Datenbank erhalten | — |
| T-46 | NF8 | Benutzername speichern, aus- und wieder einloggen | Geänderter Benutzername bleibt erhalten | — |
| T-47 | NF5 | Profildaten in Supabase Dashboard prüfen | Daten liegen in PostgreSQL (`profiles`, `auth.users`) | — |

### 5.7 Automatisierte Unit-Tests (Vitest)

Zusätzlich zu den manuellen Abnahmetests wurden **34 automatisierte Unit-Tests** mit **Vitest** und **React Testing Library** implementiert. Getestet werden isolierte Hilfsfunktionen ohne Supabase-Anbindung sowie der Auth-Guard `ProtectedRoute`.

#### 5.7.1 Test-Setup

| Komponente | Angabe |
| ---------- | ------ |
| Framework | Vitest 4.x |
| Test-Runner | integriert in Vite (`vite.config.js`) |
| DOM-Umgebung | jsdom |
| Component-Tests | `@testing-library/react`, `@testing-library/jest-dom` |
| Ausführung | `npm run test:run` (einmalig) bzw. `npm test` (Watch-Modus) |

Die testbare Logik wurde in Utils-Module ausgelagert (`src/utils/`). Die zugehörigen Tests liegen zentral unter `tests/` (Unterordner `utils/` und `components/`), das globale Setup in `tests/setup.js`.

#### 5.7.2 Übersicht der automatisierten Testfälle

*Tabelle 5.5 – Automatisierte Unit-Tests*

| ID | Testdatei | Getestete Funktion / Komponente | Bezug | Anzahl Tests | Ergebnis |
| -- | --------- | ------------------------------- | ----- | ------------ | -------- |
| AT-01 | `tests/utils/activities.test.js` | `formatDuration` | US6 / F8 | 2 | OK |
| AT-02 | `tests/utils/activities.test.js` | `formatDistance` | US4 / F8 | 3 | OK |
| AT-03 | `tests/utils/activities.test.js` | `matchesFilter` | US4 / F5 | 4 | OK |
| AT-04 | `tests/utils/activities.test.js` | `formatActivityDetails` | US4 / F4 | 2 | OK |
| AT-05 | `tests/utils/raceplan.test.js` | `formatDateForInput` | US9–11 | 2 | OK |
| AT-06 | `tests/utils/raceplan.test.js` | `raceToForm` | US10 | 1 | OK |
| AT-07 | `tests/utils/raceplan.test.js` | `buildRacePayload` | US9–11 / NF7 | 2 | OK |
| AT-08 | `tests/utils/activityDetails.test.js` | `getStatValue` | US6 / F8 | 3 | OK |
| AT-09 | `tests/utils/activityDetails.test.js` | `formatKilojoulesAsKcal` | US6 / F8 | 2 | OK |
| AT-10 | `tests/utils/activityDetails.test.js` | `getStatGroups` | US6 / F8 | 6 | OK |
| AT-11 | `tests/utils/activityDetails.test.js` | `getSportIcon` | US6 | 2 | OK |
| AT-12 | `tests/utils/map.test.js` | `decodePolyline` | US6 / Strava-Integration | 2 | OK |
| AT-13 | `tests/components/ProtectedRoute.test.jsx` | Redirect bei fehlender Auth | F15 | 1 | OK |
| AT-14 | `tests/components/ProtectedRoute.test.jsx` | Zugriff für eingeloggte User | F15 | 1 | OK |
| AT-15 | `tests/components/ProtectedRoute.test.jsx` | Kein Render während Auth-Loading | F15 | 1 | OK |

**Gesamt: 5 Testdateien, 34 Tests — alle bestanden.**

#### 5.7.3 Abdeckung und Grenzen

**Automatisiert getestet:**

* Sportart-Filter (SWIM / BIKE / RUN)
* Formatierung von Distanz, Dauer und Aktivitätsdetails
* Gruppierte Statistik-Anzeige (Übersicht, Höhe, Geschwindigkeit, HF, Leistung)
* Umrechnung von `kilojoules` in kcal (`÷ 4.184`)
* Raceplan-Payload (Trimmen, Ländercode, leeres Resultat → `null`)
* Bedingte Anzeige von Statistikfeldern (HF, Watt, Höhe)
* Polyline-Decoding für die Kartenansicht
* Weiterleitung zu `/login` bei geschützten Routen

**Bewusst nicht automatisiert** (nur manuelle Tests, vgl. Tabellen 5.1–5.4):

* Supabase Auth, RLS-Policies und RPC `delete_own_account`
* Strava-Webhook und Edge Functions
* Vollständige UI-Flows (Signup, Raceplan-CRUD, Responsives Layout)
* E2E-Tests über Browser-Automation

#### 5.7.4 Beispielausführung

```bash
cd webpage-jabra
npm run test:run
```

Erwartete Ausgabe: `Test Files 5 passed (5)`, `Tests 34 passed (34)`.

### 5.8 Testzusammenfassung

| Kennzahl | Wert |
| -------- | ---- |
| Manuelle Testfälle (T-01–T-47) | 47 |
| Automatisierte Unit-Tests (AT-01–AT-15) | 34 |
| Manuelle Tests bestanden (OK) | — |
| Manuelle Tests fehlgeschlagen (NOK) | — |
| Automatisierte Tests bestanden | 34 / 34 |
| Behobene Fehler während AP7 | RLS-Policy für Aktivitätsübersicht; Admin-Berechtigung beim Raceplan-CRUD; Polyline-Mapping aus Strava-Daten |

**Hinweis:** Die Spalte «Ergebnis» wird bei der Testdurchführung mit **OK** oder **NOK** ergänzt. Für T-19 (Kontolöschung) und destruktive Tests (T-25) sollten separate Test-Accounts verwendet werden.

---

## 6. Sicherheitskonzept

---

## 7. Fazit

### 7.1 Das lief gut

### 7.2 Da gab es Probleme

### 7.3 Bewertungsraster

**Anweisungen**

Gesucht ist eine Webapp zur Verwaltung persönlicher Modulnoten, Einkaufszettel, Haustiere etc.
Die Webapp soll multiuser-fähig sein und kann mit Supabase oder Firebase implementiert werden. Minimaler Umfang des Datenmodells sind zwei miteinander verbundene Tabellen.

Hilfestellungen sind an den jeweiligen Stellen zu kennzeichnen, damit klar wird was selbst und was "fremd"-erstellt ist.

Wichtig: Sind die Commit-Logs nicht plausibel, kann die Arbeit als Plagiat gewertet werden.

Bewertungsraster: Arztzeugnis bei NHP

| Bewertungskirterium | Mögliche Punkte |
| ------------------- | --------------- |
| Projektpitch       | 2p              |
| User Stories mit Akzeptanzkriterien | 2p |
| Arbeitsplan mit sinnvoll detailierten Arbeitsschritten und Zeitschätzung | 2p |
| effektive Arbeitszeit je Arbeitspaket protokolliert | 2p |
| vollendeter git merge request | 2p |
| funktionale git actions | 2p |
| auth korrekt eingesetzt | 2p |
| CRUD OPs | 4p |
| Architektur dokumentiert | 2p |
| Deployment-Optionen dokumentiert | 2p |
| kritischer Review: welche Ziele wurden erreicht oder auch nicht | 2p |

Ohne Arztzeugnis keine NHP.

Zusatz, z.B.:
1p Admin Funktionalität
1p file upload etc (nach Vereinbarung)

Abzugeben ist der für mich erreichbare Github Link mit README (oder alternativ PDF-Doku) sowie zum Nachvollziehen das .env file (mit den secrets)