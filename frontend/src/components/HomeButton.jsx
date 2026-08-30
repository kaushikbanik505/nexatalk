import { Link } from "react-router";
import { HomeIcon } from "lucide-react";

const HomeButton = () => {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-full border border-base-300/50 bg-base-200/70 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:border-primary/50 hover:bg-base-200 hover:scale-105 transition-all duration-200"
    >
      <HomeIcon className="size-4 text-primary" />
      Home
    </Link>
  );
};

export default HomeButton;
