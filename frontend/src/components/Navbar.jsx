import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { MenuIcon, ShipWheelIcon } from "lucide-react";
import ProfileCard from "./ProfileCard";
import { NAV_ITEMS } from "./Sidebar";

const Navbar = () => {
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

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
  }, [location.pathname]);

  return (
    <nav
      className={`bg-base-200/70 backdrop-blur-md border-b border-base-300/50 sticky top-0 z-30 flex items-center ${
        isChatPage ? "h-12" : "h-16"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* LEFT: mobile hamburger menu, desktop logo (chat pages only) */}
          <div className="flex items-center">
            <div ref={menuRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`btn btn-ghost btn-circle ${isChatPage ? "btn-sm" : ""}`}
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </button>

              {menuOpen && (
                <ul className="absolute top-full left-0 mt-2 p-2 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 z-10">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                          location.pathname === item.to
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

            {isChatPage && (
              <Link to="/" className="hidden lg:flex items-center gap-2 pl-5">
                <ShipWheelIcon className="size-6 text-primary" />
                <span className="text-lg font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  NexaTalk
                </span>
              </Link>
            )}
          </div>

          {/* CENTER: mobile logo, desktop tagline (non-chat pages) */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <ShipWheelIcon className="size-7 text-primary" />
              <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                NexaTalk
              </span>
            </Link>
            {!isChatPage && (
              <p className="hidden lg:block text-sm text-base-content/50">
                Real conversations, with real people.
              </p>
            )}
          </div>

          {/* RIGHT: profile */}
          <div className="flex items-center">
            <ProfileCard variant="compact" />
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
