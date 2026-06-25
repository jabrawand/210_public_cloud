# 210_public_cloud – Sportler-Webapplikation

Fullstack-Webapplikation im Rahmen des Moduls **210 – Public Cloud**. Die Plattform bündelt Trainings- und Wettkampfinformationen für einen Ausdauersportler und bindet Trainingsdaten über die Strava-API an.

---

## Überblick

Die Anwendung dient als persönlicher Sportler-Auftritt mit:

- **Startseite & About** – öffentliche Informationen zum Sportler
- **Raceplan** – Wettkämpfe anzeigen; Admin kann Einträge verwalten
- **Trainingsübersicht** – öffentliche Liste aus Strava (reduzierte Felder)
- **Trainingsdetails** – nur für registrierte User (Distanz, Pace, HF, Karte, …)
- **Profil** – Registrierung, Login, Profilverwaltung, Kontolöschung
- **Strava-Sync** – manueller Import der Aktivitäten über eine Supabase Edge Function

Der Auftraggeber ist Jan Brawand (Triathlon, Ziel: Ironman Thun 2027).

---

## Tech-Stack

| Bereich | Technologie |
| ------- | ----------- |
| Frontend | React 19, Vite 8, React Router 7 |
| Karten | Leaflet, react-leaflet |
| Backend | Supabase (Auth, PostgreSQL, Storage, Edge Functions) |
| Externe API | Strava REST API (OAuth 2.0) |
| Tests | Vitest, Testing Library |

---

## Projektstruktur

```text
210_public_cloud/
├── webpage-jabra/          # React-Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Seiten und UI-Komponenten
│   │   ├── context/        # AuthContext
│   │   ├── utils/          # Hilfsfunktionen
│   │   └── config/         # Statische Sportler-Daten
│   └── tests/              # Unit-Tests (Vitest)
├── supabase/
│   ├── *.sql               # RLS, Trigger, Views
│   └── functions/          # Edge Functions (Strava-Integration, Referenz)
├── documentation.md        # Vollständige Projektdokumentation (Modul 210)
├── arbeitsjournal.md       # Arbeitsjournal mit Zeitaufwand
└── CODE_REVIEW_ISSUES.md   # Code-Review-Fundstücke
```

---

## Voraussetzungen

- [Node.js](https://nodejs.org/) (LTS empfohlen)
- Zugang zu einem eingerichteten [Supabase](https://supabase.com/)-Projekt (URL und Publishable Key)

Backend, Datenbank und Strava-Anbindung sind bereits deployed. Details dazu stehen in [`documentation.md`](documentation.md), Abschnitt 4.

---

## Lokale Installation (React)

### 1. Repository klonen

```bash
git clone https://github.com/jabrawand/210_public_cloud.git
cd 210_public_cloud
```

### 2. Frontend einrichten

```bash
cd webpage-jabra
npm install
```

Erstelle eine `.env.local`-Datei im Ordner `webpage-jabra/`:

```env
VITE_SUPABASE_URL=SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=SUPABASE_PUBLISHABLE_KEY
```

Die Werte werden aus Sicherheitsgründen nicht über GitHub geteilt und werden für die Abgabe separat mitgeliefert.

Frontend starten:

```bash
npm run dev
```

Die App läuft standardmässig unter `http://localhost:5173`.

Weitere Frontend-Befehle:

```bash
npm run build    # Production-Build
npm run preview  # Build lokal testen
npm run lint     # ESLint
npm test         # Vitest (Watch-Modus)
npm run test:run # Vitest einmalig
```

---

## Routen

| Route | Zugriff | Beschreibung |
| ----- | ------- | ------------ |
| `/` | Öffentlich | Startseite |
| `/about` | Öffentlich | Steckbrief |
| `/raceplan` | Öffentlich | Wettkampfplan |
| `/activities` | Öffentlich | Trainingsübersicht |
| `/activities/:id` | User | Trainingsdetails |
| `/profile` | User | Profilverwaltung |
| `/login`, `/signup` | Öffentlich | Authentifizierung |

---

## Rollenmodell

| Rolle | Auth | Rechte |
| ----- | ---- | ------ |
| **Gast** | Keine | Öffentliche Seiten, Trainingsübersicht (ohne Details) |
| **User** | Supabase Auth | + Trainingsdetails, Profilverwaltung, Kontolöschung |
| **Sportler (Admin)** | Supabase Auth, `role = admin` | + Raceplan erstellen, bearbeiten, löschen, Strava-Sync |

Die Durchsetzung erfolgt im Frontend (`ProtectedRoute`, bedingte UI) und in der Datenbank (Row Level Security).

---

## Tests

Automatisierte Unit-Tests mit Vitest:

```bash
cd webpage-jabra
npm run test:run
```

Getestet werden Hilfsfunktionen (`utils/`) und der Auth-Guard (`ProtectedRoute`). Supabase- und Strava-Integration werden manuell geprüft (siehe [`documentation.md`](documentation.md), Abschnitt 5).

---

## Deployment

**Frontend:** Production-Build mit `npm run build` und statisches Hosting (z. B. Vercel, Netlify oder Supabase Hosting).

**Backend:** Supabase Cloud — Details in [`documentation.md`](documentation.md), Abschnitt 4.6.

---

## Weitere Dokumentation

| Datei | Inhalt |
| ----- | ------ |
| [`documentation.md`](documentation.md) | Analyse, Anforderungen, Architektur, Datenmodell, Supabase-Setup, Tests |
| [`arbeitsjournal.md`](arbeitsjournal.md) | Zeitaufwand und Arbeitspakete |
| [`supabase/functions/strava_sync.md`](supabase/functions/strava_sync.md) | Token-Refresh (Referenz) |
| [`supabase/functions/sync-strava-activities.md`](supabase/functions/sync-strava-activities.md) | Manueller Vollsync (Referenz) |
| [`supabase/functions/strava_initial_sync.md`](supabase/functions/strava_initial_sync.md) | Initialer Strava-Import (Referenz) |

---

## Abgabe-Hinweis

Für die Modul-Abgabe werden der erreichbare GitHub-Link und dieses README benötigt. Die `.env`-Datei mit den Secrets wird **separat** abgegeben und darf **nicht** ins Repository committed werden (siehe `.gitignore`).
