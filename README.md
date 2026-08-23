# Concert & Festival Finder 🎵🎉

A personalized concert and festival discovery platform that allows users to discover upcoming concerts and festivals near them, search for artists and events, follow favorite artists, receive personalized event recommendations, save upcoming events to their personal live music calendar, and export events to Google Calendar and `.ics` files.

Includes full **Bring Your Own Key (BYOK)** support for the Ticketmaster Discovery API.

---

## 🚀 Key Features

* **Live Ticketmaster Discovery API Integration**: Fetch real concerts, festivals, artists, venues, date/times, and official ticket links.
* **Bring Your Own Key (BYOK)**: Configure your own Ticketmaster API key to use your custom quota.
* **Location-Based Discovery**: Geolocation auto-detection or manual city/region and radius selection (10 to 250 miles).
* **Advanced Event Filters & Sorting**: Filter by Date Range (Today, Weekend, Week, Month, Custom), Classification (Concert, Festival, Theater, Sports), Music Genre, Price Range, and Sort Order.
* **Personalized Live Music Calendar**: Save upcoming shows, add custom notes (seat numbers, pre-concert plans), and remove saved shows.
* **External Calendar Export**:
  * Direct **Google Calendar** integration links
  * Downloadable **Apple / Outlook `.ics`** calendar files
* **Artist Discovery & Following**: Follow favorite artists, manage your following list, and view dedicated artist show feeds.
* **Personalized Dashboard**: "Upcoming Near You", "Shows From Followed Artists", and "Recommended For You" based on favorite genres.
* **AES-256 BYOK Security**: Server-side AES-256 encryption for user-provided Ticketmaster API keys.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
* **Backend Proxy Layer**: Express (Node.js) with AES-256 encryption (`crypto`), Ticketmaster REST proxy
* **Persistence**: Local storage state engine with JSON backup
* **API**: Ticketmaster Discovery API v2

---

## 🔐 BYOK Security & API Architecture

1. **Server Proxy Layer**: All requests to Ticketmaster pass through the server proxy (`/api/ticketmaster/*`). Secret credentials are never exposed directly to client-side network calls or browser logs.
2. **Key Encryption**: When a user inputs a BYOK Ticketmaster key in Settings, the key is sent to `/api/byok/validate`. Upon successful validation against Ticketmaster, the server encrypts the key using AES-256-CBC and returns a masked string (`••••••••••••ABCD`) and an encrypted token string.
3. **Short-Lived Memory Decryption**: During API requests, the client sends `x-byok-token`. The server decrypts it in RAM solely for the duration of the Ticketmaster request, then discards the raw key.
4. **Default Fallback**: If no BYOK key is set, the app utilizes the server's default `TICKETMASTER_API_KEY` environment variable or presents curated fallback data.

---

## 📦 Setup & Local Development

### 1. Environment Variables

Create a `.env` file from `.env.example`:

```env
# Optional server default Ticketmaster key
TICKETMASTER_API_KEY="your_default_ticketmaster_api_key"

# 32-byte secret key for BYOK AES-256 encryption
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef"
```

### 2. Install Dependencies & Start Server

```bash
npm install
npm run dev
```

The app will start at `http://localhost:3000`.

### 3. Production Build & Execution

```bash
npm run build
npm run start
```

---

## 📜 Ticketmaster API Terms & Compliance

* All ticket purchase buttons link directly to official Ticketmaster URLs (`event.url`).
* No fake checkout or proprietary ticket selling is implemented.
* API responses are normalized and cached appropriately in compliance with Ticketmaster API terms.
