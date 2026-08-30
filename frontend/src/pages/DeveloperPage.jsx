import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  BellIcon,
  BotIcon,
  CheckIcon,
  CopyIcon,
  FileTextIcon,
  GraduationCapIcon,
  InboxIcon,
  KeyRoundIcon,
  LockIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  ShieldIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { useState } from "react";

const LAST_UPDATED = "August 30, 2026";

// full literal class strings only - Tailwind's scanner can't resolve `bg-${color}/10` templates
const COLOR_STYLES = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
};

const EYEBROW_COLOR = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  info: "text-info",
  warning: "text-warning",
  success: "text-success",
};

const BORDER_L_COLOR = {
  primary: "border-l-primary",
  secondary: "border-l-secondary",
  accent: "border-l-accent",
  info: "border-l-info",
  warning: "border-l-warning",
  success: "border-l-success",
};

const STACK = [
  {
    group: "Frontend",
    color: "info",
    items: [
      "React 19",
      "Vite",
      "React Router 7",
      "Tailwind CSS + daisyUI",
      "TanStack Query",
      "Axios",
      "stream-chat-react",
      "@stream-io/video-react-sdk",
      "lucide-react",
      "react-hot-toast",
    ],
  },
  {
    group: "Backend",
    color: "success",
    items: [
      "Node.js",
      "Express",
      "MongoDB + Mongoose",
      "stream-chat (server SDK)",
      "jsonwebtoken",
      "bcryptjs",
      "cookie-parser",
      "cors",
      "@google/genai",
    ],
  },
];

const FEATURES = [
  {
    icon: LockIcon,
    color: "primary",
    title: "Accounts",
    desc: "Signup/login with a JWT stored in an httpOnly cookie (7-day expiry) and bcrypt-hashed passwords. A one-time onboarding step collects full name, bio, native/learning language, and location before the rest of the app unlocks.",
  },
  {
    icon: UsersIcon,
    color: "secondary",
    title: "Friends & matching",
    desc: "Browse recommended learners (everyone onboarded except yourself and existing friends), filter by learning language, send/accept friend requests, and see who's already your friend.",
  },
  {
    icon: MessageSquareIcon,
    color: "accent",
    title: "Real-time chat",
    desc: "1:1 messaging per friend pair via Stream Chat, with a deterministic channel id (both user ids sorted and joined) so either side landing on the conversation opens the same channel.",
  },
  {
    icon: VideoIcon,
    color: "info",
    title: "Video calls",
    desc: "Started from inside a chat, not a separate call button elsewhere — sending a call link posts it as a chat message the other person can click, then both join the same Stream Video room.",
  },
  {
    icon: BellIcon,
    color: "warning",
    title: "Notifications",
    desc: "Incoming friend requests to accept and a feed of requests you sent that got accepted — both read from the same friend-request collection, filtered by status and direction.",
  },
  {
    icon: SparklesIcon,
    color: "success",
    title: "Profile card",
    desc: "A popup off the navbar avatar showing bio, email (copyable), phone, location, and clickable links, with an edit modal that uploads a photo straight from your device (stored as a data URI, no external image host).",
  },
  {
    icon: GraduationCapIcon,
    color: "primary",
    title: "Learner page",
    desc: "An interview-prep page at /learn — a 60-second pitch covering the project end to end, plus /learn/backend and /learn/frontend: every real source file, in full, with an explanation and expandable code for each one. Restricted to a single account; everyone else is routed home and the dashboard's \"Learner\" pill quietly falls back to the same \"Coming soon!\" placeholder as Admin.",
  },
  {
    icon: FileTextIcon,
    color: "secondary",
    title: "Terms, Privacy & About pages",
    desc: "Real, readable /terms and /privacy pages, linked from the signup form's agreement checkbox (opens in a new tab so the in-progress signup form isn't lost), plus a marketing-style /about page (hero, feature cards, mission blurb, CTA - sharing LandingPage.jsx's look rather than the plain legal-doc shell) linked from the home page's quick-nav row. All public, no auth required, all a real route rather than a modal - the About pill in particular needed to open a full page on mobile, not a small popup.",
  },
  {
    icon: InboxIcon,
    color: "info",
    title: "Messages inbox",
    desc: "A real /messages page - every conversation you've actually opened at least once, most recent first, with the other person's name/avatar, a live last-message preview, and an unread badge. Built entirely on the Stream Chat client already used by ChatPage.jsx (client.queryChannels, re-run on every message.new event) - no new backend endpoint, since Stream already tracks channel membership and message history. A channel only appears here once someone has opened that chat at least once; starting a brand-new one still happens from a friend's card on the Friends page. Sharing one Stream client between this page and ChatPage.jsx surfaced a real bug (connectUser thrown/uncaught, stranding the chat page on an infinite spinner) - fixed via lib/streamClient.js and a proper error state on both pages, see the Learner page's file-by-file writeup for the full story.",
  },
  {
    icon: BotIcon,
    color: "accent",
    title: "AI buddy",
    desc: "The sidebar mascot's \"Chat\" button opens a Gemini-powered chat (gemini-3.1-flash-lite, free tier) that helps with language learning — translate a phrase, check your phrasing, or just practice a conversation. The system prompt is personalized with the logged-in user's nativeLanguage/learningLanguage profile fields. Conversation history is kept in the modal's own state and replayed with every request (no backend persistence); a per-user sliding-window rate limit (8 msg/60s) protects the free API quota. Since the sidebar is desktop-only, a floating action button (AiBuddyFab, mobile breakpoints only) opens the same modal so it's reachable on a phone too.",
  },
  {
    icon: ShieldIcon,
    color: "warning",
    title: "Admin dashboard",
    desc: "A real /admin page for the account matching ADMIN_EMAIL - registered/online/signup stats with a 7-day signup chart, a live \"who's online right now\" table (a genuine lastActiveAt heartbeat, not a static badge), a moderation view of the last 24h of signups and friend-request activity, and a full user table with ban/unban. Everyone else's dashboard \"Admin\" pill still shows the same \"Coming soon!\" toast as an unbuilt feature.",
  },
];

