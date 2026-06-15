# Projektdokumentation

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
  - [2.3 User Stories](#23-user-stories
  

---

## 1. Einleitung

### 1.1 Ausgangslage

Ein junger Sportler verwaltet seine Trainings und Wettkämpfe aktuell über verschiedene Plattformen. Trainingsdaten werden über Strava erfasst, während die Wettkampfplanung und -vorbereitung an verschiedenen anderen Orten gespeichert werden. Es entsteht ein hoher Verwaltungsaufwand welcher potenzielle Trainingszeit kostet.

### 1.2 Projektziel

Ziel des Projektes ist die Entwicklung einer Fullstack-Webapplikation, welche Trainingsdaten und Wettkampfplanung zentral verwaltet und vereint. Die Anwendung soll Trainingsdate aus Strava integrieren und unterschiedliche Benutzerrollen unterstützen.

### 1.3 Projektabgrenzung

**Im Projekt enthalten**

- Registrierung und Login
- Rollenverwaltung
- Anzeige von Trainings und Wettkämpfen
- Verwaltung von Trainings- und Raceplan-Einträgen
- Strava-Integration

**Nicht Bestandteil**

- Mobile App
- Mehrsprachigkeit
- Zahlungsfunktion (Sponsoring)

---

## 2. Analyse

### 2.1 Stakeholder


| Stakeholder             | Interesse                                    |
| ----------------------- | -------------------------------------------- |
| Sportler                | Verwaltund von Trainings- und Wettkampfdaten |
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
- Profil verwalten
- Konto löschen

#### 2.2.3 Sportler (Admin Benutzer)

- Alle User-Funktionen
- Trainings verwalten
- Wettkämpfe verwalten

### 2.3 User Stories

#### Rolle: Gast (unregistrierter Benutzer)

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

**Als Gast möchte ich** den Raceplan einsehen können, damit ich geplante Wettkämpfe sehen kann.

**Akzeptanzkriterien**

- Die Raceplan-Seite ist ohne Anmeldung erreichbar.
- Alle geplanten Wettkämpfe werden angezeigt.
- Ein Link führt zu der offiziellen Wettkampf-Seite.

---

#### US4: Trainingsübersicht anzeigen

**Als Gast möchte ich** die Trainingsseite ansehen können, damit ich einen Überblick über die Trainingsinhalte bekomme.

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
- Pflichtfelder werden validiert.
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

**Als Sportler möchte ich** neue Wettkämpfe im Racepan anlegen können, damit die Besucher aktuelle Wettkampftermine sehen.

**Akzeptanzkriterien**

- Der Sportler kann einen neuen Eintrag erstellen.
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

#### US12: Training erstellen

**Als Sportler möchte ich** neue Trainingseinträge erstellen können, damit aktuelle Trainings veröffentlicht werden.

**Akzeptanzkriterien**

- Der Sportler kann Trainingsdaten erfassen.
- Pflichtfelder werden angezeigt und müssen ausgefüllt werden.
- Das Training ist nach dem Speichern in der Trainingsübersicht zu sehen.

---

#### US13: Training löschen

**Als Sportler möchte ich** Trainingseinträge löschen können, damit veraltete Inhalte entfernt werden.

**Akzeptanzkriterien**

- Trainingseinträge können gelöscht werden.
- Vor dem Löschen wird eine Bestätigung verlangt.
- Der Eintrag wird aus der Trainingsliste entfernt.

---

