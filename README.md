<div align="center">

# 🌐 NexaTalk

### Real conversations, with real people.

🔗 **Live:** [nexatalk-weld.vercel.app](https://nexatalk-weld.vercel.app)

Most language apps hand you flashcards and gamified streaks but never actually put you in front of another person. NexaTalk skips the drills: sign up, get matched by the language you're learning, and talk — real-time chat, 1-on-1 & group video calls, and a Gemini-powered AI buddy to lean on in between.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stream](https://img.shields.io/badge/Stream-Chat%20%2B%20Video-005FFF?logo=stream&logoColor=white)](https://getstream.io)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Buddy-8E75FF?logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-DaisyUI-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-ISC-blue)](#-license)

</div>

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Design Philosophy](#-design-philosophy)
- [Moderation & Anti-abuse](#-moderation--anti-abuse)
- [Security](#-security)
- [Getting Started](#️-getting-started)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Roadmap](#️-roadmap)
- [License](#-license)

## 🚀 Features

| | Feature | What it does |
|---|---|---|
| 💬 | **Real-time chat** | 1-on-1 and group messaging over [Stream Chat](https://getstream.io/chat/) — typing indicators, unread badges, and a dedicated Messages inbox listing every conversation, most recent first. |
| 🔍 | **Learner discovery** | A recommendation feed of other learners, automatically excluding your existing friends and anyone blocked in either direction — plus filtering by the language someone's learning. |
| 🤝 | **Friends & requests** | Send, accept, and track friend requests; unfriend any time. Incoming requests and recently-accepted ones both surface on the Notifications page. |
| 📹 | **Video calling** | 1-on-1 and group video calls over [Stream Video](https://getstream.io/video/) with screen sharing and recording built in. Starting a call from a chat drops a joinable link straight into the conversation — no separate "call" feature to hunt for. |
| 🤖 | **AI language buddy** | A floating, Gemini-powered assistant that translates a phrase, checks your grammar, or roleplays a practice conversation — available from anywhere in the app. |
| 🟢 | **Live presence** | Online/offline dots driven by a real `lastActiveAt` heartbeat, not a guess — the same 2-minute "online" window is shared by the UI and the admin dashboard, so they never disagree. |
| 🚫 | **Block & report** | Blocking is mutual and immediate: it unfriends, cancels any pending request between the two of you, and closes off new requests in either direction — with a dedicated Blocked Users view to manage it. |
| 🛡️ | **Admin dashboard** | A role-gated dashboard: live user counts, a 7-day signup chart, a moderation feed of the last 24h of activity, and ban/unban — enforced server-side off the JWT, not just hidden in the UI. |
| 👤 | **Rich profiles** | Photo upload, bio, phone, and social links, editable from a slide-down profile card without leaving the page you're on. |
| 📱 | **Mobile-first** | Built and QA'd on real Android/iOS viewports as a first-class target — not a desktop layout that happens to squeeze onto a phone. |
| 📖 | **Living documentation** | An in-app `/developer` page and file explorer that reflects the actual running codebase, kept in sync with every feature as it ships. |

## 🧱 Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | React 19 · Vite · React Router · TailwindCSS + DaisyUI · TanStack Query · Axios |
| **Backend** | Node.js · Express · MongoDB + Mongoose · JWT (httpOnly cookies) · bcrypt |
| **Real-time** | Stream Chat & Stream Video SDKs |
| **AI** | Google Gemini API (`@google/genai`) |
| **Deploy** | Single Node service — Express serves the built React app, no separate frontend host needed |

## 🏗️ Architecture

```
nexatalk/
├── backend/     Express API — auth, users, chat/video token issuing, groups, admin, AI
│   └── src/
│       ├── controllers/   route handlers (auth, users, groups, admin, ai)
│       ├── middleware/    JWT auth guard, admin guard, AI rate limiter
│       ├── models/        Mongoose schemas
│       ├── services/      Gemini chat integration
│       └── routes/
└── frontend/    React SPA — chat UI, video calls, friends/social, admin dashboard
    └── src/
        ├── components/    ChatHeader, ProfileCard, AiBuddy, modals, etc.
        ├── pages/         one file per route
        └── lib/           API client, Stream client wrappers, presence logic
```

In production, `backend/src/server.js` serves the built frontend (`frontend/dist`) directly and falls back to `index.html` for client-side routing — one service, one deploy.

## 📡 API Reference

Base URL: **`/api`** (e.g. `http://localhost:5001/api` in development).

Auth is a JWT issued as an **httpOnly cookie** (`jwt`) on signup/login — the browser sends it automatically with `withCredentials: true`, there's no `Authorization: Bearer` header to manage. **Auth column:** `public` = no cookie needed · 🔒 `auth` = any logged-in user (`protectRoute`) · 🛡️ `admin` = logged in **and** `role: "admin"` (`protectAdminRoute`), checked against the database record on every request, not something the frontend can fake.

<details open>
<summary><strong>▼ Auth</strong> — <code>/api/auth</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/signup` | public | Create an account |
| `POST` | `/login` | public | Log in |
| `POST` | `/logout` | public | Clear the session cookie |
| `POST` | `/onboarding` | 🔒 | Complete the onboarding profile (name, bio, languages, location) |
| `GET` | `/me` | 🔒 | Return the current authenticated user |

<details>
<summary><code>POST /api/auth/signup</code></summary>

```jsonc
// Request body
{
  "fullName": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "min6chars"
}
```
```jsonc
// 201 Created — also sets the `jwt` cookie
{ "success": true, "user": { "_id": "...", "fullName": "Ada Lovelace", "email": "ada@example.com", "profilePic": "...", "isOnboarded": false } }
```
`400` if a field is missing, the password is under 6 characters, the email is malformed, or the email is already registered.
</details>

<details>
<summary><code>POST /api/auth/login</code></summary>

```jsonc
// Request body
{ "email": "ada@example.com", "password": "min6chars" }
```
```jsonc
// 200 OK — sets the `jwt` cookie
{ "success": true, "user": { "_id": "...", "fullName": "Ada Lovelace", "...": "..." } }
```
`401` on a wrong email/password, `403` if the account has been banned.
</details>

<details>
<summary><code>POST /api/auth/onboarding</code> 🔒</summary>

```jsonc
// Request body
{
  "fullName": "Ada Lovelace",
  "bio": "Learning Spanish, native English speaker.",
  "nativeLanguage": "english",
  "learningLanguage": "spanish",
  "location": "London, UK"
}
```
```jsonc
// 200 OK
{ "success": true, "user": { "...": "...", "isOnboarded": true } }
```
`400` with a `missingFields` array naming whichever required fields were omitted.
</details>
</details>

<details>
<summary><strong>▶ Users & Social</strong> — <code>/api/users</code> <em>(every route requires 🔒)</em></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Recommended learners (excludes yourself, friends, and anyone blocked either direction) |
| `GET` | `/friends` | Your current friends list |
| `DELETE` | `/friends/:id` | Remove a friend |
| `PUT` | `/profile` | Update your profile |
| `POST` | `/friend-request/:id` | Send a friend request |
| `PUT` | `/friend-request/:id/accept` | Accept an incoming request |
| `GET` | `/friend-requests` | Incoming pending requests + your recently-accepted outgoing ones |
| `GET` | `/outgoing-friend-requests` | Requests you've sent that are still pending |
| `GET` | `/blocked` | Users you've blocked |
| `POST` | `/block/:id` | Block a user (also unfriends and cancels any pending request both ways) |
| `POST` | `/unblock/:id` | Unblock a user |

<details>
<summary><code>PUT /api/users/profile</code></summary>

```jsonc
// Request body (all optional — only provided fields are updated)
{ "fullName": "Ada L.", "bio": "...", "phone": "+44...", "links": ["https://instagram.com/..."], "location": "London, UK", "profilePic": "data:image/png;base64,..." }
```
```jsonc
// 200 OK
{ "success": true, "user": { "...": "..." } }
```
</details>

<details>
<summary><code>POST /api/users/friend-request/:id</code></summary>

```jsonc
// 201 Created
{ "_id": "...", "sender": "<myId>", "recipient": "<id>", "status": "pending" }
```
`400` if you're already friends, a request already exists between you two, or you targeted yourself. `403` if either of you has blocked the other.
</details>
</details>

<details>
<summary><strong>▶ Chat & Video Tokens</strong> — <code>/api/chat</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/token` | 🔒 | Issue a short-lived [Stream](https://getstream.io) token, used to connect the chat + video SDKs client-side |

```jsonc
// 200 OK
{ "token": "eyJhbGciOi..." }
```
</details>

<details>
<summary><strong>▶ Groups</strong> — <code>/api/groups</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `PUT` | `/:channelId/admins/:userId` | 🔒 | Promote a group member to admin (caller must be the group's creator or an existing admin) |
| `DELETE` | `/:channelId/admins/:userId` | 🔒 | Demote a group admin (the original creator can't be demoted) |

*Group creation and messaging happen directly against the Stream Chat SDK on the client, authenticated with the token above — these two routes only cover the admin-role logic that lives in NexaTalk's own database of record.*
</details>

<details>
<summary><strong>▶ AI Buddy</strong> — <code>/api/ai</code></summary>

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/chat` | 🔒 | Send a message to the Gemini-powered AI buddy |

Rate-limited to **8 requests per 60 seconds per user** to protect the shared Gemini quota — a `429` is returned past that.

```jsonc
// Request body
{ "message": "How do I say 'nice to meet you' in Spanish?", "history": [ /* optional prior turns */ ] }
```
```jsonc
// 200 OK
{ "reply": "You'd say “Mucho gusto” — ..." }
```
</details>

<details>
<summary><strong>▶ Admin</strong> — <code>/api/admin</code> <em>(every route requires 🛡️)</em></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/overview` | Dashboard stats: total users, users online now, signups in the last 24h, pending friend requests, requests accepted in the last 24h, and a 7-day signup chart |
| `GET` | `/online` | Everyone active in the last 2 minutes |
| `GET` | `/users` | Every user, with role/ban status |
| `GET` | `/moderation` | Signups and friend-request activity from the last 24h |
| `PUT` | `/users/:id/ban` | Ban a user (can't ban yourself or another admin) |
| `PUT` | `/users/:id/unban` | Lift a ban |

<details>
<summary><code>GET /api/admin/overview</code></summary>

```jsonc
// 200 OK
{
  "totalUsers": 128,
  "onlineNow": 4,
  "newSignups24h": 6,
  "pendingRequests": 11,
  "acceptedRequests24h": 3,
  "signupsByDay": [
    { "date": "2026-08-24", "count": 2 },
    { "date": "2026-08-25", "count": 5 }
    // ...7 days total, oldest first
  ]
}
```
</details>
</details>

## 🔐 Environment Variables

> ⚠️ **Never commit real values.** Both `.env` files are gitignored. Use your own MongoDB cluster, your own JWT secret, and your own API keys — never share production credentials.

**Backend (`backend/.env`)**

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5001` |
| `NODE_ENV` | `development` locally, `production` when deployed — also flips CORS from wide-open to locked-down | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/nexatalk` |
| `JWT_SECRET_KEY` | Signing secret for the session JWT | a long random string |
| `CLIENT_URL` | The frontend's origin — only enforced (and required) when `NODE_ENV=production` | `http://localhost:5173` |
| `ADMIN_EMAIL` | The account with this email is auto-promoted to `role: "admin"` on its next authenticated request | `you@example.com` |
| `STEAM_API_KEY` | Stream app key (chat **and** video share one app) | — |
| `STEAM_API_SECRET` | Stream app secret — server-side only, never sent to the client | — |
| `GEMINI_API_KEY` | Google Gemini API key, powers the AI buddy | — |

**Frontend (`frontend/.env`)**

| Variable | Description | Example |
|---|---|---|
| `VITE_STREAM_API_KEY` | Same Stream app key as the backend's `STEAM_API_KEY` — public by design, Stream's client SDKs are built to take it | — |

## 🧭 Design Philosophy

A handful of decisions that shape how the codebase actually behaves, not just how it looks:

**Presence is a heartbeat, not a guess.** Every authenticated request throttle-writes `lastActiveAt` (at most once per 30 seconds per user, so it's not a database write on every single request), and "online" means "seen in the last 2 minutes." That exact 2-minute window is shared by the frontend's presence dots and the admin dashboard's online count, computed from the same field — they can't drift apart.

**No channel bookkeeping for 1-on-1 chats.** A direct-message channel's ID is deterministic: both participants' Mongo IDs, sorted, joined with a dash. Whoever opens the conversation first, both people land in the exact same Stream channel — no matchmaking table, no race condition.

**A channel's `name` is the group/DM signal.** A group can be as small as two people — the same size as a 1-on-1 — so member count alone can't tell them apart. Only group creation ever sets a channel name, so that's the one true signal the UI checks.

**Admin access is enforced where it can't be faked.** `role` lives on the User document and is only ever flipped server-side (matching `ADMIN_EMAIL` on login, or an existing admin's action) — `protectAdminRoute` checks the database-backed `req.user.role`, not a client-supplied header or a hidden frontend route.

**Oversized data degrades gracefully instead of breaking things.** A group photo picked from a phone can be hundreds of KB as a base64 data URI; past an 8KB cap it's simply left off the channel rather than failing the whole group's creation.

**Dev environment mirrors real usage, not just localhost.** In development, CORS reflects back whatever origin made the request — so a phone on the same Wi-Fi hitting this machine's LAN IP works for real mobile testing, without loosening anything in production, where `CLIENT_URL` is the only origin allowed.

## 🚨 Moderation & Anti-abuse

- **AI rate limiting** — 8 messages per 60 seconds per user, enforced server-side, to protect the shared Gemini quota from being drained by one client.
- **Blocking is mutual and immediate** — it unfriends both directions, deletes any pending/accepted friend-request history between the two accounts, and blocks new requests either way.
- **Bans are enforced at the door** — a banned user's cookie is cleared and every authenticated request is rejected with `403`, not just hidden in the UI; an admin can't ban another admin or themselves.
- **Group admin actions are permission-checked server-side** — promoting/demoting is verified against the real Stream channel membership on every call, and a group's original creator can never be demoted.

## 🔒 Security

- Sessions are a JWT in an **httpOnly, `sameSite: strict` cookie** (`secure` in production) — never exposed to JavaScript, so there's nothing for an XSS payload to steal from `localStorage`.
- Passwords are hashed with **bcrypt** (10 salt rounds) — never stored or logged in plain text.
- CORS is locked to an explicit origin (`CLIENT_URL`) in production, not left open.
- All secrets (JWT key, database URI, Stream secret, Gemini key) live in a server-side `.env` file that's gitignored and never reaches the frontend bundle.
- Admin authorization is re-checked against the database on every request — see [Design Philosophy](#-design-philosophy).

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Stream](https://getstream.io) app (chat + video use the same API key/secret)
- A free [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & install
```bash
git clone https://github.com/kaushikbanik505/nexatalk.git
cd nexatalk
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment variables
Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`, then fill in real values — see [Environment Variables](#-environment-variables) for what each one does.

### 3. Run it
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```
Frontend: `http://localhost:5173` · Backend: `http://localhost:5001`

### Production build
```bash
npm run build   # installs both packages and builds the frontend
npm start       # serves the API + the built frontend from one process
```

## 🚢 Deployment

The live deployment above runs as **two separate services**, each redeploying automatically on every push to `main`:

| | Service | Root Directory | Build | Start / Output |
|---|---|---|---|---|
| 🖥️ | **Backend** — [Render](https://render.com) | `backend` | `npm install` | `npm start` |
| 🌐 | **Frontend** — [Vercel](https://vercel.com) | `frontend` | `npm run build` | Output dir `dist` |

Two domains means the browser would normally see the login cookie as third-party (set by the Render domain while the page is on the Vercel domain) — and third-party cookie blocking, on by default in a growing number of browsers, silently drops it, making login look like it fails for no reason. `frontend/vercel.json` avoids the problem entirely instead of just tolerating it: it **rewrites `/api/*` to the Render backend server-side**, so the browser only ever talks to its own origin (`nexatalk-weld.vercel.app`) and never sees the Render domain directly. The cookie ends up same-origin, which every browser accepts unconditionally.

What that means in practice:
- **Backend env vars**: all the usual ones, plus `NODE_ENV=production` and `CLIENT_URL` set to the Vercel domain (used for the CORS allow-list; harmless once requests are proxied, since a proxied request either carries no `Origin` header or one that already matches).
- **Frontend env vars**: just `VITE_STREAM_API_KEY` — the API's location is defined once in `frontend/vercel.json`, not duplicated into an env var.
- **`frontend/vercel.json`** also rewrites every other path to `index.html`, so a direct visit or refresh on a client-side route (e.g. `/chat/:id`) doesn't 404 against Vercel's static host.
- MongoDB Atlas → Network Access must allow Render's outbound traffic (`0.0.0.0/0` on the free tier, since the IP isn't static).

Prefer one service instead? The codebase still supports it: point a single Node host (Render, Railway, Fly.io, ...) at the repo root with build command `npm run build` and start command `npm start` — `backend/src/server.js` will serve the built frontend itself, and none of the cross-origin env vars above are needed.

## 🤝 Contributing

This has been an incrementally-built solo project — if you're picking up the code, here's how to work on it without fighting the existing patterns:

- Match what's already there: no comments unless something is genuinely non-obvious, no new abstraction for a one-off case, Tailwind utility classes instead of new CSS files.
- Run both the backend and frontend locally (see [Getting Started](#️-getting-started)) and actually click through whatever you changed before calling it done — a clean build isn't the same as a working feature.
- Check mobile too — this app is explicitly designed and QA'd mobile-first, not as an afterthought.

## 🗺️ Roadmap

Ongoing feature ideas and what's shipped so far are tracked on the in-app `/whats-next` page.

## 📄 License

ISC

---

<div align="center">

Designed & developed by **Kaushik Banik**.

</div>
