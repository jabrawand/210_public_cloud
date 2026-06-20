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
  

---

## 1. Einleitung

Der Auftraggeber ist ein junger Ausdauersportler, der seine Trainings und Wettkämpfe dokumentieren und für Interessierte öffentlich zugänglich machen möchte.

### 1.1 Ausgangslage

Trainingsdaten werden über verschiedene Garmin Geräte erfasst und über die Plattform Strava für andere Sportbegeisterte zur Verfügung gestellt. Informationen zu Wettkämpfen, Trainingsplänen und persönlichen Leistungen sind jedoch nicht öffentlich und  zentral verfügbar. Dadurch entsteht ein erhöhter Verwaltungsaufwand und Sponsoren, Freunde, Familie und Fans erhalten keinen strukturierten Überblick über aktuelle Aktivitäten und geplante Wettkämpfe.

### 1.2 Projektziel

Ziel des Projekts ist die Entwicklung einer Fullstack-Webapplikation mit folgenden Funktionen:

* Öffentliche Anzeige von Trainings und Wettkämpfen
* Benutzerregistrierung und Authentifizierung
* Rollenbasierte Zugriffssteuerung
* Verwaltung von Trainings- und Wettkampfdaten
* Integration der Strava API zur Übernahme von Trainingsdaten
* Responsives Design für Desktop und mobile Geräte

### 1.3 Projektabgrenzung

**Bestandteile des Projekts**

* Entwicklung einer Webapplikation mit React
* Backend mit Supabase (Datenbank, Authentifizierung und Storage)
* Strava-OAuth-Authentifizierung
* Strava-Webhook-Integration zur Synchronisierung von Aktivitäten
* Rollenmodell (Gast, Benutzer, Sportler)
* CRUD-Funktionen für Trainings und Wettkämpfe
* Responsives Webdesign für Desktop und Mobile

**Nicht Bestandteil des Projekts**

* Entwicklung einer nativen Mobile-App
* Mehrsprachigkeit
* Social-Media-Funktionen (Kommentare, Likes, Teilen)
* Push-Benachrichtigungen
* Sponsoring- oder Zahlungsfunktionen
* Administrationsbereich für mehrere Sportler

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

### 3.1 Technologieauswahl

| Bereich            | Technologie           |
| ------------------ | --------------------- |
| Frontend           | React                 |
| Backend            | Supabase              |
| Datenbank          | PostgreSQL (Supabase) |
| Authentifizierung  | Supabase Auth         |
| API                | Strava API            |
| Versionsverwaltung | Git                   |

### 3.2 Systemarchitektur

```text
+----------------+
|   Benutzer     |
+--------+-------+
         |
         v
+----------------+
| React Frontend |
+--------+-------+
         |
         +----------------+
         |                |
         v                v
+----------------+  +----------------+
| Supabase Auth  |  | Strava API     |
+----------------+  +----------------+
         |
         v
+----------------+
| PostgreSQL DB  |
+----------------+
```

### 3.3 Datenmodell


### 3.4 Arbeitsplanung

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

*Tabelle 2.1 – Zeitliche Arbeitsplanung als Arbeitspakete*

