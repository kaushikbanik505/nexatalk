<div align="center">

# 🌐 NexaTalk

### Real conversations, with real people.

A full-stack language-exchange platform: real-time chat, 1-on-1 & group video calls, and an AI conversation buddy — built to help people actually *talk* to each other, not memorize flashcards.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stream](https://img.shields.io/badge/Stream-Chat%20%2B%20Video-005FFF?logo=stream&logoColor=white)](https://getstream.io)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-AI%20Buddy-8E75FF?logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-DaisyUI-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## 📚 Table of Contents

- [What is NexaTalk?](#-what-is-nexatalk)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [API Reference](#-api-reference)
- [Getting Started](#️-getting-started)
- [Deployment](#-deployment)
- [Roadmap](#️-roadmap)
- [License](#-license)

## ✨ What is NexaTalk?

NexaTalk connects language learners with native/fluent speakers for real conversations — live chat, video calls, and an AI buddy to lean on in between. Sign up, get matched by the language you're learning, and start talking.

## 🚀 Features

**💬 Chat & Social**
- Real-time 1-on-1 and group messaging, powered by [Stream Chat](https://getstream.io/chat/)
- Friend requests, a "New Learners" discovery feed, and a dedicated Messages inbox
- Online/offline presence, unread badges, and browser push notifications
- Block/unblock, with a dedicated Blocked Users view

**📹 Video Calling**
- 1-on-1 and group video calls (screen sharing + recording included), powered by [Stream Video](https://getstream.io/video/)
- Start a call straight from a chat — it drops a joinable link right into the conversation

**🤖 AI Language Buddy**
- A floating AI buddy (Gemini-powered) that translates, checks your phrasing, or roleplays a practice conversation on demand

**🛡️ Admin & Trust**
- Role-gated admin dashboard: live online/offline user tracking, moderation tools
- Rate-limited AI endpoint to keep usage in check

**🎨 Product Polish**
- Profile cards with photo upload, bio, and social links
- Fully responsive — built and QA'd for mobile (Android/iOS) as a first-class target, not an afterthought
- A living `/developer` reference page and in-app file explorer that documents the actual running codebase

## 🧱 Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | React 19 · Vite · React Router · TailwindCSS + DaisyUI · TanStack Query · Axios |
| **Backend** | Node.js · Express · MongoDB + Mongoose · JWT (httpOnly cookies) · bcrypt |
| **Real-time** | Stream Chat & Stream Video SDKs |
| **AI** | Google Gemini API |
| **Deploy** | Single Node service — Express serves the built React app, no separate frontend host needed |

## 🏗️ Architecture

```
nexatalk/
├── backend/     Express API — auth, users, chat/video token issuing, groups, admin, AI
│   └── src/
│       ├── controllers/   route handlers (auth, users, groups, admin, ai)
│       ├── middleware/    JWT auth guard, admin guard, AI rate limiter
│       ├── models/        Mongoose schemas
│       └── routes/
└── frontend/    React SPA — chat UI, video calls, friends/social, admin dashboard
    └── src/
        ├── components/    ChatHeader, ProfileCard, AiBuddy, modals, etc.
        ├── pages/          one file per route
        └── lib/           API client, Stream client wrappers, presence logic
```

In production, `backend/src/server.js` serves the built frontend (`frontend/dist`) directly and falls back to `index.html` for client-side routing — one service, one deploy.

## 📡 API Reference

Base URL: **`/api`** (e.g. `http://localhost:5001/api` in development).

Auth is a JWT issued as an **httpOnly cookie** (`jwt`) on signup/login — the browser sends it automatically with `withCredentials: true`, there's no `Authorization: Bearer` header to manage. 🔒 marks a route that requires that cookie via the `protectRoute` middleware; 🛡️ marks one that additionally requires `role: "admin"` via `protectAdminRoute`.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/signup` | — | Create an account |
| `POST` | `/login` | — | Log in |
| `POST` | `/logout` | — | Clear the session cookie |
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

### Users & Social — `/api/users`
*(every route below requires* 🔒 *)*

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
{ "fullName": "Ada L.", "bio": "...", "phone": "+44...", "links": { "instagram": "...", "twitter": "..." }, "location": "London, UK", "profilePic": "data:image/png;base64,..." }
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

### Chat & Video Tokens — `/api/chat`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/token` | 🔒 | Issue a short-lived [Stream](https://getstream.io) token, used to connect the chat + video SDKs client-side |

```jsonc
// 200 OK
{ "token": "eyJhbGciOi..." }
```

### Groups — `/api/groups`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `PUT` | `/:channelId/admins/:userId` | 🔒 | Promote a group member to admin (caller must be the group's creator or an existing admin) |
| `DELETE` | `/:channelId/admins/:userId` | 🔒 | Demote a group admin (the original creator can't be demoted) |

*(Group creation and messaging happen directly against the Stream Chat SDK on the client, authenticated with the token above — these two routes only cover the admin-role logic that lives in NexaTalk's own database of record.)*

### AI Buddy — `/api/ai`

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

### Admin — `/api/admin`
*(every route below requires* 🛡️ *`role: "admin"`, in addition to being logged in)*

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

**`backend/.env`**
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=a_long_random_string
CLIENT_URL=http://localhost:5173

# auto-promoted to role "admin" on its next login
ADMIN_EMAIL=your_admin_account@example.com

# Stream (chat + video) - same app as VITE_STREAM_API_KEY below
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret

# powers the AI buddy
GEMINI_API_KEY=your_gemini_api_key
```

**`frontend/.env`**
```env
VITE_STREAM_API_KEY=your_stream_api_key
```

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

NexaTalk is built to deploy as a **single web service** (Render, Railway, Fly.io, or any Node host):
- Build command: `npm run build`
- Start command: `npm start`
- Set all the backend env vars above on the host, with `NODE_ENV=production` and `CLIENT_URL` set to your live domain
- Allow your host's outbound traffic in MongoDB Atlas → Network Access

## 🗺️ Roadmap

Ongoing feature ideas and what's shipped so far are tracked on the in-app `/whats-next` page.

## 📄 License

ISC
