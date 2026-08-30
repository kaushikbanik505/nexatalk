import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import AiBuddyModal from "./AiBuddyModal";

// The sidebar (and its mascot's own "Chat" button) is desktop-only (hidden lg:flex),
// so without this floating button a phone has no way to reach the AI buddy at all.
const AiBuddyFab = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Chat with your AI buddy"
        className="lg:hidden fixed bottom-5 right-5 z-40 flex items-center justify-center size-14 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-200"
      >
        <MessageCircleIcon className="size-6" />
      </button>

      {chatOpen && <AiBuddyModal onClose={() => setChatOpen(false)} />}
    </>
  );
};

export default AiBuddyFab;
