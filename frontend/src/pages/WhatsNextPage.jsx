import { Link } from "react-router";
import {
  ArrowLeftIcon,
  CircleDashedIcon,
  RocketIcon,
  ShipWheelIcon,
} from "lucide-react";

const COLOR_STYLES = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

const NEXATALK_IDEAS = [
  {
    color: "accent",
    title: "A more capable AI buddy",
    body: "The sidebar mascot's \"💬 Chat\" button now opens a real Gemini-powered conversation partner, personalized with your native/learning language. Next steps for it: pull it into real 1:1 chats as an inline \"suggest a reply\" or \"check my phrasing\" action instead of only living in its own separate window, and give it memory across sessions instead of forgetting the conversation the moment the modal closes.",
  },
  {
    color: "info",
    title: "Notifications beyond the browser tab",
    body: "Desktop browser notifications now cover new messages while NexaTalk is open in a tab somewhere — but there's still no email digest and no mobile push, so a message while your browser is fully closed still goes unnoticed until you open the app again.",
  },
  {
    color: "success",
    title: "Presence everywhere, not just chat",
    body: "A genuine lastActiveAt heartbeat now drives real online dots on the Friends page and in a 1:1 chat header — but the navbar's profile card still shows a fixed \"Online\" badge that doesn't read that same signal. Wiring the existing heartbeat into that one remaining spot is a small follow-up, not a new system.",
  },
  {
    color: "warning",
    title: "Proficiency levels in matching",
    body: "nativeLanguage and learningLanguage are plain strings with no fluency level attached, so a total beginner and a near-fluent speaker can get recommended to each other with zero signal either way.",
  },
  {
    color: "secondary",
    title: "Group practice rooms",
    body: "Every chat channel today is strictly 1:1 — the channel id is built from exactly two member ids. A multi-person room, e.g. everyone currently learning Spanish talking together, would need a genuinely different channel model, not a tweak.",
  },
  {
    color: "primary",
    title: "Real moderation tools, not just visibility",
    body: "The Admin dashboard now gives real oversight — user management, live \"who's online,\" and a 24-hour activity feed with a ban button. What it still can't do: nobody can actually report a message or a user yet, so an admin only sees what they happen to notice, not what someone flagged.",
  },
];

const OPEN_PROBLEMS = [
  {
    title: "Correction fatigue",
    body: "Nobody's found a UX that lets a partner correct your mistakes mid-conversation without breaking the flow of an actual conversation. Interrupt too much and it stops feeling like talking; interrupt too little and the practice loses its point.",
  },
  {
    title: "The free-rider asymmetry",
    body: "A native speaker paired with a learner usually ends up giving more than they get back — more correcting, less practicing their own target language. No widely-used app has a fair mechanism for balancing \"teaching time\" against \"practice time.\"",
  },
  {
    title: "Self-reported fluency is unreliable",
    body: "Every app asks \"how good are you at this language,\" and almost everyone answers a little optimistically. There's no lightweight, non-intimidating way to actually verify a level instead of just trusting the label someone picked at signup.",
  },
  {
    title: "Timezone scheduling is still manual",
    body: "Live conversation practice needs two people online at the same moment. Every app's answer is still effectively \"message them and hope\" — nobody's solved the handoff between async messaging and an actual synced call time.",
  },
  {
    title: "Retention after the novelty wears off",
    body: "Most language-exchange apps see a steep drop-off after the first few conversations. Sustained accountability for a habit that takes real effort — talking to a stranger in a language you're bad at — is still an open problem, not just a notifications problem.",
  },
  {
    title: "Safety in 1:1 video with strangers",
    body: "Pairing people who've never met for live video carries real risk that text doesn't. Reporting and blocking exist everywhere, but they respond after a bad interaction rather than prevent the first one — this would need careful, deliberate design, not a naive copy of a report button from elsewhere.",
  },
];

const WhatsNextPage = () => {
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
          <p className="text-xs font-semibold tracking-widest text-secondary">WHAT'S NEXT</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Future scope</h1>
          <p className="text-base-content/70 max-w-2xl">
            Honest ideation, not a promised roadmap — what could plausibly get built next, and a
            step back to look at what's still genuinely unsolved in language exchange more
            broadly.
          </p>
        </div>

        {/* FOR NEXATALK ITSELF */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-4 text-primary" />
            <h2 className="text-sm font-bold tracking-wide text-primary">FOR NEXATALK ITSELF</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NEXATALK_IDEAS.map((idea) => (
              <div key={idea.title} className="rounded-2xl border border-base-300/50 bg-base-200/40 p-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`flex items-center justify-center size-7 rounded-full shrink-0 ${COLOR_STYLES[idea.color]}`}
                  >
                    <ShipWheelIcon className="size-3.5" />
                  </span>
                  <p className="font-semibold">{idea.title}</p>
                </div>
                <p className="text-sm text-base-content/60">{idea.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BROADER, INDUSTRY-WIDE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CircleDashedIcon className="size-4 text-warning" />
            <h2 className="text-sm font-bold tracking-wide text-warning">
              STILL UNSOLVED IN LANGUAGE EXCHANGE, BROADLY
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OPEN_PROBLEMS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-base-300/50 bg-base-200/40 p-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="flex items-center justify-center size-7 rounded-full shrink-0 bg-warning/10 text-warning">
                    <CircleDashedIcon className="size-3.5" />
                  </span>
                  <p className="font-semibold">{item.title}</p>
                </div>
                <p className="text-sm text-base-content/60">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-base-content/40">
            These are observations about the space, not commitments — a couple of them (safety
            especially) would need real care in the design before they'd be responsible to build
            at all.
          </p>
        </section>

        {/* MORE GETS ADDED HERE TOO */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-base-300/40 p-5">
          <div className="flex items-center gap-2 mb-1">
            <RocketIcon className="size-4 text-primary" />
            <p className="font-semibold">More gets added here too</p>
          </div>
          <p className="text-sm text-base-content/70">
            As new features actually get built, they land on the{" "}
            <Link to="/developer" className="text-primary hover:underline">
              Developer page
            </Link>{" "}
            — same rule as here: kept current, not written once and forgotten.
          </p>
        </div>

        <div className="border-t border-base-300/40 pt-6 text-sm text-base-content/40">
          Designed &amp; developed by Kaushik Banik
        </div>
      </div>
    </div>
  );
};

export default WhatsNextPage;
