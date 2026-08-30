import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AiBuddyFab from "./AiBuddyFab";

const Layout = ({ children, showSidebar = false }) => {
  // Chat pages (showSidebar=false) need main's height to be exactly
  // "viewport minus navbar", not just a scrollable min-height page, so their
  // own fixed-height chat box can fill it via h-full instead of guessing the
  // navbar's height with a manual calc() - a fragile pattern that broke
  // whenever the navbar's own height changed. Every other page keeps the
  // original grow-with-content, whole-page-scrolls behavior untouched.
  const fullHeight = !showSidebar;

  return (
    <div className={fullHeight ? "h-dvh" : "min-h-screen"}>
      <div className={`flex ${fullHeight ? "h-full" : ""}`}>
        {showSidebar && <Sidebar />}
        {showSidebar && <AiBuddyFab />}

        <div className={`flex-1 flex flex-col ${fullHeight ? "h-full min-h-0" : ""}`}>
          <Navbar />

          <main className={`flex-1 overflow-y-auto ${fullHeight ? "min-h-0" : ""}`}>{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;