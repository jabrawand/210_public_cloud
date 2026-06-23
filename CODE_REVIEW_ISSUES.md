# Code Review – webpage-jabra

Stand: Juni 2026

Überblick: Die Aufteilung in `utils/` und Vitest-Tests ist sinnvoll. Es gibt jedoch konkrete Bugs, Inkonsistenzen und Verbesserungspotenzial.

---

## Kritisch (sollte behoben werden)

### 1. Falscher Feldname im Strava-Link

**Datei:** `src/components/ActivityDetails.jsx`

Die Bedingung prüft `strava_activity_id`, der Link verwendet aber `strava_id` — dieses Feld existiert nicht in der Datenbank.

```jsx
{activity.strava_activity_id && (
    <a href={`https://www.strava.com/activities/${activity.strava_id}`}>
```

**Fix:** `activity.strava_activity_id` im `href` verwenden.

---

### 2. Standort wird nie aus Strava synchronisiert

**Dateien:** `src/utils/activityDetails.js`, `supabase/strava_activities.ts`

`formatLocation()` erwartet `location_city` und `location_state`, aber `strava_activities.ts` mappt diese Felder nicht. Es wird praktisch immer der Fallback aus `athlete.location` angezeigt.

**Fix:** location_city wird von Sportler nicht verwendet, location kann aus acitvities raus

---

### 3. Inkonsistente Tabellennamen in Supabase-Functions

| Datei | Tabelle |
|-------|---------|
| `supabase/strava_activities.ts` | `strava_connection` |
| `supabase/strava_token_sync.ts` | `strava_connections` |

Eine der beiden Dateien passt vermutlich nicht zum Schema — Token-Refresh kann so still fehlschlagen.

**Fix:** Edge Functions überarbeiten.

---

## Mittel (Qualität & UX)

### 4. Uneinheitliches Error-/Loading-Handling

| Komponente | Loading | Fehleranzeige |
|------------|---------|---------------|
| `Activities.jsx` | ja | ja |
| `ActivityDetails.jsx` | ja | nur „nicht gefunden“ |
| `Raceplan.jsx` | nein | nein (nur `console.error`) |

Besonders beim Löschen in `Raceplan` gibt es bei Fehlern keine Rückmeldung an den User.

**Fix:** Einheitliches Pattern für Loading- und Fehlerzustände in allen Komponenten.

---

### 5. Strava-Sync: nur 50 Aktivitäten, kein Token-Refresh

**Datei:** `supabase/strava_activities.ts`

```typescript
`https://www.strava.com/api/v3/athlete/activities?after=${afterUnix}&per_page=50`
```

- Keine Pagination → bei mehr als 50 neuen Aktivitäten gehen Daten verloren.
- Kein Token-Refresh vor dem API-Call → abgelaufene Tokens führen zu Fehlern.
- `strava_token_sync.ts` ist nicht eingebunden.

**Fix:** Edge Functions überarbeiten. 

---

### 6. `matchesFilter` — stiller Fallback

**Datei:** `src/utils/activities.js`

Unbekannte Filter zeigen alle Aktivitäten statt nichts (`return true` am Ende der Funktion).

**Fix:** `return false` für unbekannte Filter.

---

### 7. Accessibility bei klickbaren Listen

**Dateien:** `src/components/Activities.jsx`, `src/components/Raceplan.jsx`

`<li>`-Elemente sind per `onClick` klickbar, ohne:

- `role="button"`
- `tabIndex={0}`
- Keyboard-Handler (`Enter` / `Space`)

**Fix:** Semantische Buttons oder vollständige Keyboard-Unterstützung ergänzen.

---

### 8. `ProtectedRoute` — leerer Bildschirm beim Laden

**Datei:** `src/components/ProtectedRoute.jsx`

Während Auth lädt, wird `null` zurückgegeben → kurzer weißer Bildschirm.

**Fix:** Loading-Spinner oder Platzhalter wie in `ActivityDetails`.

---

### 9. `ActivityMap` — unnötige Re-Renders

**Datei:** `src/components/ActivityMap.jsx`

`decodePolyline()` erzeugt bei jedem Render ein neues Array → `FitBounds`-Effect kann mehrfach `fitBounds` aufrufen.

**Fix:** Ergebnis mit `useMemo` stabilisieren.

---

### 10. Doppelte React-Imports

**Dateien:** `Activities.jsx`, `ActivityDetails.jsx`, `Raceplan.jsx`

```javascript
import React from 'react'
import { useState, useEffect } from 'react'
```

**Fix:** Ein Import reicht.

---

## Klein (Code-Qualität & Konsistenz)

### 11. `formatHeaderDate` gehört in `dateFormat.js`

**Datei:** `src/components/ActivityDetails.jsx`

`Activities` und `Raceplan` nutzen bereits `utils/dateFormat.js`. Die Datumsformatierung in `ActivityDetails` (Zeilen 26–36) sollte dort hin.

---

### 12. Tippfehler im UI-Text

**Datei:** `src/components/Activities.jsx`

> „Hier findest du eine Übersicht **meinen** Trainingseinheiten“

**Fix:** „**meiner** Trainingseinheiten“

---

### 13. Toter Code

- `activity.map_summary_polyline` in `ActivityDetails.jsx` — Feld existiert im Schema nicht (nur `summary_polyline`).
- `supabase/strava_token_sync.ts` — scheint ungenutzt und inkonsistent.

---

### 14. Raceplan: Klick auf Details klappt Karte zu

**Datei:** `src/components/Raceplan.jsx`

Das ganze `<li>` hat `onClick={() => toggleRace(...)}`. Klicks auf Links oder Buttons nutzen `stopPropagation`, aber Klicks auf Text in den Details schliessen die Karte wieder.

**Fix:** Toggle nur auf Header-Bereich legen.

---

### 15. Keine Validierung im Raceplan-Formular

**Datei:** `src/components/Raceplan.jsx`

- `country_code`: nur `maxLength={3}`, kein Pattern (z. B. `[A-Z]{2,3}`).
- `event_url`: Pflichtfeld — für geplante Rennen ohne Link evtl. zu strikt.

**Fix:** `country_code` maxLength={2} wie in db, Pattern `[A-Z]`, `event_url`: kein Pflichtfeld

---

## Tests

**Gut abgedeckt:** `activities.js`, `activityDetails.js`, `raceplan.js`, `map.js`, `ProtectedRoute`

**Fehlt:**

| Bereich | Empfehlung |
|---------|------------|
| Komponenten | Smoke-Tests für `Activities`, `ActivityDetails`, `Raceplan` |
| Strava-Link | Regression-Test für korrektes Feld `strava_activity_id` |
| `matchesFilter` | Test für unbekannten Filter → `false` |
| Integration | Supabase-Mocks für Fetch-Logik in Komponenten |

---

## Architektur (optional, langfristig)

1. **Datenzugriff zentralisieren** — `getStravaActivities`, `getActivity`, `getRaces` in `src/api/` oder Custom Hooks (`useActivities`, `useRaces`).
2. **Custom Hook `useSupabaseQuery`** — einheitliches Loading/Error-Pattern.
3. **Raceplan aufteilen** — Formular und Kartenliste in eigene Komponenten (ca. 380 Zeilen).

---

## Priorisierte To-do-Liste

| Prio | Aufgabe | Aufwand |
|------|---------|---------|
| 🔴 | Strava-Link: `strava_activity_id` statt `strava_id` | 1 Min |
| 🔴 | Tabellennamen `strava_connection(s)` vereinheitlichen | 10 Min |
| 🟡 | Standort-Felder synchronisieren oder Fallback entfernen | 15 Min |
| 🟡 | Loading/Error in `Raceplan` | 20 Min |
| 🟡 | Strava-Sync: Pagination + Token-Refresh | 1–2 h |
| 🟢 | A11y, Doppel-Imports, Tippfehler, `useMemo` in Map | je 5–15 Min |
| 🟢 | Komponenten-Tests ergänzen | 1–2 h |
