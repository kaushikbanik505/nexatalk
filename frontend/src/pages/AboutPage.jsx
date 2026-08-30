import { Link } from "react-router";
import {
  ArrowRightIcon,
  BotIcon,
  GlobeIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  ShipWheelIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

import StarryBackground from "../components/StarryBackground";
import useAuthUser from "../hooks/useAuthUser";

const HIGHLIGHTS = [
  {
    icon: UsersIcon,
    title: "Matched by language",
    description:
      "Every account lists a native language and a learning language — NexaTalk uses that to recommend real people worth talking to, not random strangers.",
  },
  {
    icon: MessageSquareIcon,
    title: "Real-time chat",
    description:
      "Message your language partners instantly, one-on-one or in group chats, with a live inbox for every conversation you've started.",
  },
  {
    icon: VideoIcon,
    title: "HD video calls",
    description:
      "Move from text to a live video conversation in one click — the fastest way to actually practice speaking, not just typing.",
  },
  {
    icon: BotIcon,
    title: "AI language buddy",
    description:
      "A Gemini-powered chat buddy is always on hand to translate a phrase, check your wording, or help you practice before you try it on a real person.",
  },
  {
    icon: GlobeIcon,
    title: "14+ languages",
    description:
      "From Spanish to Mandarin to Arabic, find partners across a wide range of languages worth learning.",
  },
  {
    icon: ShieldCheckIcon,
    title: "A moderated community",
    description:
      "Block or unfriend anyone in one tap, and a real admin team can suspend accounts that break the rules.",
  },
];

const AboutPage = () => {
  const { authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-base-100">
      <StarryBackground />

      {/* NAV */}
      <header className="relative z-10">
        <nav className="container mx-auto flex items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2">
            <ShipWheelIcon className="size-8 text-primary" />
            <span className="font-mono text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NexaTalk
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link to="/" className="btn btn-primary btn-sm sm:btn-md">
                Back to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="container mx-auto px-6 pt-16 pb-20 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
            <SparklesIcon className="size-4" />
            About NexaTalk
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Real people.
            <span className="block text-primary">Real conversations.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-base-content/70">
            The fastest way to actually learn a language is talking to a real person who's
            learning yours in return. No scripted lessons, no textbooks — just live chat and video
            calls with partners matched to what you speak and what you're learning.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "Free to join",
              "Real-time chat & video",
              "Community of learners",
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium"
              >
                <span className="size-2 rounded-full bg-success" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to practice
            </h2>
            <p className="mt-4 text-base-content/70">
              A focused set of tools that get you into real conversations faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card bg-base-200/70 backdrop-blur-sm border border-base-300/50 hover:border-primary/40 transition-colors duration-300"
              >
                <div className="card-body p-6">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-base-content/70">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why NexaTalk exists</h2>
            <p className="mt-5 text-base-content/70 leading-relaxed">
              Apps and flashcards can teach you vocabulary, but fluency comes from real
              conversation — the kind with pauses, mistakes, laughter, and someone patient enough
              to help you get it right. NexaTalk exists to make that easy to find: a place where
              two people can trade languages, one conversation at a time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-20">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 px-6 py-14 sm:py-16 text-center">
            {isAuthenticated ? (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Ready to jump back in?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base-content/70">
                  Your language partners are waiting — head back to your dashboard.
                </p>
                <Link to="/" className="btn btn-primary btn-lg gap-2 mt-8">
                  Back to dashboard
                  <ArrowRightIcon className="size-5" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Ready to start speaking?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-base-content/70">
                  Join NexaTalk today and connect with your first language partner in minutes.
                </p>
                <Link to="/signup" className="btn btn-primary btn-lg gap-2 mt-8">
                  Create Your Free Account
                  <ArrowRightIcon className="size-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-6 text-primary" />
            <span className="font-mono font-bold tracking-wider">NexaTalk</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-base-content/50">
            <Link to="/developer" className="hover:text-base-content transition-colors">
              Developer
            </Link>
            <Link to="/terms" className="hover:text-base-content transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-base-content transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-sm text-base-content/50">
            &copy; {new Date().getFullYear()} NexaTalk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
