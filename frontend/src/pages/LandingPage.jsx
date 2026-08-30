import { Link } from "react-router";
import {
  ArrowRightIcon,
  GlobeIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  ShipWheelIcon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";

import StarryBackground from "../components/StarryBackground";

const FEATURES = [
  {
    icon: UsersIcon,
    title: "Smart Partner Matching",
    description:
      "Get paired with language partners based on what you speak natively and what you're learning.",
  },
  {
    icon: MessageCircleIcon,
    title: "Real-Time Messaging",
    description:
      "Chat instantly with friends across the world with a fast, reliable messaging experience.",
  },
  {
    icon: VideoIcon,
    title: "HD Video Calls",
    description:
      "Jump into face-to-face conversations with crystal-clear video calling, built right in.",
  },
  {
    icon: GlobeIcon,
    title: "14+ Languages",
    description:
      "From Spanish to Mandarin to Arabic, find partners across a wide range of languages.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private & Secure",
    description: "Your conversations and data stay protected with secure, cookie-based auth.",
  },
  {
    icon: SparklesIcon,
    title: "Built for Focus",
    description: "A clean, distraction-free interface so conversations stay the main event.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create your profile",
    description: "Tell us your native language, what you're learning, and a bit about yourself.",
  },
  {
    step: "02",
    title: "Get matched",
    description: "Discover language partners recommended specifically for your learning goals.",
  },
  {
    step: "03",
    title: "Start talking",
    description: "Message or hop on a video call and start practicing in real conversations.",
  },
];

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-base-100">
      <StarryBackground />

      {/* NAV */}
      <header className="relative z-10">
        <nav className="container mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <ShipWheelIcon className="size-8 text-primary" />
            <span className="font-mono text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NexaTalk
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm sm:btn-md">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative z-10">
        <div className="container mx-auto px-6 pt-16 pb-24 sm:pt-20 sm:pb-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
            <SparklesIcon className="size-4" />
            Practice languages with real people
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
            Learn languages by
            <span className="block text-primary">actually talking</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-base-content/70">
            NexaTalk connects you with language partners worldwide for real conversations —
            chat, video call, and build fluency together.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg gap-2 w-full sm:w-auto">
              Get Started Free
              <ArrowRightIcon className="size-5" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg w-full sm:w-auto">
              Sign In
            </Link>
          </div>

          <p className="mt-4 text-sm text-base-content/50">
            Free to join &middot; No credit card required
          </p>
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
            {FEATURES.map(({ icon: Icon, title, description }) => (
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

      {/* HOW IT WORKS */}
      <section className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-20">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-base-content/70">
              Three steps between you and your first real conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="text-center sm:text-left">
                <span className="font-mono text-4xl font-bold text-primary/40">{step}</span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-base-content/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-base-300/50">
        <div className="container mx-auto px-6 py-20">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 px-6 py-14 sm:py-16 text-center">
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
          <p className="text-sm text-base-content/50">
            &copy; {new Date().getFullYear()} NexaTalk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
