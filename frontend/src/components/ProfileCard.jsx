import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  BellIcon,
  ChevronRightIcon,
  CopyIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import Avatar from "./Avatar";
import EditProfileModal from "./EditProfileModal";

const ProfileCard = ({ variant = "sidebar" }) => {
  const { authUser } = useAuthUser();
  const { logoutMutation } = useLogout();
  const isCompact = variant === "compact";

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(authUser?.email || "");
    toast.success("Email copied!");
  };

  const links = (authUser?.links || []).filter(Boolean);

  return (
    <div ref={cardRef} className={`relative ${isCompact ? "" : "w-full"}`}>
      {isCompact ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full pr-1 hover:bg-base-content/5 transition-colors"
        >
          <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="size-9" />
          <div className="hidden sm:block text-left min-w-0 max-w-[140px]">
            <p className="text-sm font-semibold truncate uppercase">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 w-full rounded-xl p-1 -m-1 hover:bg-base-content/5 transition-colors"
        >
          <Avatar src={authUser?.profilePic} name={authUser?.fullName} size="size-10" />
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </button>
      )}

      {open && (
        <div
          className={`absolute w-80 max-w-[calc(100vw-2rem)] bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-black/5 overflow-hidden z-20 ${
            isCompact ? "top-full right-0 mt-2" : "bottom-full left-0 mb-2"
          }`}
        >
          {/* COVER + HEADER */}
          <div className="bg-gradient-to-r from-primary/70 via-secondary/60 to-primary/70 px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar
                  src={authUser?.profilePic}
                  name={authUser?.fullName}
                  size="size-16"
                  className="rounded-full ring-4 ring-base-200"
                />
                <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-success border-2 border-base-200" />
              </div>
              <div className="min-w-0">
                <p className="font-bold leading-tight truncate text-white">{authUser?.fullName}</p>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full mt-1">
                  <span className="size-1.5 rounded-full bg-success" />
                  Member
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 pt-4 pb-5">
            {/* NOTIFICATIONS */}
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 text-sm py-1.5 rounded-lg px-1.5 -mx-1.5 mb-2 hover:bg-primary/10 transition-colors"
            >
              <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 shrink-0">
                <BellIcon className="size-3.5 text-primary" />
              </span>
              <span className="flex-1 font-medium">Notifications</span>
              <ChevronRightIcon className="size-4 text-base-content/30 shrink-0" />
            </Link>
            <div className="border-t border-base-content/10 mb-2" />

            <div className="space-y-0.5">
              {/* EMAIL */}
              <div className="flex items-center gap-2.5 text-sm py-1.5 min-w-0 rounded-lg px-1.5 -mx-1.5 hover:bg-base-content/5 transition-colors">
                <span className="flex items-center justify-center size-6 rounded-full bg-base-content/10 shrink-0">
                  <MailIcon className="size-3.5 text-base-content/60" />
                </span>
                <span className="truncate flex-1">{authUser?.email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn btn-ghost btn-xs btn-circle shrink-0"
                >
                  <CopyIcon className="size-3.5" />
                </button>
              </div>

              {/* PHONE */}
              {authUser?.phone && (
                <div className="flex items-center gap-2.5 text-sm py-1.5 rounded-lg px-1.5 -mx-1.5 hover:bg-base-content/5 transition-colors">
                  <span className="flex items-center justify-center size-6 rounded-full bg-base-content/10 shrink-0">
                    <PhoneIcon className="size-3.5 text-base-content/60" />
                  </span>
                  <span>{authUser.phone}</span>
                </div>
              )}

              {/* LOCATION */}
              {authUser?.location && (
                <div className="flex items-center gap-2.5 text-sm py-1.5 rounded-lg px-1.5 -mx-1.5 hover:bg-base-content/5 transition-colors">
                  <span className="flex items-center justify-center size-6 rounded-full bg-base-content/10 shrink-0">
                    <MapPinIcon className="size-3.5 text-base-content/60" />
                  </span>
                  <span>{authUser.location}</span>
                </div>
              )}
            </div>

            {/* BIO */}
            {authUser?.bio && (
              <p className="text-sm text-base-content/70 leading-relaxed mt-3 whitespace-pre-wrap break-words">
                {authUser.bio}
              </p>
            )}

            {/* LINKS */}
            {links.length > 0 && (
              <div className="mt-3 space-y-0.5">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={/^https?:\/\//.test(link) ? link : `https://${link}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm text-primary py-1.5 rounded-lg px-1.5 -mx-1.5 hover:bg-primary/10 transition-colors truncate"
                  >
                    <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 shrink-0">
                      <LinkIcon className="size-3.5" />
                    </span>
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-2 mt-5 pt-4 border-t border-base-content/10">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setOpen(false);
                }}
                className="btn btn-outline btn-sm flex-1 gap-1.5 hover:bg-info hover:text-info-content hover:border-info transition-colors"
              >
                <PencilIcon className="size-3.5" />
                Edit profile
              </button>
              <button
                type="button"
                onClick={logoutMutation}
                className="btn btn-outline btn-sm flex-1 gap-1.5 hover:bg-error hover:text-error-content hover:border-error transition-colors"
              >
                <LogOutIcon className="size-3.5" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && <EditProfileModal authUser={authUser} onClose={() => setEditing(false)} />}
    </div>
  );
};

export default ProfileCard;
