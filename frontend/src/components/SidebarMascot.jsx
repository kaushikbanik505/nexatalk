import { useEffect, useState } from "react";
import { MessageCircleIcon } from "lucide-react";
import mascotFull from "../assets/mascot-full.png";
import AiBuddyModal from "./AiBuddyModal";

const GREETING = "Hey, how are you? Welcome to NexaTalk!";

const SidebarMascot = () => {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(GREETING.slice(0, i));
      if (i >= GREETING.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-3">
      <div className="relative mb-4 max-w-[180px] rounded-2xl border border-base-300/50 bg-base-200/90 backdrop-blur-sm px-3 py-2 text-xs leading-snug text-base-content/80 shadow-lg">
        {typed}
        {!done && <span className="inline-block w-1 h-3 -mb-0.5 ml-0.5 bg-primary/70 animate-pulse" />}
        <div className="absolute left-1/2 -bottom-[5px] -translate-x-1/2 size-2.5 rotate-45 bg-base-200/90 border-b border-r border-base-300/50" />
      </div>

      <img
        src={mascotFull}
        alt="NexaTalk mascot"
        draggable={false}
        className="w-[210px] select-none pointer-events-none animate-mascot-wave"
      />

      <p className="mt-3 text-center text-xs text-base-content/50 max-w-[170px]">
        Chat with your AI buddy to learn better, learn faster
      </p>

      <button
        onClick={() => setChatOpen(true)}
        className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 hover:scale-105 transition-all duration-200"
      >
        <MessageCircleIcon className="size-4" />
        Chat
      </button>

      {chatOpen && <AiBuddyModal onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default SidebarMascot;
