# Animem — Technisches Konzept

Video-Streaming-/Serien-Plattform mit externen Video-Embeds (keine eigene
Videoinfrastruktur). Rollensystem Owner → Head Admin → Admin → User,
Forum, Support-Tickets, Watchlist/Abos/Bewertungen, Sieger-Treppchen.

## 1. Tech-Stack

| Bereich    | Wahl                          | Begründung |
|------------|--------------------------------|------------|
| Framework  | **Next.js 14 (App Router)**   | Server Components sparen Client-JS für datenlastige Seiten; API-Routes decken das Backend ohne separates Projekt. |
| Sprache    | **TypeScript**                 | Typsicherheit bei einem Datenmodell mit vielen verknüpften Objekten (Serie/Staffel/Episode, Rollen, Ratings). |
| Styling    | **Tailwind CSS**               | Schnelles, konsistentes UI (Design "Abstract Realms": Glasmorphismus, Sieger-Treppchen mit Aura/Partikeln). |
| Backend    | **PocketBase** (self-hosted)   | Ein einzelnes Go-Binary: SQLite-Datenbank, Auth, Datei-Uploads und Admin-Oberfläche aus einer Hand, ohne Cloud-Abo. Der Auth-Datensatz ist bei PocketBase zugleich das Profil (username, role, avatar_url, …) — keine separate Profiltabelle nötig. Rechteprüfung (Owner/Head Admin/Admin/User) läuft bewusst in unserem eigenen Code (`lib/permissions.ts`), nicht über PocketBase-API-Regeln. |
| Code-Hosting | **Codeberg**                  | Freie, quelloffene Git-Plattform. |
| Icons      | **lucide-react**               | Konsistentes, leichtes Icon-Set. |

Videos werden nicht selbst gehostet: Episoden/Filme speichern nur eine
Embed-URL zu einem externen Videohoster. Dadurch entfallen Transcoding,
CDN und Storage für Videodateien komplett.

## 2. Ordnerstruktur (Ausschnitt)

```
animem/
├── scripts/
│   └── pocketbase-setup.mjs      # legt alle Collections/Felder/Indizes automatisch an
├── src/
│   ├── app/
│   │   ├── (public)/             # Startseite, Serien/Filme, Suche, Bibliothek, Profil, Forum, Support
│   │   ├── (auth)/                # Login/Registrierung
│   │   ├── admin/                 # CMS + Nutzerverwaltung (nur Admin aufwärts)
│   │   └── api/                   # Next.js API-Routes (Server-seitige PocketBase-Zugriffe)
│   ├── components/
│   ├── lib/
│   │   ├── pocketbase/
│   │   │   ├── client.ts          # Browser-Client (Login, Registrierung, Datei-Uploads)
│   │   │   ├── server.ts          # Server-Client (Admin-Login mit Token-Caching)
│   │   │   ├── collections.ts     # zentrale Collection-Namen
│   │   │   ├── taxonomy.ts        # Genre/Tag-Auflösung
│   │   │   └── enrich.ts          # lädt verknüpfte Serien/Filme/Profile nach
│   │   ├── auth.ts                # getCurrentUser()
│   │   ├── permissions.ts         # Rollen-Logik
│   │   └── slugify.ts
├── .env.example
└── package.json
```

## 3. Rollen-Prinzip (Kurzfassung)

`USER < ADMIN < HEAD_ADMIN < OWNER` — jede höhere Rolle erbt automatisch
die Rechte darunter (siehe `lib/permissions.ts`). Nur der **Owner** darf
jemanden zum Head Admin oder Owner machen; ein **Head Admin** darf nur
zwischen User und Admin wechseln. Niemand kann die eigene Rolle ändern.

## 4. Setup

Siehe `ANLEITUNG.md` für die Schritt-für-Schritt-Anleitung (Codeberg +
selbst gehostetes PocketBase). Kurzfassung:

1. PocketBase-Server starten (siehe ANLEITUNG.md für Hosting-Optionen)
2. `npm install`
3. `.env.local` aus `.env.example` anlegen und mit PocketBase-URL + Admin-Zugangsdaten füllen
4. `node scripts/pocketbase-setup.mjs` — legt alle Collections, Felder und Indizes an
5. `npm run dev`
