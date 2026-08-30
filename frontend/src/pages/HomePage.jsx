import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getRecommendedUsers, getUserFriends } from "../lib/api";
import { Link } from "react-router";
import {
  CodeIcon,
  GraduationCapIcon,
  InboxIcon,
  InfoIcon,
  RocketIcon,
  ShieldIcon,
  SparklesIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import StarryBackground from "../components/StarryBackground";
import useAuthUser from "../hooks/useAuthUser";
import { LANGUAGES, LEARNER_ACCESS_EMAIL } from "../constants";
import { getLanguageFlag } from "../components/FriendCard";

const ROLE_PILLS = [
  { label: "Admin", icon: ShieldIcon },
  { label: "Learner", icon: GraduationCapIcon },
  { label: "Developer", icon: CodeIcon, to: "/developer" },
  { label: "What's Next", icon: RocketIcon, to: "/whats-next" },
];

const HomePage = () => {
  const { authUser } = useAuthUser();
  const isLearnerAllowed = authUser?.email?.toLowerCase() === LEARNER_ACCESS_EMAIL;
  const isAdmin = authUser?.role === "admin";
  // Learner and Admin only link out for the accounts allowed to see them - everyone
  // else gets the same "Coming soon!" placeholder toast, so a locked feature looks
  // identical to one that isn't built yet.
  const rolePills = ROLE_PILLS.map((pill) => {
    if (pill.label === "Learner" && isLearnerAllowed) return { ...pill, to: "/learn" };
    if (pill.label === "Admin" && isAdmin) return { ...pill, to: "/admin" };
    return pill;
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <StarryBackground />
      <div className="relative z-10 container mx-auto space-y-10">
        {/* WELCOME HEADER */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back{authUser?.fullName ? `, ${authUser.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="text-base-content/60 mt-1">
            Here's what's happening with your language exchange.
          </p>
        </div>

        {/* QUICK NAV PILLS */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Online
          </span>

          <Link
            to="/friends"
            className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
          >
            <span className="size-2 rounded-full bg-info" />
            <span className="font-semibold">{friends.length}</span> friends
          </Link>

          <Link
            to="/messages"
            className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
          >
            <InboxIcon className="size-4 text-primary" />
            Messages
          </Link>

          <Link
            to="/notifications"
            className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
          >
            <span className="size-2 rounded-full bg-warning" />
            <span className="font-semibold">{incomingCount}</span> requests
          </Link>

          <Link
            to="/learners"
            className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
          >
            <SparklesIcon className="size-4 text-primary" />
            <span className="font-semibold">{recommendedUsers.length}</span> new learners
          </Link>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
          >
            <InfoIcon className="size-4 text-primary" />
            About
          </Link>
        </div>

        {/* PROMO BANNER */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-base-content/70">
            Built for language learners everywhere
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            Real conversations,
            <span className="text-primary"> with real people.</span>
          </h2>

          <p className="mt-4 text-base-content/70">
            No scripted lessons, no textbooks — just live chat and video calls with language
            partners matched to what you speak and what you're learning.
          </p>

          <p className="mt-3 text-sm text-base-content/50">
            Free to join &middot; Real-time chat &amp; video &middot; Community of learners
          </p>
        </div>

        {/* ROLE PILLS */}
        <div className="flex flex-wrap items-center gap-3">
          {rolePills.map(({ label, icon: Icon, to }) => {
            const className =
              "inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200";

            return to ? (
              <Link key={label} to={to} className={className}>
                <Icon className="size-4 text-primary" />
                {label}
              </Link>
            ) : (
              <button key={label} onClick={() => toast("Coming soon!")} className={className}>
                <Icon className="size-4 text-primary" />
                {label}
              </button>
            );
          })}
        </div>

        {/* LANGUAGE SELECTOR */}
        <div>
          <h3 className="text-sm font-semibold text-base-content/70 mb-3">Select your language</h3>
          <div className="flex flex-wrap items-center gap-2.5">
            {LANGUAGES.map((lang) => (
              <Link
                key={lang}
                to={`/learners?lang=${lang.toLowerCase()}`}
                className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
              >
                {getLanguageFlag(lang)}
                {lang}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-base-content/50">
            Pick a language to see everyone learning it — you can switch any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
