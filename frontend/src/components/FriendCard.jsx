import { Link } from "react-router";
import { BanIcon, MessageCircleIcon, UserMinusIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { isRecentlyActive } from "../lib/presence";
import Avatar from "./Avatar";

const FriendCard = ({ friend, onUnfriend, onBlock }) => {
  const isOnline = isRecentlyActive(friend.lastActiveAt);

  const handleUnfriend = () => {
    if (window.confirm(`Remove ${friend.fullName} from your friends?`)) {
      onUnfriend?.(friend._id);
    }
  };

  const handleBlock = () => {
    if (
      window.confirm(
        `Block ${friend.fullName}? They'll be removed as a friend and won't be able to send you a new friend request.`
      )
    ) {
      onBlock?.(friend._id);
    }
  };

  return (
    <div className="card bg-base-200/70 backdrop-blur-sm border border-base-300/50 hover:border-primary/40 transition-colors duration-300">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={friend.profilePic} name={friend.fullName} size="size-12" isOnline={isOnline} />
          <h3 className="font-semibold truncate flex-1">{friend.fullName}</h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              title="Unfriend"
              onClick={handleUnfriend}
              className="btn btn-ghost btn-xs btn-circle"
            >
              <UserMinusIcon className="size-3.5" />
            </button>
            <button
              type="button"
              title="Block"
              onClick={handleBlock}
              className="btn btn-ghost btn-xs btn-circle text-error"
            >
              <BanIcon className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-ghost badge-sm text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline badge-sm text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline btn-sm w-full gap-2">
          <MessageCircleIcon className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
