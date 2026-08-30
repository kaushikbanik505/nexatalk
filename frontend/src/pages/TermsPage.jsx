import { Link } from "react-router";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";

const LAST_UPDATED = "August 27, 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: [
      "By creating an account or otherwise using NexaTalk, you agree to these Terms of Service. If you don't agree with any part of them, please don't use the app.",
      "NexaTalk is an independent, actively-developed project — not a registered company. These terms describe how the app is meant to be used, in plain language, rather than functioning as a formal legal contract.",
    ],
  },
  {
    title: "2. What NexaTalk is",
    body: [
      "NexaTalk is a language-exchange app: you create a profile, get matched with other learners, and practice a language through text chat and video calls.",
      "Chat and video calls are powered by Stream, a third-party service — see the Privacy Policy for what that means for your data.",
    ],
  },
  {
    title: "3. Your account",
    body: [
      "You need an account (email + password) to use NexaTalk. You're responsible for keeping your password safe and for anything that happens under your account.",
      "You must provide accurate information during signup and onboarding (name, bio, native/learning language, location). Don't impersonate someone else or create an account for anyone but yourself.",
      "You must be old enough, under the laws of your country, to consent to using an app like this. NexaTalk isn't directed at young children and isn't built with the protections such use would require.",
    ],
  },
  {
    title: "4. Acceptable use",
    body: [
      "Be a decent conversation partner. Don't use NexaTalk to harass, threaten, or abuse other users, send content that's illegal, hateful, or sexually exploitative, impersonate another person, or scrape, spam, or attempt to disrupt the service.",
      "Video calls connect you with another real person — treat that the same way you'd treat any interaction with a stranger. NexaTalk currently has no automated moderation of live chat or video; use good judgment about what you share.",
    ],
  },
  {
    title: "5. Content you share",
    body: [
      "You keep ownership of whatever you write or upload (bio, profile photo, chat messages). By posting it, you're giving NexaTalk permission to store and display it back to you and the users you interact with, purely so the app can function.",
      "Don't upload anything you don't have the right to share, or anything illegal.",
    ],
  },
  {
    title: "6. No warranty",
    body: [
      "NexaTalk is provided \"as is,\" without warranties of any kind. It's an ongoing project — features change, break, and get rebuilt; see the What's Next page for a candid list of known gaps.",
      "NexaTalk isn't liable for how another user behaves toward you, for lost data, or for any indirect or consequential damages arising from using the app.",
    ],
  },
  {
    title: "7. Suspension & termination",
    body: [
      "An account that violates these terms — abuse toward other users, in particular — can be suspended or removed without advance notice.",
      "You can stop using NexaTalk at any time. A self-service account-deletion flow doesn't exist yet; reach out and your data can be removed manually in the meantime.",
    ],
  },
  {
    title: "8. Changes to these terms",
    body: [
      "These terms can change as the app grows. Meaningful changes will be reflected by updating the date at the top of this page — there's no separate change log.",
    ],
  },
  {
    title: "9. Contact",
    body: [
      "NexaTalk is designed and developed by Kaushik Banik. For questions about these terms, reach out through wherever you were given access to this app.",
    ],
  },
];

const TermsPage = () => {
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
            <span className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
              <FileTextIcon className="size-4" />
            </span>
            <p className="text-xs font-semibold tracking-widest text-primary">LEGAL</p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-base-content/70 max-w-2xl">
            The plain-language rules for using NexaTalk. Read alongside the{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            , which covers what data is collected and why.
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

export default TermsPage;
