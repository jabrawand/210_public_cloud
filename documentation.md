# Projektdokumentation 

**Modul**: 210
**Projekt:** Public Cloud
**Autor:** Jasmin Brawand
**Klasse:** UIFZ-2425-005
**Datum:** 22.06.2026
**GitHub**: [Link zu GitHub](https://github.com/jabrawand/210_public_cloud)

---

## Inhaltsverzeichnis

1. [!Einleitung](#1-einleitung)
    1.1 [!Ausgangslage](#11-ausgangslage)
    1.2 [!Projektziel](#12-projektziel)
    1.3 [!Projektabgrenzung](#13-projektabgrenzung)
2. [!Analyse](#2-analyse)
    2.1 [!Stakeholder](#21-stakeholder)
    2.2 [!Rollenmodell](#22-rollenmodell)
        2.2.1 [!Gast](#221-gast-unregistrierter-benutzer)
        2.2.2 [!User](#222-user-registrierter-benutzer)
        2.2.3 [!Sportler](#223-sportler-admin-benutzer)


---
## 1. Einleitung

### 1.1 Ausgangslage

Ein junger Sportler verwaltet seine Trainings und Wettkämpfe aktuell über verschiedene Plattformen. Trainingsdaten werden über Strava erfasst, während die Wettkampfplanung und -vorbereitung an verschiedenen anderen Orten gespeichert werden. Es entsteht ein hoher Verwaltungsaufwand welcher potenzielle Trainingszeit kostet.

### 1.2 Projektziel

Ziel des Projektes ist die Entwicklung einer Fullstack-Webapplikation, welche Trainingsdaten und Wettkampfplanung zentral verwaltet und vereint. Die Anwendung soll Trainingsdate aus Strava integrieren und unterschiedliche Benutzerrollen unterstützen.

### 1.3 Projektabgrenzung

**Im Projekt enthalten**

* Registrierung und Login
* Rollenverwaltung
* Anzeige von Trainings und Wettkämpfen
* Verwaltung von Trainings- und Raceplan-Einträgen
* Strava-Integration

**Nicht Bestandteil**

* Mobile App
* Mehrsprachigkeit
* Zahlungsfunktion (Sponsoring)

---

## 2. Analyse

### 2.1 Stakeholder

| Stakeholder | Interesse |
| ----------- | --------- |
| Sportler    | Verwaltund von Trainings- und Wettkampfdaten |
| Registrierte Benutzer | Detailierte Trainingsinformationen |
| Unregistrierte Benutzer | Öffentliche Informationen | 

*Tabelle 2.1 - Stakeholderanalyse*

### 2.2 Rollenmodell

#### 2.2.1 Gast (unregistrierter Benutzer)

* Startseite ansehen
* Informationen über Sportler ansehen
* Wettkämpfe ansehen
* Trainingsübersicht ansehen
* Registrieren

#### 2.2.2 User (registrierter Benutzer)

* Alle Gast-Funktionen
* Trainigsdetails ansehen
* Profil verwalten
* Konto löschen

#### 2.2.3 Sportler (Admin Benutzer)

* Alle User-Funktionen
* Trainings verwalten
* Wettkämpfe verwalten