const API_GROUPS = [
  {
    name: "Auth",
    base: "/api/auth",
    color: "primary",
    routes: [
      { method: "POST", path: "/signup", auth: "Public", desc: "Create an account" },
      { method: "POST", path: "/login", auth: "Public", desc: "Log in — sets the JWT cookie" },
      { method: "POST", path: "/logout", auth: "Public", desc: "Clear the JWT cookie" },
      { method: "POST", path: "/onboarding", auth: "Login required", desc: "Complete the one-time onboarding profile" },
      { method: "GET", path: "/me", auth: "Login required", desc: "Get the logged-in user" },
    ],
  },
  {
    name: "Users",
    base: "/api/users",
    color: "secondary",
    routes: [
      { method: "GET", path: "/", auth: "Login required", desc: "Recommended learners (excludes yourself and friends)" },
      { method: "GET", path: "/friends", auth: "Login required", desc: "Your friends list" },
      { method: "POST", path: "/friend-request/:id", auth: "Login required", desc: "Send a friend request" },
      { method: "PUT", path: "/friend-request/:id/accept", auth: "Login required", desc: "Accept a friend request" },
      { method: "GET", path: "/friend-requests", auth: "Login required", desc: "Incoming + accepted-outgoing requests" },
      { method: "GET", path: "/outgoing-friend-requests", auth: "Login required", desc: "Requests you've sent that are still pending" },
      { method: "PUT", path: "/profile", auth: "Login required", desc: "Update name, bio, phone, links, location, photo" },
    ],
  },
  {
    name: "Chat",
    base: "/api/chat",
    color: "accent",
    routes: [
      { method: "GET", path: "/token", auth: "Login required", desc: "Issue a Stream token for chat + video" },
    ],
  },
  {
    name: "AI",
    base: "/api/ai",
    color: "accent",
    routes: [
      { method: "POST", path: "/chat", auth: "Login required", desc: "Send a message to the Gemini-powered AI buddy" },
    ],
  },
  {
    name: "Admin",
    base: "/api/admin",
    color: "warning",
    routes: [
      { method: "GET", path: "/overview", auth: "Admin only", desc: "User/signup/friend-request counts + a 7-day signup chart" },
      { method: "GET", path: "/online", auth: "Admin only", desc: "Users active in the last 2 minutes" },
      { method: "GET", path: "/users", auth: "Admin only", desc: "Every user, with role and ban status" },
      { method: "GET", path: "/moderation", auth: "Admin only", desc: "Signups + friend-request activity from the last 24h" },
      { method: "PUT", path: "/users/:id/ban", auth: "Admin only", desc: "Suspend an account (blocks login)" },
      { method: "PUT", path: "/users/:id/unban", auth: "Admin only", desc: "Restore a suspended account" },
    ],
  },
];

