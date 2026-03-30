# HeartNote API

Backend server for [HeartNote](https://github.com/Aaditya188/heartnote) — proxies the JioSaavn API for music search and handles downloading + uploading songs to Convex storage.

## Endpoints

### Search

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/search` | `query` | Global search (songs, albums, artists, playlists) |
| `GET` | `/api/search/songs` | `query`, `page?`, `limit?` | Search songs |
| `GET` | `/api/search/albums` | `query`, `page?`, `limit?` | Search albums |
| `GET` | `/api/search/artists` | `query`, `page?`, `limit?` | Search artists |
| `GET` | `/api/search/playlists` | `query`, `page?`, `limit?` | Search playlists |

### Songs

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/songs` | `id` or `link` | Get song(s) by ID or JioSaavn link |
| `GET` | `/api/songs/:id` | — | Get song details |
| `GET` | `/api/songs/:id/suggestions` | `limit?` | Get similar songs |

### Albums / Artists / Playlists

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/albums` | `id` or `link` | Album details |
| `GET` | `/api/artists` | `id` or `link` | Artist details |
| `GET` | `/api/artists/:id` | — | Artist by ID |
| `GET` | `/api/artists/:id/songs` | `page?`, `limit?` | Artist's songs |
| `GET` | `/api/artists/:id/albums` | `page?`, `limit?` | Artist's albums |
| `GET` | `/api/playlists` | `id` or `link` | Playlist details |

### Download

| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/download` | `{ songId, quality? }` | Download song and upload to Convex storage |
| `POST` | `/api/download/batch` | `{ songIds[], quality? }` | Batch download (max 10) |
| `GET` | `/api/download/url/:songId` | `quality?` | Get direct stream URL (no Convex upload) |

Quality options: `12kbps`, `48kbps`, `96kbps`, `160kbps`, `320kbps` (default: `320kbps`)

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `CONVEX_URL` | Your Convex deployment URL |
| `JIOSAAVN_BASE_URL` | JioSaavn API base URL |

### Local Development

```bash
npm run dev
# Runs on http://localhost:3001
```

## Deploy to Vercel

1. Create a **new** Vercel project linked to this repo/directory
2. Add `CONVEX_URL` and `JIOSAAVN_BASE_URL` as environment variables in the Vercel dashboard
3. Deploy

```bash
vercel --prod
```

## Tech

- **Express 5** — HTTP server
- **Convex** — File storage (upload downloaded songs)
- **JioSaavn API** — Music metadata and audio source
