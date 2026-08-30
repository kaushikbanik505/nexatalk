import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { SendIcon, XIcon } from "lucide-react";
import { sendAiBuddyMessage } from "../lib/api";
import mascotFull from "../assets/mascot-full.png";

const THINKING_STEPS = ["Thinking...", "Choosing the right words...", "Almost there..."];

// role/text pairs match backend/src/services/geminiChat.js's expected shape 1:1 -
// sent back as "history" on every request so the AI buddy remembers this session's conversation.
const AiBuddyModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: "model", text: "Hey! I'm your AI buddy. Ask me to translate something, check your phrasing, or just practice a conversation." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (!sending) return;
    setThinkingStep(0);
    const interval = setInterval(() => {
      setThinkingStep((prev) => Math.min(prev + 1, THINKING_STEPS.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.map(({ role, text }) => ({ role, text }));
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const { reply } = await sendAiBuddyMessage(text, history);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (error) {
      toast.error(error.response?.data?.message || "The AI buddy is unavailable right now.");
    } finally {
      setSending(false);
    }
  };

  return createPortal(
    <div
      data-theme="night"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border border-base-content/10 w-full max-w-md rounded-3xl shadow-2xl shadow-black/50 h-[80vh] max-h-[640px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-base-content/10 shrink-0">
          <img src={mascotFull} alt="" className="size-9 object-contain -my-2" />
          <div className="flex-1">
            <p className="font-bold leading-tight">AI buddy</p>
            <p className="text-xs text-base-content/50">Powered by Gemini</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-content"
                    : "bg-base-300/50 text-base-content"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-base-300/50 text-base-content/60 italic">
                {THINKING_STEPS[thinkingStep]}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-base-content/10 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI buddy anything..."
            disabled={sending}
            className="input input-bordered flex-1 rounded-full bg-base-300/30"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="btn btn-primary btn-circle shrink-0"
          >
            <SendIcon className="size-4" />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AiBuddyModal;