const BACKEND_ENV = [
  { key: "PORT", desc: "Port the API listens on", example: "5001" },
  { key: "NODE_ENV", desc: "development or production — controls cookie secure flag and whether Express serves the built frontend", example: "development" },
  { key: "MONGO_URI", desc: "MongoDB connection string", example: "mongodb+srv://user:pass@cluster.mongodb.net/nexatalk" },
  { key: "JWT_SECRET_KEY", desc: "Signing secret for the auth cookie's JWT", example: "a long random string" },
  { key: "CLIENT_URL", desc: "Frontend origin allowed by CORS", example: "http://localhost:5173" },
  { key: "STEAM_API_KEY", desc: "Stream (chat + video) API key", example: "your_stream_key" },
  { key: "STEAM_API_SECRET", desc: "Stream API secret", example: "your_stream_secret" },
  { key: "ADMIN_EMAIL", desc: "The account with this email is auto-promoted to role \"admin\" on its next request", example: "you@example.com" },
  { key: "GEMINI_API_KEY", desc: "Free Google AI Studio key that powers the AI buddy chat", example: "your_gemini_api_key" },
];

const FRONTEND_ENV = [
  { key: "VITE_STREAM_API_KEY", desc: "Same Stream API key, exposed to the browser", example: "your_stream_key" },
];

const PRINCIPLES = [
  {
    title: "Placeholders say so",
    color: "primary",
    body: "Unbuilt features are explicitly wired to a \"Coming soon!\" toast, not built to look finished when they aren't — that's how the mascot's \"Chat\" button behaved before it became the real AI buddy feature.",
  },
  {
    title: "One theme, everywhere",
    color: "secondary",
    body: "A single daisyUI theme (night) is set once on the app root. No page or component sets its own data-theme — a portaled modal has to explicitly re-declare it, since portaling to document.body escapes the themed tree.",
  },
  {
    title: "Optional fields disappear, they don't render empty",
    color: "accent",
    body: "Phone, location, bio, and links on the profile card are only rendered when present — an empty field never shows as a blank row.",
  },
  {
    title: "Built incrementally, one step at a time",
    color: "info",
    body: "Local dev got fixed and verified first, then the UI was rebuilt page by page, then the profile system — each checked against the real running app (not just a build passing) before the next piece started.",
  },
];

