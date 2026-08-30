import { Link } from "react-router";
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react";

const LAST_UPDATED = "August 27, 2026";

const SECTIONS = [
  {
    title: "1. Information collected",
    body: [
      "Account info: your full name, email, and password (stored as a bcrypt hash, never in plain text).",
      "Profile info: bio, native and learning language, location, phone number, links, and a profile photo — all optional beyond what's asked during onboarding, and all editable later.",
      "Usage data: your friends list, sent/received friend requests, and the chat channels you're part of (message content itself is stored and delivered by Stream, not this app's own database).",
    ],
  },
  {
    title: "2. How it's used",
    body: [
      "To run the core features: matching you with other learners, showing your profile to people you interact with, and enabling chat and video calls.",
      "Nothing collected here is sold, or used for advertising — there's no ad or analytics tracking on NexaTalk today.",
    ],
  },
  {
    title: "3. Third-party services",
    body: [
      "Stream powers real-time chat and video calls. When you message or call another user, that content is transmitted and stored through Stream's infrastructure under its own terms, not NexaTalk's own servers.",
      "MongoDB Atlas hosts the application's database (accounts, profiles, friend requests). It's a standard managed database provider, not a party that independently uses your data.",
      "A profile photo you don't upload yourself can be sourced from a third-party random-avatar generator you explicitly choose to use.",
    ],
  },
  {
    title: "4. Cookies & sessions",
    body: [
      "NexaTalk sets one cookie: a JWT authentication token, httpOnly (unreadable by JavaScript) with a 7-day expiry. It's used solely to keep you logged in — there are no third-party tracking or advertising cookies.",
    ],
  },
  {
    title: "5. Data retention & deletion",
    body: [
      "Your data is kept for as long as your account exists. There's no self-service \"delete my account\" button yet — reach out and it will be removed manually, including your profile, friend requests, and account record.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "Passwords are hashed with bcrypt. The auth cookie is httpOnly and, in production, requires HTTPS. CORS is locked to this app's own frontend origin. See the Developer page for the full technical rundown.",
      "No system is perfectly secure, and NexaTalk is a small, independently-run project — treat sensitive personal information with the same caution you'd use on any app at this stage.",
    ],
  },
  {
    title: "7. Your choices",
    body: [
      "Every optional profile field (bio, phone, location, links, photo) can be edited or cleared at any time from your profile. You can stop using the app at any time; see the Data retention section above for account removal.",
    ],
  },
  {
    title: "8. Children's privacy",
    body: [
      "NexaTalk isn't directed at young children and doesn't knowingly collect information from them.",
    ],
  },
  {
    title: "9. Changes to this policy",
    body: [
      "This policy may change as the app grows. Meaningful changes will be reflected by updating the date at the top of this page.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "NexaTalk is designed and developed by Kaushik Banik. For questions about this policy or your data, reach out through wherever you were given access to this app.",
    ],
  },
];

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to home
        </Link>

        {/* HEADER */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-8 rounded-full bg-secondary/10 text-secondary">
              <ShieldCheckIcon className="size-4" />
            </span>
            <p className="text-xs font-semibold tracking-widest text-secondary">LEGAL</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-base-content/70 max-w-2xl">
            What data NexaTalk collects, why, and how it's kept — in plain language. Read alongside
            the{" "}
            <Link to="/terms" className="text-secondary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
          <p className="text-sm text-base-content/40">Last updated {LAST_UPDATED}</p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title} className="space-y-2.5">
              <h2 className="text-lg font-bold">{section.title}</h2>
              {section.body.map((para, idx) => (
                <p key={idx} className="text-sm text-base-content/70 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="border-t border-base-300/40 pt-6 text-sm text-base-content/40">
          Designed &amp; developed by Kaushik Banik
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
