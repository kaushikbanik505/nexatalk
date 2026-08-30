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
