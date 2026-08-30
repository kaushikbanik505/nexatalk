import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useChannelStateContext } from "stream-chat-react";
import { HomeIcon, InboxIcon, UsersIcon, VideoIcon } from "lucide-react";
import { getUserFriends } from "../lib/api";
import { isRecentlyActive } from "../lib/presence";
import Avatar from "./Avatar";
import GroupInfoModal from "./GroupInfoModal";
import ContactInfoModal from "./ContactInfoModal";
import useAuthUser from "../hooks/useAuthUser";

// Stream's default ChannelHeader looks like a generic third-party widget bar.
// This rebuilds the same information (who you're talking to, a way back, a
// way to start a call) using the app's own Avatar/typography so the chat
// pane reads as part of NexaTalk instead of an embedded plugin. Works for
// both a 1-on-1 channel (isGroup false - tapping the name/avatar opens
// ContactInfoModal - profile, add to a group, unfriend, block) and a group
// channel (isGroup true - tapping it opens GroupInfoModal - members, admins,
// exit group).
//
// Home/Messages/Friends sit on their own strip above the friend's
// name/avatar row instead of the previous single-row-crammed-with-everything
// layout, which used a "sticky top-12" that assumed a scroll offset that
// never actually applied here - it left a dead 48px gap above the header on
// every device instead of sticking to anything. Two rows, no sticky, closes
// that gap and gives the icons their own space without a "back" arrow -
// there's no sidebar/hamburger nav visible once you're inside a
// conversation, so this is the direct way out without backing out of the
// chat first.
const QUICK_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/messages", label: "Messages", icon: InboxIcon },
  { to: "/friends", label: "Friends", icon: UsersIcon },
];

const ChatHeader = ({ onVideoCall, isGroup = false }) => {
  const { channel } = useChannelStateContext();
  const { authUser } = useAuthUser();
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const members = Object.values(channel?.state?.members || {});
  const otherMember = members.find((member) => member.user?.id !== authUser?._id)?.user;

  // A 1-on-1 chat partner is by definition a friend (that's the only way to open
  // this page), so this reuses the same ["friends"] query FriendsPage.jsx already
  // populates/caches rather than adding a dedicated presence endpoint - lastActiveAt
  // isn't something Stream knows about, only MongoDB.
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !isGroup,
    refetchInterval: isGroup ? false : 30000,
  });
  const otherFriend = friends.find((friend) => friend._id === otherMember?.id);
  const isOnline = otherFriend ? isRecentlyActive(otherFriend.lastActiveAt) : undefined;

  const title = isGroup ? channel?.data?.name || "Group" : otherMember?.name || "Chat";
  const subtitle = isGroup
    ? `${members.length} members`
    : isOnline === undefined
    ? "Direct message"
    : isOnline
    ? "Online"
    : "Offline";
  const avatarSrc = isGroup ? channel?.data?.image : otherMember?.image;

  return (
    <div className="border-b border-base-300/50 bg-base-200/60 backdrop-blur-sm">
      <div className="flex items-center gap-0.5 px-2 pt-2">
        {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <Icon className="size-4" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 pb-3 pt-1">
        <button
          type="button"
          onClick={() => (isGroup ? setShowGroupInfo(true) : setShowContactInfo(true))}
          className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
        >
          <Avatar src={avatarSrc} name={title} size="size-10" isOnline={isGroup ? undefined : isOnline} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate leading-tight">{title}</p>
            <p className="text-xs text-base-content/50">{subtitle}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onVideoCall}
          className="btn btn-primary btn-sm gap-2 shrink-0"
          aria-label="Start video call"
        >
          <VideoIcon className="size-4" />
          <span className="hidden sm:inline">Video call</span>
        </button>
      </div>

      {showGroupInfo && authUser && (
        <GroupInfoModal
          channel={channel}
          authUser={authUser}
          onClose={() => setShowGroupInfo(false)}
        />
      )}

      {showContactInfo && authUser && otherFriend && (
        <ContactInfoModal
          friend={otherFriend}
          authUser={authUser}
          onClose={() => setShowContactInfo(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
