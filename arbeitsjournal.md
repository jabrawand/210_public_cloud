# Arbeitsjournal (Referenz Arbeitsplanung)

Das Arbeitsjournal dokumentiert je Arbeitsblock das zugehörige Arbeitspaket (AP) aus der Arbeitsplanung, die tatsächliche Dauer und allfällige Probleme oder Anpassungen. Es wurde als fortlaufende Notizen geführt und verweist auf die AP-Nummern aus Abschnitt 3.


| Datum | Beschreibung | Arbeits-paket | Zeit | Probleme / Schwierigkeiten |
| ----- | ------------ | ------------- | ---- | -------------------------- |
| 15.06.26 | Gespräch mit Auftraggeber, Erwartungen und Rahmen abgestimmt | AP1 | 0.5 h | — |
| 15.06.26 | Ausgangslage, Problemstellung, Projektziel und Abgrenzung definiert | AP1 | 0.5 h | — |
| 15.06.26 | User Stories mit Akzeptanzkriterien erarbeitet | AP1 | 1.5 h | — |
| 15.06.26 | Rollenmodell (Gast, User, Admin) festgelegt | AP1 | 0.5 h | — |
| 15.06.26 | Funktionale und nicht-funktionale Anforderungen formuliert | AP1 | 0.75 h | — |
| 15.06.26 | Arbeitsplanung mit Zeitschätzung pro Arbeitspaket erstellt | AP1 | 1 h | — |
| 15.06.26 | YouTube-Video zu Supabase angeschaut, Notizen zu Supabase Auth erstellt | AP2 | 2 h | — |
| 16.06.26 | Supabase-Projekt eingerichtet, Tabellen, RLS-Policies und CRUD für Races | AP3 | 2 h | Strava-Datenmodell noch unklar → Tabelle `strava_activities` zunächst zurückgestellt |
| 16.06.26 | Strava-API-Dokumentation gelesen (OAuth, Token-Management) | AP4 | 1 h | — |
| 16.06.26 | Strava-OAuth mit Auftraggeber durchgeführt und Token in DB gespeichert | AP4 | 2 h | 1. Versuch: falscher POST für `access_token`; 2. Versuch: Scope nur `read` (kein Zugriff auf Activities); 3. Versuch erfolgreich |
| 17.06.26 | Strava-API-Dokumentation gelesen (Endpoints, Webhooks) | AP4 | 2 h | — |
| 17.06.26 | Edge Functions erstellt (`strava_auth`, `strava_sync`, `strava_activities_sync`, `strava_webhook`) mit KI-Unterstützung | AP3/AP4 | 2.5 h | OAuth war bereits manuell umgesetzt; `strava_auth` macht dasselbe → trotzdem beibehalten |
| 17.06.26 | Supabase Storage (Bucket `images`) eingerichtet | AP3 | 0.25 h | — |
| 18.06.26 | Tabelle `strava_activities` neu erstellt und Felder angepasst | AP3 | 1 h | — |
| 18.06.26 | Webhook-Troubleshooting mit Arbeitskollege | AP4 | 0.5 h | Test-Event liefert «Not create activities», obwohl neue Aktivität auf Strava vorhanden → Ursache noch offen |
| 18.06.26 | React-Frontend initialisiert: Layout, Routing, Login, Signup, Home und About (Gerüst) | AP5 | 2 h | — |
| 19.06.26 | Frontend Raceplan und Activities umgesetzt | AP5 | 2 h | Activities-Liste leer → RLS-Policies nach Tabellen-Neuerstellung vergessen |
| 19.06.26 | CSS auf allen Seiten ergänzt, Bilder aus Supabase Storage eingebunden | AP5 | 2 h | Bild nicht sichtbar → Storage-Pfad falsch, Code war korrekt |
| 19.06.26 | Polyline-Mapping behoben (`summary_polyline` liegt in `map`, nicht direkt in Activity) | AP4/AP5 | 0.5 h | — |
| 20.06.26 | Strava-Daten neu synchronisiert, damit `summary_polyline` in der DB aktualisiert wird | AP10 | 0.5 h | — |
| 20.06.26 | RLS angepasst: Trainingsübersicht für Gäste, Details nur für eingeloggte User | AP7 | 0.5 h | Übersicht nach Policy-Änderung für Gäste nicht mehr sichtbar → SELECT-Policy für alle ergänzt |
| 20.06.26 | `profiles` mit `auth.users` verknüpft, Username bei Registrierung erfasst | AP3 | 0.5 h | — |
| 20.06.26 | Raceplan-CRUD: Admin-Berechtigung über `is_admin()` in der DB geprüft | AP7 | 1 h | User und Admin konnten Races hinzufügen → Berechtigungsprüfung fehlte |
| 20.06.26 | Activity Details ausgebaut (u. a. min./max. Höhe, gruppierte Statistiken) | AP4/AP5 | 1 h | — |
| 21.06.26 | Profilverwaltung für eingeloggte User umgesetzt | AP5 | 0.75 h | DELETE zunächst für `public` statt `authenticated` → Supabase-Warnung, Policy angepasst |
| 21.06.26 | Unit-Tests mit Vitest geschrieben (Utils, ProtectedRoute) | AP7 | 1.5 h | — |
| 21.06.26 | React-Code strukturiert: wiederkehrende Logik in `utils/` ausgelagert | AP5 | 1 h | Gleiche Hilfsfunktionen waren in mehreren Komponenten dupliziert |
| 21.06.26 | Code-Review mit KI, Findings in `CODE_REVIEW_ISSUES.md` dokumentiert | AP7 | 1 h | — |
| 21.06.26 | Treffen mit Sponsor, Besprechung von Activities-Anzeige in UI | AP7 | 1h | Wichtigste Werte Watt, Herzfrequenz |
| 22.06.26 | Strava Edge Functions refaktoriert: eine grosse Edge Function `sync-strava-activities` prüft `expires_at`, wenn nötig mit `refresh_token` neues `access_token` anfordern, in `strava_connection` abspeichern, fetch activities mit `after=last_sync`, in DB abspeichern | AP4 | 2 h | Webhook habe ich nicht hinbekommen. Aus Zeitlichen Gründen habe ich mich für einen Button in der UI entschieden, mit welchem die Aktivitäten synchronisiert werden können. |
| 22.06.26 | Dokumentation ergänzt: Datenmodell, Strava-Integration (Kap. 4.4) und Deployment (Kap. 4.6) | AP8 | 0.5 h | — |
| 23.06.26 | Ausarbeiten Dokumentation Kapitel 1 | AP7 | 0.75 h | — |
| 23.06.26 | Admin-Button «Strava synchronisieren» auf Trainingsübersicht: nur sichtbar bei `is_admin()`, ruft Edge Function `sync-strava-activities` auf, Liste wird nach Sync neu geladen | AP5 | 1 h | — |
| 23.06.26 | Sync aus Browser schlug fehl (curl funktionierte): CORS-Preflight (`OPTIONS`) in Edge Function ergänzt, Frontend-Aufruf auf `fetch` mit Session-JWT umgestellt | AP4 | 0.75 h | Fehler «Failed to send a request to the Edge Function» — Browser blockiert Request ohne OPTIONS-Handler |

**Summe protokollierte Arbeitszeit:** ca. 38.5 h

| Arbeitspaket | Summe (Ist) |
| ------------ | ----------- |
| AP1 | 4.75 h |
| AP2 | 2 h |
| AP3 | 6.25 h |
| AP4 | 12.75 h |
| AP5 | 11.75 h |
| AP7 | 5.25 h |
| AP8 | 0.5 h |
| AP10 | 0.5 h |