const CodeBlock = ({ title, color = "success", lines }) => {
  const handleCopy = () => {
    const commands = lines
      .filter((l) => l.cmd)
      .map((l) => l.cmd)
      .join("\n");
    navigator.clipboard.writeText(commands);
    toast.success("Commands copied!");
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-base-300/50">
      <div
        className={`px-4 py-2 text-sm font-semibold flex items-center justify-between ${COLOR_STYLES[color]}`}
      >
        {title}
        <button
          type="button"
          onClick={handleCopy}
          className="btn btn-ghost btn-xs btn-circle"
          title="Copy commands"
        >
          <CopyIcon className="size-3.5" />
        </button>
      </div>
      <div className="bg-base-300/20 px-4 py-3 space-y-1.5 font-mono text-sm">
        {lines.map((line, idx) =>
          line.cmd ? (
            <div key={idx}>
              <span className="text-success">$ </span>
              {line.cmd}
            </div>
          ) : (
            <div key={idx} className="text-base-content/40 text-xs pl-3">
              {line.note}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const methodColor = {
  GET: "badge-info",
  POST: "badge-success",
  PUT: "badge-warning",
  DELETE: "badge-error",
};

const CopyableLine = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn btn-ghost btn-xs btn-circle shrink-0"
      title="Copy"
    >
      {copied ? (
        <CheckIcon className="size-3.5 text-success" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
    </button>
  );
};

const DeveloperPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-16">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to home
        </Link>

        {/* HEADER */}
        <div className="space-y-3">
          <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.primary}`}>
            DEVELOPER
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NexaTalk
            </span>{" "}
            is built
          </h1>
          <p className="text-base-content/70 max-w-2xl">
            Every stack choice, feature, and endpoint behind this site — enough to run it on your
            own machine. This is a living document: it gets updated every time something real
            ships, not written once and left to rot.
          </p>
          <p className="text-sm text-base-content/40">Last updated {LAST_UPDATED}</p>
        </div>

        {/* STACK */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.secondary}`}>
              STACK
            </p>
            <h2 className="text-2xl font-bold mt-1">What it's built with</h2>
          </div>
          <div className="space-y-3">
            {STACK.map(({ group, color, items }) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-base-content/50 w-20 shrink-0">{group}</span>
                {items.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${COLOR_STYLES[color]}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* GET IT RUNNING */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.accent}`}>
              GET IT RUNNING
            </p>
            <h2 className="text-2xl font-bold mt-1">Run it on your machine</h2>
          </div>

          <div>
            <p className="font-semibold mb-2">You'll need</p>
            <ul className="space-y-1.5 text-sm text-base-content/70">
              {[
                "Node.js 18+ and npm",
                "A MongoDB database — a free MongoDB Atlas cluster works fine",
                "A Stream account for a free API key + secret (chat and video), from getstream.io",
                "A free Gemini API key from aistudio.google.com/apikey (for the AI buddy chat)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-success mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">1. Backend</p>
            <CodeBlock
              title="backend"
              color="info"
              lines={[
                { cmd: "cd backend" },
                { cmd: "npm install" },
                { cmd: "cp .env.example .env" },
                { note: "then fill in the values — see Environment variables below" },
                { cmd: "npm run dev" },
                { note: "starts the API on http://localhost:5001 with auto-reload (nodemon)" },
              ]}
            />
          </div>

          <div>
            <p className="font-semibold mb-2">2. Frontend (in a second terminal)</p>
            <CodeBlock
              title="frontend"
              color="accent"
              lines={[
                { cmd: "cd frontend" },
                { cmd: "npm install" },
                { cmd: "cp .env.example .env" },
                { note: "then set VITE_STREAM_API_KEY — see Environment variables below" },
                { cmd: "npm run dev" },
                { note: "starts the site on http://localhost:5173" },
              ]}
            />
          </div>

          <p className="text-sm text-base-content/60">
            Once both are running: sign up through the UI — there's no seed script, accounts are
            created the normal way — and the site is at http://localhost:5173 with the API at
            http://localhost:5001.
          </p>
        </section>

        {/* CONFIGURATION */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.warning}`}>
              CONFIGURATION
            </p>
            <h2 className="text-2xl font-bold mt-1">Environment variables</h2>
          </div>

          <div className="rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-start gap-3">
            <KeyRoundIcon className="size-4 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-base-content/70">
              These are placeholder examples, not real values. Use your own MongoDB cluster and
              your own Stream keys — never the live production database. Both{" "}
              <code className="text-xs">.env</code> files are gitignored, so nobody should need
              (or ask for) the real ones to run this locally.
            </p>
          </div>

          <div className="rounded-xl border border-info/30 bg-info/5 px-4 py-3 text-sm text-base-content/70">
            One gotcha: the backend variables are spelled{" "}
            <code className="text-xs">STEAM_API_KEY</code> /{" "}
            <code className="text-xs">STEAM_API_SECRET</code> (missing the R), while the frontend
            one is spelled correctly as{" "}
            <code className="text-xs">VITE_STREAM_API_KEY</code>. Both point at the same Stream
            app — it's just an inconsistent name, not two different services.
          </div>

          <EnvTable title="backend/.env" rows={BACKEND_ENV} color="info" />
          <EnvTable title="frontend/.env" rows={FRONTEND_ENV} color="accent" />
        </section>

        {/* DESIGN PHILOSOPHY */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.info}`}>
              APPROACH
            </p>
            <h2 className="text-2xl font-bold mt-1">Design philosophy</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className={`rounded-2xl border border-base-300/50 border-l-4 bg-base-200/40 p-4 ${BORDER_L_COLOR[p.color]}`}
              >
                <p className="font-semibold mb-1.5">{p.title}</p>
                <p className="text-sm text-base-content/60">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.success}`}>
              SHIPPED
            </p>
            <h2 className="text-2xl font-bold mt-1">Features built so far</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rounded-2xl border border-base-300/50 bg-base-200/40 p-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`flex items-center justify-center size-7 rounded-full shrink-0 ${COLOR_STYLES[color]}`}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <p className="font-semibold">{title}</p>
                </div>
                <p className="text-sm text-base-content/60">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* API REFERENCE */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.secondary}`}>
              INTEGRATE
            </p>
            <h2 className="text-2xl font-bold mt-1">API reference</h2>
          </div>
          <div className="space-y-4">
            {API_GROUPS.map((group) => (
              <div key={group.name} className="rounded-2xl border border-base-300/50 overflow-hidden">
                <div
                  className={`px-4 py-2.5 flex items-baseline gap-2 ${COLOR_STYLES[group.color]}`}
                >
                  <span className="font-semibold text-sm">{group.name}</span>
                  <span className="text-xs opacity-60 font-mono">{group.base}</span>
                </div>
                <div className="divide-y divide-base-300/40">
                  {group.routes.map((r) => (
                    <div key={r.path} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                      <span className={`badge badge-sm ${methodColor[r.method]} font-mono`}>
                        {r.method}
                      </span>
                      <span className="font-mono text-sm flex-1 min-w-[8rem]">{r.path}</span>
                      <span className="badge badge-ghost badge-sm">{r.auth}</span>
                      <span className="text-sm text-base-content/60">{r.desc}</span>
                      <CopyableLine text={`${group.base}${r.path}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* UNDER THE HOOD: CHAT + VIDEO */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.accent}`}>
              UNDER THE HOOD
            </p>
            <h2 className="text-2xl font-bold mt-1">Real-time chat &amp; video</h2>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 space-y-4">
            <div>
              <p className="font-semibold text-sm">Provider</p>
              <p className="text-sm text-base-content/70">
                Stream (chat + video) — one Stream app backs both. The server issues a per-user
                token from <code className="text-xs">/api/chat/token</code>; the client never sees
                the API secret.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Deterministic channels</p>
              <p className="text-sm text-base-content/70">
                A chat channel's id is the two participants' ids, sorted and joined with{" "}
                <code className="text-xs">-</code>. Whichever side opens the conversation first,
                both land in the same channel — no separate "who started it" bookkeeping.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm">Calls start from chat</p>
              <p className="text-sm text-base-content/70">
                There's no standalone "start a call" flow. Starting a call from a chat sends a
                message with the call's URL; clicking it is what actually joins the Stream Video
                room at <code className="text-xs">/call/:id</code>.
              </p>
            </div>
          </div>
        </section>

        {/* TRUST / SECURITY */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.success}`}>
              TRUST
            </p>
            <h2 className="text-2xl font-bold mt-1">Security</h2>
          </div>
          <ul className="space-y-2 text-sm text-base-content/70">
            {[
              "The auth token is a JWT in an httpOnly cookie (7-day expiry) — not readable from JavaScript, so it can't be lifted by an XSS payload.",
              "Passwords are hashed with bcrypt — never stored or logged in plain text.",
              "CORS is locked to CLIENT_URL, not left open to any origin.",
              "The cookie's secure flag turns on automatically in production (NODE_ENV=production), requiring HTTPS.",
              "All secrets (JWT signing key, database URI, Stream API secret) live in a gitignored .env and never reach the frontend bundle.",
              "A banned account is blocked at login and, if already logged in, on its very next request - protectRoute clears the cookie and returns 403 rather than waiting for the token to expire.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ShieldCheckIcon className="size-4 text-success shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* CONTRIBUTING */}
        <section className="space-y-4">
          <div>
            <p className={`text-xs font-semibold tracking-widest ${EYEBROW_COLOR.primary}`}>
              JOIN IN
            </p>
            <h2 className="text-2xl font-bold mt-1">Contributing</h2>
          </div>
          <div className="space-y-3 text-sm text-base-content/70">
            <p>
              This has been a solo, incrementally-built project — if a friend hands you a copy of
              the code, here's how to work on it without fighting the existing patterns.
            </p>
            <p>
              Match what's already there: no comments unless something is genuinely non-obvious,
              no new abstraction for a one-off case, Tailwind utility classes + daisyUI components
              instead of new CSS files, and a single global theme — no page sets its own.
            </p>
            <p>
              Run both the backend and frontend locally (see above) and actually click through
              whatever you changed before calling it done — a build passing isn't the same as a
              feature working.
            </p>
            <p>
              This page is meant to stay accurate. If you add or change a feature, update the
              relevant section here in the same change.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-base-300/40 p-5">
            <p className="font-semibold mb-1">Still going</p>
            <p className="text-sm text-base-content/70">
              NexaTalk is being built one step at a time. Nothing here is final — features get
              added, reworked, and sometimes reverted as the project grows. Check back on this
              page whenever you're curious what's changed.
            </p>
          </div>
        </section>

        <div className="border-t border-base-300/40 pt-6 text-sm text-base-content/40">
          Designed &amp; developed by Kaushik Banik
        </div>
      </div>
    </div>
  );
};

const EnvTable = ({ title, rows, color = "info" }) => (
  <div>
    <p className="text-sm font-semibold mb-2">{title}</p>
    <div className="rounded-xl border border-base-300/50 overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead className={COLOR_STYLES[color]}>
          <tr>
            <th className="text-left px-4 py-2 font-medium text-xs tracking-wide opacity-80">
              VARIABLE
            </th>
            <th className="text-left px-4 py-2 font-medium text-xs tracking-wide opacity-80">
              WHAT IT'S FOR
            </th>
            <th className="text-left px-4 py-2 font-medium text-xs tracking-wide opacity-80">
              EXAMPLE
            </th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody className="divide-y divide-base-300/40">
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="px-4 py-2.5 font-mono text-xs whitespace-nowrap">{row.key}</td>
              <td className="px-4 py-2.5 text-base-content/70">{row.desc}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-base-content/40">{row.example}</td>
              <td className="px-2">
                <CopyableLine text={row.key} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default DeveloperPage;
