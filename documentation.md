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
  - [2.4 Anforderungen](#24-anforderungen)
    - [2.4.1 Funktionale Anforderungen](#241-funktionale-anforderungen)
    - [2.4.2 Nicht-Funktionale Anforderungen](#242-nicht-funktionale-anforderungen)
- [3. Planung](#3-planung)
  - [3.1 Arbeitsplanung](#31-arbeitsplanung)
  - [3.2 Technologieauswahl](#32-technologieauswahl)
  - [3.3 Systemarchitektur](#33-systemarchitektur)
  - [3.4 Datenmodell](#34-datenmodell)
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

Ziel des Projekts ist die Entwicklung einer **Fullstack-Webapplikation**, mit welcher der Sportler seine sportliche Präsenz online abbilden kann. Besucher sollen auf einen Blick Ziel, Person und kommende Events erkennen; registrierte Nutzer sollen vertiefte Einblicke in einzelne Trainingseinheiten erhalten.

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

*Die funktionalen Ziele werden in Abschnitt 2.4 als nummerierte Anforderungen (F1–F18) präzisiert und in Abschnitt 2.3 über User Stories mit Akzeptanzkriterien abgesichert.*

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
| Frontend | Single-Page-Application mit **React** und **Vite**; Seiten: Home, About, Login, Signup, Raceplan, Activities, Activity Details, Benutzerprofil |
| Backend | **Supabase**: PostgreSQL-Datenbank, Auth, Storage (Bucket `images`), Edge Functions |
| Authentifizierung | E-Mail/Passwort-Registrierung und -Login über Supabase Auth; JWT-basierte Sessions |
| Rollenmodell | Drei Rollen: **Gast** (ohne Konto), **User** (registriert mit `role = user`), **Sportler** (Admin mit `role = admin`) |
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

Im Analyseabschnitt werden die beteiligten Personen und ihre Erwartungen an die Webapplikation beschrieben. Darauf aufbauend wird ein **Rollenmodell** definiert, das festlegt, welche Funktionen für welche Benutzergruppe zugänglich sind. Die Anforderungen werden anschliessend in **User Stories** (Abschnitt 2.3) und nummerierte funktionale sowie nicht-funktionale Anforderungen (Abschnitt 2.4) überführt.

Die Analyse basiert auf dem Erstgespräch mit dem Auftraggeber am 15.06.2026 (vgl. Arbeitsjournal, AP1) und wurde im Verlauf der Umsetzung bei Bedarf präzisiert – etwa bei der Einschränkung der Trainingsdetails auf registrierte Benutzer oder der Admin-Berechtigung für den Raceplan.

### 2.1 Stakeholder

Stakeholder sind alle Personen oder Gruppen, die ein berechtigtes Interesse an der Webapplikation haben. Für dieses Projekt lassen sich drei Hauptgruppen unterscheiden, die direkt den Rollen des Systems entsprechen (vgl. Abschnitt 2.2).

#### Stakeholderübersicht

| Stakeholder | Rolle im System | Interesse | Erwartung an die Anwendung |
| ----------- | --------------- | --------- | -------------------------- |
| Jan Brawand (Auftraggeber) | Sportler / Admin | Professioneller Webauftritt; einfache Pflege von Wettkampfdaten; automatische Übernahme von Strava-Trainings | Raceplan selbst verwalten; Trainings ohne manuelle Doppelerfassung anzeigen; öffentliche Seiten für Sponsoren und Fans |
| Registrierte Benutzer | User | Vertiefte Einblicke in Trainingsleistung | Zugang zu Detaildaten (Watt, Herzfrequenz, Karte); eigenes Profil verwalten |
| Unregistrierte Besucher | Gast | Überblick über Sportler, Ziele und Events | Öffentliche Seiten ohne Login; Möglichkeit zur Registrierung für mehr Inhalte |

*Tabelle 2.1 – Stakeholderanalyse*

#### Indirekte Stakeholder

Neben den direkten Nutzern der Plattform spielen weitere Gruppen eine Rolle, ohne selbst ein Benutzerkonto zu benötigen:

| Stakeholder | Bezug zum Projekt | Relevanz |
| ----------- | ----------------- | -------- |
| Sponsoren | Interessieren sich an Trainingsfortschritt und Wettkampfplanung | Profitieren von der öffentlichen Startseite, About-Seite und dem Raceplan |
| Familie & Freunde | Verfolgen den sportlichen Werdegang | Nutzen primär die öffentlichen Bereiche; können sich optional registrieren |
| Dozent / Prüfung (Modul 210) | Bewertet technische Umsetzung und Dokumentation | Erwartet Cloud-Architektur, sichere Auth, externe API-Anbindung |
| Strava (Plattform) | Externe Datenquelle für Trainings | OAuth- und API-Nutzung gemäss Strava-Richtlinien |

*Tabelle 2.2 – Indirekte Stakeholder*

#### Konflikte und Priorisierung

Zwischen den Stakeholder-Interessen bestehen teilweise unterschiedliche Schwerpunkte:

- **Öffentlichkeit vs. Exklusivität:** Sponsoren und Gäste sollen einen breiten Überblick erhalten; detaillierte Leistungsdaten sind nur für registrierte User vorgesehen (F16). Das schafft einen Anreiz zur Registrierung und schützt gleichzeitig spezifische Trainingsinformationen.
- **Einfachheit vs. Vollständigkeit:** Der Sportler wünscht möglichst wenig manuellen Pflegeaufwand. Trainings werden deshalb aus Strava synchronisiert; nur Wettkämpfe werden manuell gepflegt.
- **Zeitbudget vs. Funktionsumfang:** Nicht alle Wünsche (z. B. vollautomatischer Webhook-Sync) konnten im Projektzeitraum vollständig produktiv gesetzt werden (vgl. Abschnitt 1.3).

### 2.2 Rollenmodell

Die Webapplikation implementiert ein **rollenbasiertes Zugriffsmodell (RBAC)** mit drei Stufen. Jede höhere Rolle umfasst alle Rechte der darunterliegenden Rolle. Die Durchsetzung erfolgt auf zwei Ebenen:

1. **Frontend** – geschützte Routen (`ProtectedRoute`) und bedingte UI-Elemente (z. B. Admin-Buttons im Raceplan)
2. **Datenbank** – Row Level Security (RLS) auf den Tabellen `profiles`, `races` und `strava_activities`

```text
  Gast  ──registrieren──►  User  ──(role = admin)──►  Sportler (Admin)
    │                        │                            │
    │  öffentliche Seiten    │  + Trainingsdetails        │  + Raceplan-CRUD
    │  Trainingsübersicht    │  + Profilverwaltung        │
    └────────────────────────┴────────────────────────────┘
```

#### Rollenübersicht

| Rolle | Authentifizierung | Speicherung | Admin-Rechte |
| ----- | ----------------- | ----------- | ------------ |
| Gast | Keine Session | — | Nein |
| User | Supabase Auth (JWT) | `profiles.role = 'user'` (Standard bei Registrierung) | Nein |
| Sportler | Supabase Auth (JWT) | `profiles.role = 'admin'` (manuell in der DB gesetzt) | Ja (`is_admin()`) |

*Tabelle 2.3 – Rollenübersicht*

Bei der Registrierung legt ein Datenbank-Trigger (`handle_new_user`) automatisch einen Eintrag in `profiles` an. Die Rolle ist standardmässig `user`. Der Auftraggeber erhält manuell den Wert `admin`, damit nur er Wettkämpfe verwalten kann.

#### 2.2.1 Gast (unregistrierter Benutzer)

Gäste sind Besucher ohne Supabase-Account. Sie können alle **öffentlichen Seiten** der Anwendung nutzen, haben aber keinen Zugriff auf geschützte Inhalte.

**Verfügbare Funktionen:**

- Startseite ansehen
- Informationen über Sportler ansehen
- Wettkämpfe ansehen
- Trainingsübersicht ansehen
- Registrieren

**Technische Umsetzung:**

| Aspekt | Umsetzung |
| ------ | --------- |
| Erreichbare Routen | `/`, `/about`, `/raceplan`, `/activities`, `/login`, `/signup` |
| Trainingsdaten | Lesen über die View `strava_activities_overview` (nur Grundfelder: Name, Distanz, Dauer, Sportart, Datum) |
| Wettkampfdaten | Lesen der Tabelle `races` (RLS: `Everyone can view races`) |
| Trainingsdetails | Route `/activities/:id` ist geschützt; Klick auf eine Aktivität führt Gäste nicht zur Detailseite |
| Registrierung | Formular unter `/signup`; Username wird in `auth.users` Metadata und via Trigger in `profiles` gespeichert |

**Zugehörige User Stories:** US1–US5

#### 2.2.2 User (registrierter Benutzer)

Registrierte Benutzer sind über **Supabase Auth** angemeldet. Sie erben alle Gast-Rechte und erhalten zusätzlich Zugang zu geschützten Bereichen.

**Verfügbare Funktionen:**

- Alle Gast-Funktionen
- Trainigsdetails ansehen
- Eigenes Profil verwalten
- Konto löschen

**Technische Umsetzung:**

| Aspekt | Umsetzung |
| ------ | --------- |
| Authentifizierung | E-Mail/Passwort über Supabase Auth; Session als JWT im Browser |
| Geschützte Routen | `/activities/:id` und `/profile` über `ProtectedRoute`; Redirect zu `/login` ohne Session |
| Trainingsdetails | Voller SELECT auf `strava_activities` für `authenticated` (RLS) |
| Profilverwaltung | UPDATE auf eigene Zeile in `profiles` (`auth.uid() = id`) |
| Kontolöschung | Löschen des Auth-Users und des zugehörigen Profils (Policy und Trigger in `profiles-delete-account`) |
| Admin-Funktionen | Keine – `is_admin()` gibt `false` zurück |

**Zugehörige User Stories:** US6–US8

#### 2.2.3 Sportler (Admin Benutzer)

Der Sportler ist (neben der Entwicklerin) der **einzige Administrator** der Plattform. In der Datenbank ist er als User mit `profiles.role = 'admin'` hinterlegt. Die Prüfung erfolgt über die SQL-Funktion `is_admin()`.

**Verfügbare Funktionen:**

- Alle User-Funktionen
- Wettkämpfe verwalten

**Technische Umsetzung:**

| Aspekt | Umsetzung |
| ------ | --------- |
| Admin-Erkennung | `public.is_admin()` prüft `profiles.role = 'admin'` für `auth.uid()` |
| Raceplan-CRUD | INSERT, UPDATE, DELETE auf `races` nur mit `is_admin()` (RLS-Policies) |
| UI | Admin-Buttons (Erstellen, Bearbeiten, Löschen) im Raceplan werden nur angezeigt, wenn `supabase.rpc('is_admin')` `true` liefert |
| Strava-Sync | OAuth-Tokens in `strava_connection`; Synchronisation über Edge Function (vom Sportler ausgelöst) |

**Zugehörige User Stories:** US9–US11

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

Die Anforderungen konkretisieren die Projektziele aus Abschnitt 1.2 in überprüfbare Aussagen. **Funktionale Anforderungen** beschreiben, *was* das System leisten soll; **nicht-funktionale Anforderungen** definieren Qualitätsmerkmale wie Sicherheit, Responsivität und Datenhaltung.

Die funktionalen Anforderungen F1–F18 lassen sich den User Stories aus Abschnitt 2.3 zuordnen. Die nicht-funktionalen Anforderungen NF1–NF8 gelten quer über alle Rollen und Funktionen hinweg.

#### 2.4.1 Funktionale Anforderungen

| ID | Anforderung | Rolle | User Story | Priorität |
| -- | ----------- | ----- | ---------- | --------- |
| F1 | Die Webapplikation stellt eine öffentlich zugängliche Startseite mit Informationen zum Sportler bereit | Gast | US1 | Muss |
| F2 | Die Webapplikation stellt eine öffentlich zugängliche Informations-Seite mit Steckbrief und Bild des Sportlers bereit | Gast | US2 | Muss |
| F3 | Die Webapplikation stellt eine öffentlich zugänglichen Wettkampf-Seite mit geplanten und vergangenen Wetkämpfen inklusive Verlinkung zu den offiziellen Veranstaltungsseiten bereit | Gast | US3 | Muss |
| F4 | Die Webapplikation stellt eine öffentlich zugängliche Trainingsübersicht bereit | Gast | US4 | Muss |
| F5 | Trainings können nach Sportart gefiltert werden | Gast | US4 | Muss |
| F6 | Benutzer können sich registrieren und ein Benutzerkonto erstellen | Gast | US5 | Muss |
| F7 | Registrierte Benutzer können sich an- und abmelden | User | — | Muss |
| F8 | Registrierte Benutzer können detaillierte Trainingsinformationen einsehen | User | US6 | Muss |
| F9 | Registrierte Benutzer ihren Benutzernamen bearbeiten | User | US7 | Muss |
| F10 | Registrierte Benutzer können ihr Benutzerkonto dauerhaft löschen | User | US8 | Muss |
| F11 | Administratoren können Wettkampf-Einträge erstellen | Sportler | US9 | Muss |
| F12 | Administratoren können Wettkampf-Einträge bearbeiten | Sportler | US10 | Muss |
| F13 | Administratoren können Wettkampf-Einträge löschen | Sportler | US11 | Muss |
| F14 | Die Anwendung unterscheidet sich zwischen den Rollen Gast, Benutzer und Administrator | Alle | — | Muss |
| F15 | Der Zugriff auf geschützte Inhalte erfolgt nur nach erfolgreicher Authentifizierung | User | US6 | Muss |
| F16 | Trainingsdetails sind ausschliesslich für registrierte Benutzer sichtbar | User | US4, US6 | Muss |
| F17 | Wettkampf- und Trainingseinträge werden zentral in einer Datenbank gespeichert | Alle | — | Muss |
| F18 | Änderungen an Trainings- und Wettkampf-Daten werden unmittelbar in der Anwendung angezeigt | Alle | — | Muss |

*Tabelle 2.4 – Funktionale Anforderungen*

**Erläuterungen:**

- **F7 (An-/Abmelden)** ergänzt die User Stories um den Login-/Logout-Flow, der für US6–US8 vorausgesetzt wird.
- **F14–F16** sind übergreifende Sicherheitsanforderungen und werden durch RLS-Policies und `ProtectedRoute` umgesetzt (vgl. Abschnitt 4.3 und 5.5).
- **F17** betrifft die Tabellen `races` und `strava_activities` in Supabase PostgreSQL; Trainings werden zusätzlich über die Strava-API befüllt.
- **F18** wird durch direktes Nachladen der Daten nach CRUD-Operationen bzw. nach dem Strava-Sync erfüllt.

**Anforderungen ausserhalb des User-Story-Umfangs:**

| ID | Beschreibung | Umsetzung |
| -- | ------------ | --------- |
| — | Strava-OAuth und Aktivitätensynchronisation | Edge Functions, Tabelle `strava_connection` (vgl. Abschnitt 4.4) |
| — | Anzeige der Trainingsroute auf einer Karte | Leaflet mit decoded `summary_polyline` in Activity Details |

Diese Punkte folgen aus der Projektabgrenzung (Abschnitt 1.3) und dem Auftraggebergespräch, sind aber nicht als eigene User Stories formuliert.

#### 2.4.2 Nicht-Funktionale Anforderungen

| ID | Anforderung | Kategorie | Umsetzung im Projekt |
| -- | ------------ | --------- | --------------------- |
| NF1 | Die Anwendung muss über aktuelle Webbrowser nutzbar sein | Kompatibilität | React-SPA; getestet in Chrome und Safari |
| NF2 | Die Benutzeroberfläche muss responsiv sein und auf Desktop sowie mobilen Endgeräten funktionieren | Benutzbarkeit | CSS Media Queries auf allen Seiten; Mobile-First-Layout in Home, Raceplan und Activities |
| NF3 | Benutzerkonten müssen durch eine sichere Authentifizierung geschützt werden | Sicherheit | Supabase Auth mit gehashten Passwörtern und JWT-Sessions |
| NF4 | Rollen und Berechtigungen müssen mittels Row Level Security (RLS) abgesichert werden | Sicherheit | RLS auf `profiles`, `races`, `strava_activities`; View `strava_activities_overview` für Gäste |
| NF5 | Personenbezogene Daten werden in einer PostgreSQL-Datenbank innerhalb von Supabase gespeichert | Datenhaltung | Tabellen `profiles`, `auth.users`; Hosting in Supabase Cloud |
| NF6 | Die Anwendung muss eine intuitive und übersichtliche Benutzeroberfläche bereitstellen | Benutzbarkeit | Einheitliches Layout mit Navigation; Portfolio-Karten auf der Startseite |
| NF7 | Ungültige Benutzereingaben werden validiert und dem Benutzer verständlich angezeigt | Benutzbarkeit | Clientseitige Validierung in Login, Signup, Raceplan-Formular und Profil |
| NF8 | Änderungen an Benutzerdaten, Trainings und Raceplan-Einträgen müssen dauerhaft gespeichert werden | Datenhaltung | Persistenz in PostgreSQL; Strava-Sync schreibt in `strava_activities` |

*Tabelle 2.5 – Nicht-funktionale Anforderungen*

**Priorisierung:** Alle nicht-funktionalen Anforderungen wurden als **Muss-Kriterien** behandelt. Besonders kritisch für die Modulbewertung sind NF3 und NF4 (Sicherheit), da das Projekt im Kontext **Public Cloud** steht und sowohl Authentifizierung als auch datenbankseitige Zugriffskontrolle nachweisbar sein müssen.

**Abdeckung durch Tests:** NF3 und NF4 werden in Abschnitt 5.5 (Sicherheits- und RLS-Tests) geprüft; NF6 und NF7 im Rahmen der Abnahmetests (Abschnitt 5.3).

---

## 3. Planung

Der Planungsabschnitt beschreibt, wie das Projekt zeitlich strukturiert, technisch aufgebaut und datenseitig modelliert wurde. Er baut auf der Analyse (Kapitel 2) auf und bildet die Grundlage für die Umsetzung (Kapitel 4) und die Tests (Kapitel 5).

Geplant war ein Gesamtaufwand von **50 Stunden** im Zeitraum 15.06.2026 bis 27.06.2026. Die Planung erfolgte in zehn Arbeitspaketen (AP1–AP10), die nacheinander bzw. teilweise parallel bearbeitet wurden. Der tatsächliche Fortschritt wurde fortlaufend im Arbeitsjournal protokolliert.

### 3.1 Arbeitsplanung

#### Projektorganisation

| Aspekt | Festlegung |
| ------ | ---------- |
| Projektform | Einzelarbeit |
| Zeitraum | 15.06.2026 (Kick-off) – 27.06.2026 (Abgabe) |
| Geplanter Gesamtaufwand | 50 Stunden |
| Protokollierter Ist-Aufwand (Stand 23.06.2026) | ca. 38,5 Stunden |
| Auftraggeber | Jan Brawand (fachliche Anforderungen, Strava-OAuth, Feedback) |
| Entwicklungswerkzeug | Cursor IDE (Code, KI-Unterstützung, Dokumentation) |

*Tabelle 3.1 – Projektorganisation*

#### Vorgehensmodell

Das Projekt folgte einem **iterativ-inkrementellen Vorgehen** in vier Phasen. Nach jeder Phase wurde das Ergebnis kurz überprüft, bevor die nächste Phase begann:

```text
  Phase 1          Phase 2              Phase 3              Phase 4
  Analyse     →    Infrastruktur   →    Implementierung  →   Abschluss
  (AP1–AP2)        (AP3–AP4)            (AP5–AP6)            (AP7–AP9)
       │                │                    │                   │
       ▼                ▼                    ▼                   ▼
  User Stories     Supabase + RLS       React-Frontend      Tests + Doku
  Arbeitsplan      Strava-Anbindung     Integration         Fachgespräch
```

**Phase 1 – Analyse und Konzeption (15.06.):** Gespräch mit Auftraggeber, Definition von Zielen, User Stories, Rollenmodell und Arbeitspaketen (AP1). Recherche zu Supabase Auth (AP2).

**Phase 2 – Backend und Integration (16.–18.06.):** Supabase-Projekt, Tabellen, RLS, Storage (AP3). Strava OAuth, Edge Functions, Webhook-Versuche (AP4). Mehrere Iterationen bei OAuth-Scopes und Datenmodell.

**Phase 3 – Frontend und Integration (18.–23.06.):** React-App mit allen Seiten, CSS, Storage-Bilder, Admin-Funktionen (AP5). Strava-Sync-Button und CORS-Fix (AP4/AP5). Deployment (AP6) noch ausstehend.

**Phase 4 – Qualitätssicherung und Abgabe (21.–27.06.):** RLS-Tests, Unit-Tests, Code-Review (AP7). Dokumentation (AP8). Vorbereitung Fachgespräch (AP9).

#### Arbeitspakete

| AP | Beschreibung | Soll (h) | Ist (h) | Status (23.06.) |
| -- | ------------ | -------- | ------- | --------------- |
| AP1 | Anforderungsanalyse, User Stories, Projektplanung | 4 | 4,75 | Abgeschlossen |
| AP2 | Architektur, Datenmodell, Systemdesign | 3 | 2,00 | Abgeschlossen |
| AP3 | Backend (Supabase, Rollen, CRUD, Storage) | 8 | 6,25 | Abgeschlossen |
| AP4 | Strava-API (OAuth, Token, Sync, Webhook) | 8 | 12,75 | Über Soll; manueller Sync statt produktivem Webhook |
| AP5 | Frontend (React, Routing, Views, Formulare) | 8 | 11,75 | Über Soll; Kernfunktionen umgesetzt |
| AP6 | Integration und Deployment | 3 | — | Offen |
| AP7 | Tests, Fehlerbehebung, Abnahmetests | 4 | 5,25 | Laufend |
| AP8 | Sicherheitskonzept, Projektdokumentation | 5 | 2,25 | Laufend |
| AP9 | Vorbereitung Fachgespräch | 2 | — | Offen |
| AP10 | Zeitreserve / Puffer | 5 | 0,50 | Gering genutzt |
| | **Summe** | **50** | **38,50** | |

*Tabelle 3.2 – Arbeitspakete mit Soll-/Ist-Vergleich (Ist-Werte aus Arbeitsjournal)*

#### Meilensteine

| Datum | Meilenstein | Arbeitspaket |
| ----- | ----------- | -------------- |
| 15.06.2026 | Kick-off mit Auftraggeber; Anforderungen und Arbeitsplan stehen | AP1 |
| 16.06.2026 | Supabase-Projekt live; Races-CRUD und erste Strava-OAuth-Verbindung | AP3, AP4 |
| 17.06.2026 | Edge Functions und Storage eingerichtet | AP3, AP4 |
| 18.06.2026 | `strava_activities`-Tabelle; React-Frontend-Gerüst | AP3, AP5 |
| 19.06.2026 | Raceplan und Activities im Frontend; CSS und Bilder | AP5 |
| 20.06.2026 | RLS für Gäste/User; Admin-Prüfung für Raceplan; Activity Details | AP7, AP3 |
| 21.06.2026 | Profilverwaltung; Unit-Tests; Code-Review | AP5, AP7 |
| 22.06.2026 | Strava-Sync refaktoriert; Dokumentation Kap. 4 begonnen | AP4, AP8 |
| 23.06.2026 | Sync-Button in UI; CORS-Fix; Dokumentation Kap. 1–3 | AP4, AP5, AP8 |
| 27.06.2026 | Projektabschluss, Abgabe, Fachgespräch | AP6, AP8, AP9 |

*Tabelle 3.3 – Projektmeilensteine*

#### Abhängigkeiten zwischen Arbeitspaketen

```text
  AP1 (Analyse)
    ├──► AP2 (Architektur)
    │       └──► AP3 (Backend) ──► AP5 (Frontend)
    │               └──► AP4 (Strava) ──► AP5
    └──► AP7 (Tests) ◄── AP5
              └──► AP8 (Doku) ──► AP9 (Fachgespräch)
  AP6 (Deployment) ◄── AP3, AP4, AP5
  AP10 (Puffer) – jederzeit
```

AP4 (Strava) und AP3 (Backend) mussten vor dem vollständigen Frontend (AP5) weitgehend abgeschlossen sein, da Activities und RLS-Policies die UI-Datenbasis bilden. AP7 (Tests) setzt funktionierende Features aus AP3–AP5 voraus.

#### Planungsanpassungen

Während der Umsetzung wurden folgende Anpassungen gegenüber der ursprünglichen Planung vorgenommen:

| Geplant | Tatsächlich | Grund |
| ------- | ----------- | ----- |
| Automatischer Strava-Webhook-Sync | Manueller Sync per Admin-Button | Webhook-Troubleshooting zeitaufwändig; UI-Button als pragmatische Lösung (vgl. Arbeitsjournal 22.06.) |
| `strava_activities` von Anfang an | Zunächst zurückgestellt | Datenmodell unklar; Tabelle erst am 18.06. finalisiert |
| AP4 innerhalb von 8 h | 12,75 h verbucht | OAuth-Scopes, Polyline-Mapping, CORS, Refactoring |
| AP5 innerhalb von 8 h | 11,75 h verbucht | CSS, Storage-Pfade, Activity Details, Sync-Button |

Die Mehrzeit in AP4 und AP5 wurde teilweise durch geringere Aufwände in AP2 und AP3 kompensiert. AP10 (Puffer) wurde kaum beansprucht, da Probleme direkt in den betroffenen Paketen gelöst wurden.

---

### 3.2 Technologieauswahl

Für die Umsetzung wurden Technologien gewählt, die zum Modul **210 Public Cloud** passen: schnelle Entwicklung ohne eigenes Server-Backend, sichere Authentifizierung, Cloud-Datenbank und Anbindung einer externen REST-API (Strava).

#### Auswahlkriterien

| Kriterium | Bedeutung für das Projekt |
| --------- | ------------------------- |
| Cloud-Fähigkeit | Hosting und Backend in der Public Cloud (Supabase) |
| Entwicklungsgeschwindigkeit | Einzelprojekt mit begrenztem Zeitbudget (15.–27.06.2026) |
| Sicherheit | Auth, RLS und serverseitige Strava-Integration (NF3, NF4) |
| Wartbarkeit | Klare Trennung Frontend / Backend / externe API |
| Kosten | Nutzung kostenfreier Tiers für Lern- und Demo-Zwecke |
| Lernziel Modul 210 | Nachweis von BaaS, externer API-Integration und Cloud-Deployment |

*Tabelle 3.4 – Auswahlkriterien für Technologien*

#### Technologieübersicht

| Bereich | Technologie | Version / Anmerkung | Einsatz im Projekt |
| ------- | ----------- | ------------------- | ------------------ |
| IDE | Cursor | — | Entwicklung, Refactoring, KI-gestützte Codegenerierung |
| Laufzeit / Build | Node.js, Vite | Vite 8.0.x | Dev-Server, Production-Build |
| Frontend-Framework | React | 19.2.x | UI-Komponenten, Routing, State |
| Routing | React Router | 7.18.x | Öffentliche und geschützte Seiten |
| Backend (BaaS) | Supabase | Cloud (EU) | Auth, DB, Storage, Edge Functions |
| DB-Client | @supabase/supabase-js | 2.108.x | Frontend-Zugriff auf Auth, DB, Storage, Functions |
| Datenbank | PostgreSQL | 15 via Supabase | profiles, races, strava_activities |
| Authentifizierung | Supabase Auth | JWT | Registrierung, Login, Session |
| Datei-Speicher | Supabase Storage | Bucket `images` | Bilder auf Home und About |
| Serverlogik | Supabase Edge Functions | Deno | Strava OAuth, Sync, Webhook |
| Externe API | Strava API v3 | REST + Webhooks | Trainingsdaten des Sportlers |
| Karten | Leaflet, react-leaflet | 1.9 / 5.x | Routenanzeige in Trainingsdetails |
| Polyline | @mapbox/polyline | 1.2.x | Decoding der Strava-Routen |
| Tests | Vitest, Testing Library | Vitest 4.1.x | Unit-Tests für Utils und Auth-Guard |
| Qualitätssicherung | ESLint | 10.x | Statische Code-Analyse |
| Versionsverwaltung | Git / GitHub | — | Quellcode, Dokumentation, Deployment |

*Tabelle 3.5 – Technologieübersicht*

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

PostgreSQL ist robust, relational und gut für die vorliegenden Entitäten (Profile, Races, Activities) geeignet. RLS-Policies werden direkt in der Datenbank definiert und gelten unabhängig vom Frontend — wichtig für NF4 und für geschützte Trainingsdetails (F16). Zusätzlich wird eine **View** (`strava_activities_overview`) genutzt, um Gästen nur eine reduzierte Spaltenmenge anzuzeigen.

**Strava API**

Da die Trainingsdaten des Auftraggebers bereits in Strava vorliegen, ist die Strava API v3 die naheliegende Quelle. OAuth 2.0 ermöglicht die Autorisierung; die API wird ausschliesslich serverseitig (Edge Functions) aufgerufen.

Geplant war ein **Webhook** für automatische Synchronisation bei Create/Update/Delete von Aktivitäten. In der Praxis wurde aus Zeitgründen ein **manueller Sync** über einen Admin-Button in der Trainingsübersicht umgesetzt (Edge Function `sync-strava-activities`). Die Webhook-Infrastruktur (`strava-webhook`, `strava_webhook_events`) ist vorbereitet, aber nicht produktiv im Einsatz.

**Leaflet und Mapbox Polyline**

Für die Darstellung der Trainingsroute in den Activity Details wird Leaflet als etablierte Open-Source-Kartenbibliothek verwendet. Strava liefert Routen als encoded Polyline (`summary_polyline` im `map`-Objekt); `@mapbox/polyline` decodiert diese für die Karte.

*Hinweis: Der Code für die Leaflet- und Polyline-Darstellung wurde mit Cursor generiert.*

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
| Direkter Strava-Aufruf aus dem Browser | Access Tokens wären im Client sichtbar; Sicherheitsrisiko |

*Tabelle 3.6 – Abgelehnte Alternativen*

### 3.3 Systemarchitektur

Die Webapplikation folgt einer **BaaS-Architektur (Backend as a Service)** mit drei Schichten:

| Schicht | Komponente | Verantwortung |
| ------- | ---------- | ------------- |
| Präsentation | React SPA (Vite) | UI, Routing, Formulare, Auth-State |
| Anwendungslogik / Daten | Supabase Plattform | Auth, PostgreSQL + RLS, Storage, Edge Functions |
| Externe Dienste | Strava API | Trainingsdaten, OAuth |

*Tabelle 3.7 – Architekturschichten*

Das React-Frontend kommuniziert ausschliesslich mit **Supabase**. Die Anbindung an **Strava** erfolgt serverseitig über **Supabase Edge Functions**, nicht direkt aus dem Browser.

#### Datenflüsse

1. **Benutzer → Frontend → Supabase:** Login, CRUD für Races/Profile, Lesen der Aktivitäten (über PostgreSQL mit RLS)
2. **Sportler → Frontend → Edge Function → Strava → PostgreSQL:** Manueller Sync-Button ruft `sync-strava-activities` auf; Token-Refresh und Aktivitäten-Import laufen serverseitig
3. **Strava → Edge Function → PostgreSQL (optional):** Webhook-Ereignisse über `strava-webhook` (vorbereitet, nicht produktiv)
4. **Frontend → Supabase Storage:** Öffentliche Bilder (Home, About)

#### Strava-Sync-Ablauf (produktiv)

```text
  Sportler (Admin)                Edge Function                  Strava API
        │                    sync-strava-activities                    │
        │  Klick «Sync»  ──────────────►  │                               │
        │  (JWT + is_admin)               │  Token abgelaufen?            │
        │                                 │  ──ja──► refresh_token  ────► │
        │                                 │  ◄────── neues access_token   │
        │                                 │  GET /athlete/activities      │
        │                                 │  (after=last_sync)  ─────────►│
        │                                 │  ◄────── JSON-Activities      │
        │                                 │  UPSERT in strava_activities  │
        │  ◄── Erfolg/Fehler ──────────── │  UPDATE last_sync             │
        │  Liste neu laden                │                               │
```

#### Architekturdiagramm

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
              |              | (Sync, Webhook,|                 |
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

#### Frontend-Komponenten (Überblick)

| Bereich | Komponenten / Module | Aufgabe |
| ------- | -------------------- | ------- |
| Routing | `App.jsx`, `ProtectedRoute` | Öffentliche und geschützte Routen |
| Auth | `AuthContext`, `Login`, `Signup` | Session-Verwaltung, Registrierung |
| Öffentliche Seiten | `Home`, `About`, `Raceplan`, `Activities` | Informations- und Übersichtsseiten |
| Geschützte Seiten | `ActivityDetails`, `Profile` | Details und Profilverwaltung |
| Layout | `Layout` | Navigation, Header mit Username |
| Konfiguration | `config/athlete.js` | Statische Sportler-Daten (Name, Ziel, Steckbrief) |
| Hilfsfunktionen | `utils/` | Formatierung, Filter, Statistik-Gruppen |

*Tabelle 3.8 – Frontend-Struktur*

#### Edge Functions und Shared Modules

| Function / Modul | Pfad | Aufgabe |
| ---------------- | ---- | ------- |
| `sync-strava-activities` | `supabase/functions/sync-strava-activities/` | Manueller Vollsync mit Token-Refresh |
| `strava-sync` | `supabase/functions/strava-sync/` | Einzelaktivität synchronisieren |
| `strava-webhook` | `supabase/functions/strava-webhook/` | Webhook-Empfang und Deduplizierung |
| `_shared/strava/oauth.ts` | Shared | Token-Refresh-Logik |
| `_shared/strava/mapper.ts` | Shared | Strava-JSON → DB-Zeile |
| `_shared/sync/sync-all.ts` | Shared | Batch-Sync aller Aktivitäten |

*Tabelle 3.9 – Serverseitige Integrationslogik*

Shared Modules werden per TypeScript-Import eingebunden — es gibt keine HTTP-Aufrufe zwischen eigenen Functions.

#### Architekturentscheidungen

| Aspekt | Begründung |
| ------ | ---------- |
| Kein direkter Frontend-Zugriff auf Strava | Access Tokens und API-Keys bleiben serverseitig in Edge Functions |
| Auth und DB unter Supabase | Beide Dienste gehören zur gleichen Plattform; das Frontend nutzt einen gemeinsamen Supabase-Client |
| RLS auf PostgreSQL | Rollen (Gast, User, Admin) werden auf Datenbankebene durchgesetzt (vgl. NF4) |
| View für Aktivitätsübersicht | Gäste sehen nur reduzierte Felder, ohne Zugriff auf die Volltabelle |
| Edge Functions als Integrationslayer | Token-Pflege, Sync und Webhook zentral; Frontend triggert nur den Sync |
| Statische Athleten-Daten im Frontend | Name, Ziel und Steckbrief ändern sich selten; kein CMS nötig |

*Tabelle 3.10 – Architekturentscheidungen*

### 3.4 Datenmodell

Das Datenmodell bildet die Entitäten des Systems in PostgreSQL ab. Es umfasst fünf Tabellen und eine View. Die Beziehungen sind bewusst einfach gehalten, da die Plattform nur einen Sportler bedient.

#### Entity-Relationship-Übersicht

```text
  auth.users (Supabase)
       │
       │ 1:1
       ▼
  profiles ─────────────────────────────────────────┐
  (id, username, role)                            │
                                                  │
  races                                           │  (kein FK –
  (Wettkampfdaten, CRUD durch Admin)              │   ein Sportler)
                                                  │
  strava_activities ◄── Sync ── strava_connection │
  (Trainingsdaten aus Strava)      (OAuth-Tokens) │
                                                  │
  strava_webhook_events                           │
  (Deduplizierung Webhook-Events)                 │
                                                  │
  strava_activities_overview (View)               │
  (reduzierte Spalten für Gäste)                  │
```

#### Tabellen im Überblick

| Tabelle / View | Zweck | Schreibzugriff |
| -------------- | ----- | -------------- |
| `profiles` | Benutzerprofil mit Rolle | User (eigenes Profil), Trigger bei Signup |
| `races` | Wettkampfplan | Admin (CRUD), alle (READ) |
| `strava_activities` | Vollständige Trainingsdaten | Edge Functions (UPSERT), User (READ) |
| `strava_activities_overview` | Öffentliche Trainingsliste | View (READ für alle) |
| `strava_connection` | OAuth-Tokens für Strava | Edge Functions |
| `strava_webhook_events` | Webhook-Deduplizierung | Edge Functions |

*Tabelle 3.11 – Tabellenübersicht*

#### Tabelle `profiles`

Verknüpft Supabase-Auth-Benutzer mit Anwendungsdaten. `id` ist gleichzeitig Primary Key und Foreign Key auf `auth.users.id`.

| Attribut | Datentyp | Beschreibung |
| -------- | -------- | ------------ |
| id | uuid (PK/FK) | Referenz auf `auth.users` |
| username | text | Anzeigename, bei Registrierung gesetzt |
| role | text | `user` (Standard) oder `admin` (Sportler) |
| created_at | timestamp | Erstellungszeitpunkt |

**Trigger:** `handle_new_user` legt bei Signup automatisch eine Profilzeile an.

#### Tabelle `races`

Speichert geplante und vergangene Wettkämpfe. Wird vom Sportler über die Raceplan-UI gepflegt.

| Attribut | Datentyp | Beschreibung |
| -------- | -------- | ------------ |
| id | int8 (PK) | Autoinkrement |
| name | text | Name des Wettkampfs |
| location | text | Austragungsort |
| country_code | varchar(2) | ISO-Ländercode |
| race_date | date | Datum des Events |
| discipline | text | Sportart (z. B. Triathlon) |
| distance | text | Distanz (z. B. Ironman, Half) |
| event_link | text | Link zur offiziellen Veranstaltungsseite |
| goal | text | Persönliches Ziel für den Wettkampf |
| result | text | Ergebnis nach Abschluss (optional) |
| updated_at | timestamp | Letzte Änderung |
| created_at | timestamp | Erstellungszeitpunkt |

#### Tabelle `strava_activities`

Enthält synchronisierte Trainingsdaten aus der Strava API. `strava_activity_id` ist der natürliche Schlüssel für Upserts beim Sync.

| Attribut | Datentyp | Beschreibung |
| -------- | -------- | ------------ |
| id | int8 (PK) | Interne ID |
| strava_activity_id | int8 (unique) | ID auf Strava |
| name | text | Aktivitätsname |
| sport_type | text | Sportart (Run, Ride, Swim, …) |
| start_date | timestamp | Startzeit (UTC) |
| start_date_local | timestamp | Startzeit (lokal) |
| distance | numeric | Distanz in Metern |
| moving_time | int4 | Bewegungszeit in Sekunden |
| elapsed_time | int4 | Gesamtzeit in Sekunden |
| total_elevation_gain | numeric | Höhenmeter gesamt |
| elev_low | numeric | Minimale Höhe |
| elev_high | numeric | Maximale Höhe |
| average_speed | numeric | Durchschnittsgeschwindigkeit |
| max_speed | numeric | Maximalgeschwindigkeit |
| device_watts | boolean | Leistungsmesser vorhanden |
| average_watts | numeric | Durchschnittsleistung |
| weighted_average_watts | numeric | Gewichtete Durchschnittsleistung |
| max_watts | numeric | Maximalleistung |
| has_heartrate | boolean | Herzfrequenz vorhanden |
| average_heartrate | numeric | Durchschnittspuls |
| max_heartrate | numeric | Maximalpuls |
| kilojoules | numeric | Energieumsatz |
| location_city | text | Stadt (aus Strava) |
| location_state | text | Region (aus Strava) |
| summary_polyline | text | Encodierte Route für Karte |
| start_latlng | numeric[] | Startkoordinaten |
| end_latlng | numeric[] | Endkoordinaten |
| raw_data | jsonb | Vollständiges Strava-JSON |
| synced_at | timestamp | Zeitpunkt des letzten Syncs |
| created_at | timestamp | Erstellungszeitpunkt |
| updated_at | timestamp | Letzte Aktualisierung |

#### View `strava_activities_overview`

Reduzierte Sicht für Gäste. Enthält nur: `id`, `name`, `distance`, `moving_time`, `total_elevation_gain`, `sport_type`, `start_date_local`. RLS erlaubt SELECT für alle (`using (true)`).

#### Tabelle `strava_connection`

Speichert die OAuth-Verbindung zum Strava-Konto des Sportlers (eine Zeile, `id = 1`). Wird von den Edge Functions für Token-Refresh und Sync verwendet.

| Attribut | Datentyp | Beschreibung |
| -------- | -------- | ------------ |
| id | int8 (PK) | Immer `1` (Single-Athlete-Setup) |
| access_token | text | Aktuelles Strava Access Token |
| refresh_token | text | Token zum Erneuern |
| expires_at | timestamptz | Ablaufzeit des Access Tokens |
| last_sync | timestamptz | Zeitpunkt des letzten erfolgreichen Syncs |
| updated_at | timestamptz | Letzte Änderung |
| created_at | timestamptz | Erstellungszeitpunkt |

#### Tabelle `strava_webhook_events`

Deduplizierung eingehender Strava-Webhook-Events. Strava kann dasselbe Event mehrfach senden; `event_id` ist eindeutig.

| Attribut | Datentyp | Beschreibung |
| -------- | -------- | ------------ |
| id | int8 (PK) | Interne ID |
| event_id | int8 (unique) | Strava-Event-ID |
| object_id | int8 | Betroffene Aktivitäts-ID |
| received_at | timestamptz | Empfangszeitpunkt |

#### SQL-Artefakte im Repository

Die RLS-Policies und Hilfsfunktionen liegen als SQL-Dateien im Ordner `supabase/`:

| Datei | Inhalt |
| ----- | ------ |
| `rls-races.sql` | `is_admin()`-Funktion; SELECT/INSERT/UPDATE/DELETE-Policies für `races` |
| `rls-activities.sql` | View `strava_activities_overview`; SELECT-Policies für Gäste und User |
| `profiles-trigger.sql` | Trigger `handle_new_user`; RLS für `profiles` |
| `profiles-delete-account.sql` | Policy und Logik zum Kontolöschen |

*Tabelle 3.12 – SQL-Dateien für Datenbankschema*



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