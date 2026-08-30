import { Link } from "react-router";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  HammerIcon,
  LayersIcon,
  MonitorIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";

const LAST_UPDATED = "August 26, 2026";

const COLOR_STYLES = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  info: "bg-info/10 text-info border-info/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
};

const PITCH_SECTIONS = [
  {
    icon: SparklesIcon,
    color: "primary",
    title: "What it is",
    body: `A full-stack language-exchange platform for practicing a language with a real person
      instead of flashcards. You get matched with other learners based on what you're learning
      versus what you already speak natively, and can get into an actual conversation — text or
      video — in a couple of clicks.`,
  },
  {
    icon: LayersIcon,
    color: "info",
    title: "Stack",
    body: `React 19/Vite on the frontend with Tailwind + daisyUI, and Node/Express/MongoDB on the
      backend, with JWT auth in an httpOnly cookie and bcrypt-hashed passwords. Real-time chat and
      video both run on Stream (stream-chat-react and the Stream Video SDK) instead of me
      hand-rolling WebSocket infrastructure — the server issues a scoped Stream token per user, so
      the API secret never reaches the browser.`,
  },
  {
    icon: ShieldCheckIcon,
    color: "success",
    title: "Design principles",
    body: `Never fake a feature, and never trust the client for anything that enforces a rule.
      Optional profile fields (phone, location, bio, links) disappear entirely instead of
      rendering an empty row when unset. Placeholders — like the Admin/Learner-role pills that
      aren't real roles yet — say so explicitly with a "Coming soon!" toast instead of pretending
      to be finished. A chat channel's id is just both participants' ids sorted and joined, so
      whoever opens the conversation first, both sides land in the same channel with no separate
      bookkeeping for who started it.`,
  },
  {
    icon: VideoIcon,
    color: "accent",
    title: "Chat & video",
    body: `Video calls aren't a separate button bolted onto the dashboard — a call is started from
      inside a chat, which posts the call's own link as a chat message; clicking it is what
      actually joins the Stream Video room. That keeps calling attached to a real conversation
      instead of being its own disconnected feature.`,
  },
  {
    icon: HammerIcon,
    color: "warning",
    title: "How it was built",
    body: `Incrementally, one feature at a time — auth and onboarding first, then friend discovery
      and requests, then chat, then video calls, then a full profile system with photo upload —
      each one confirmed working in the real running app before the next started. Which is also
      why this Developer and Learner section exists: it's meant to stay a live, honest account of
      the whole thing, not a one-time writeup that goes stale.`,
  },
];

const FILE_SECTIONS = [
  {
    key: "backend",
    to: "/learn/backend",
    icon: ServerIcon,
    title: "Backend",
    desc: "Every backend file — full code plus a detailed explanation of what it does and how it fits the request flow.",
    iconColor: "text-emerald-600",
    cardBg: "bg-emerald-50",
    ring: "ring-emerald-900/5 hover:ring-emerald-900/10",
    titleColor: "text-emerald-950",
    bodyColor: "text-emerald-950/60",
    linkColor: "text-emerald-950/70 group-hover:text-emerald-950",
  },
  {
    key: "frontend",
    to: "/learn/frontend",
    icon: MonitorIcon,
    title: "Frontend",
    desc: "Every frontend file — full code plus a detailed explanation of what it renders and how it fits the app.",
    iconColor: "text-sky-600",
    cardBg: "bg-sky-50",
    ring: "ring-sky-900/5 hover:ring-sky-900/10",
    titleColor: "text-sky-950",
    bodyColor: "text-sky-950/60",
    linkColor: "text-sky-950/70 group-hover:text-sky-950",
  },
];

const LearnPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to home
        </Link>

        {/* HEADER */}
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-secondary">LEARNER</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Learn from the code</h1>
          <p className="text-base-content/70 max-w-2xl">
            Everything here is meant for interview prep — the real code behind this project, why
            it's built the way it is, and the kind of questions it tends to turn into.
          </p>
        </div>

        {/* PITCH CARD */}
        <div className="rounded-3xl border border-base-300/50 bg-base-200/40 overflow-hidden">
          <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-base-300/40">
            <p className="text-xs font-semibold tracking-widest text-warning">
              THE 60-SECOND PITCH, FOR AN INTERVIEWER
            </p>
            <p className="text-sm text-base-content/50 mt-1">
              Read top to bottom in under a minute.
            </p>
          </div>

          <div className="divide-y divide-base-300/40">
            {PITCH_SECTIONS.map(({ icon: Icon, color, title, body }) => (
              <div key={title} className="px-6 sm:px-8 py-5 flex gap-4">
                <span
                  className={`flex items-center justify-center size-9 rounded-xl border shrink-0 ${COLOR_STYLES[color]}`}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold mb-1">{title}</p>
                  <p className="text-sm text-base-content/70 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EVERY FILE, IN FULL */}
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-secondary">
              EVERY FILE, IN FULL
            </p>
            <h2 className="text-lg font-bold mt-1">Walk the codebase file by file</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FILE_SECTIONS.map(
              ({ key, to, icon: Icon, title, desc, iconColor, cardBg, ring, titleColor, bodyColor, linkColor }) => (
                <Link
                  key={key}
                  to={to}
                  className={`group text-left rounded-2xl p-5 shadow-sm ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${cardBg} ${ring}`}
                >
                  <span className="flex items-center justify-center size-10 rounded-xl bg-white shadow-sm mb-3">
                    <Icon className={`size-5 ${iconColor}`} />
                  </span>
                  <p className={`font-bold text-lg mb-1 ${titleColor}`}>{title}</p>
                  <p className={`text-sm mb-4 ${bodyColor}`}>{desc}</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${linkColor}`}>
                    View all files
                    <ChevronRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              )
            )}
          </div>
        </section>

        <p className="text-sm text-base-content/40">Last updated {LAST_UPDATED}</p>
      </div>
    </div>
  );
};

export default LearnPage;
