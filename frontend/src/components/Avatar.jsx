import { useEffect, useState } from "react";

const COLORS = [
  "bg-primary/15 text-primary",
  "bg-secondary/15 text-secondary",
  "bg-accent/15 text-accent",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
];

const getColor = (name) => {
  if (!name) return COLORS[0];
  const idx = name.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
};

// isOnline is opt-in: leave it undefined (the default) on any avatar where
// presence isn't known or doesn't apply, and no dot renders at all. Only pass
// an actual true/false where a real lastActiveAt-derived value exists (see
// lib/presence.js) - FriendCard.jsx and ChatHeader.jsx are the two callers.
const Avatar = ({ src, name = "", size = "size-12", className = "", isOnline }) => {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const showStatus = isOnline !== undefined;

  return (
    <div className={`avatar shrink-0 ${size} ${className} ${showStatus ? "relative" : ""}`}>
      <div className="rounded-full w-full h-full">
        {src && !failed ? (
          <img src={src} alt={name} onError={() => setFailed(true)} />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center font-semibold ${getColor(
              name
            )}`}
          >
            {initial}
          </div>
        )}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-base-100 ${
            isOnline ? "bg-success" : "bg-base-content/25"
          }`}
          aria-label={isOnline ? "Online" : "Offline"}
        />
      )}
    </div>
  );
};

export default Avatar;
