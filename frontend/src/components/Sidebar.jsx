import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  ShipWheelIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Avatar from "./Avatar";
import SidebarMascot from "./SidebarMascot";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/friends", label: "Friends", icon: UsersIcon },
  { to: "/messages", label: "Messages", icon: InboxIcon },
  { to: "/learners", label: "New Learners", icon: SparklesIcon },
  { to: "/notifications", label: "Notifications", icon: BellIcon },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  return (
    <aside className="w-64 bg-base-200/70 backdrop-blur-md border-r border-base-300/50 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300/50">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            NexaTalk
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col">
        <div ref={menuRef} className="relative w-full">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="btn btn-ghost justify-start w-full gap-3 px-3 normal-case"
          >
            <MenuIcon className="size-5 text-base-content opacity-70" />
            <span>Menu</span>
          </button>

          {menuOpen && (
            <ul className="absolute top-full left-0 mt-2 p-2 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-full border border-base-content/10 z-10">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      currentPath === item.to
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-base-content/5"
                    }`}
                  >
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <SidebarMascot />
        </div>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300/50 mt-auto">
        <div className="flex items-center gap-3">
          <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="size-10" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;