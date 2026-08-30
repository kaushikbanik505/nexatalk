import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { InboxIcon, UsersIcon } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../lib/api";
import { connectStreamUser, withStreamRetry } from "../lib/streamClient";
import StarryBackground from "../components/StarryBackground";
import HomeButton from "../components/HomeButton";
import Avatar from "../components/Avatar";
import ChatLoader from "../components/ChatLoader";
import NewGroupModal from "../components/NewGroupModal";

const formatPreviewTime = (dateStr) => {
  const date = new Date(dateStr);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString();
};

const queryMyChannels = (client, userId) =>
  client.queryChannels(
    { type: "messaging", members: { $in: [userId] } },
    { last_message_at: -1 },
    { watch: true, state: true }
  );

const MessagesPage = () => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [channels, setChannels] = useState(null); // null = still loading
  const [error, setError] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    let ignore = false;
    let client;
    let refreshHandler;

    (async () => {
      try {
        setError(false);
        const result = await withStreamRetry(async () => {
          client = await connectStreamUser(authUser, tokenData.token);
          return queryMyChannels(client, authUser._id);
        });
        if (ignore) return;
        setChannels(result);

        refreshHandler = () => {
          queryMyChannels(client, authUser._id).then((updated) => {
            if (!ignore) setChannels(updated);
          });
        };
        client.on("message.new", refreshHandler);
      } catch (err) {
        console.error("Error loading inbox:", err);
        if (!ignore) {
          toast.error("Could not load your messages. Please try again.", { id: "inbox-connect-error" });
          setError(true);
        }
      }
    })();

    return () => {
      ignore = true;
      if (client && refreshHandler) client.off("message.new", refreshHandler);
    };
  }, [tokenData, authUser]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-lg font-semibold">Couldn't load your messages</p>
        <p className="text-sm text-base-content/60 max-w-sm">
          Something went wrong reaching the chat server. Try again, or head back home.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm"
          >
            Try again
          </button>
          <Link to="/" className="btn btn-outline btn-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (channels === null) return <ChatLoader />;

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <StarryBackground />
      <div className="relative z-10 container mx-auto max-w-3xl space-y-6">
        <HomeButton />

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Messages</h2>
            <p className="text-base-content/60 mt-1">
              Every conversation you've started, most recent first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewGroup(true)}
            className="btn btn-primary btn-sm gap-2"
          >
            <UsersIcon className="size-4" />
            New group
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="rounded-2xl border border-base-300/50 bg-base-200/40 p-10 text-center space-y-3">
            <InboxIcon className="size-10 text-base-content/30 mx-auto" />
            <p className="font-semibold">No conversations yet</p>
            <p className="text-sm text-base-content/60">
              Start one from a friend's card on the Friends page, or create a group above.
            </p>
            <Link to="/friends" className="btn btn-primary btn-sm mt-2">
              Go to Friends
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {channels.map((channel) => {
              const memberIds = Object.keys(channel.state.members);
              // A group can be as small as 2 people, same size as a real 1-on-1
              // chat, so member count alone can't tell them apart - only
              // NewGroupModal.jsx sets a channel name, so that's the real signal.
              const isGroup = Boolean(channel.data?.name);

              const otherId = memberIds.find((id) => id !== authUser._id);
              const other = channel.state.members[otherId]?.user;

              const title = isGroup ? channel.data?.name || "Group" : other?.name || "Unknown user";
              const avatarSrc = isGroup ? channel.data?.image : other?.image;
              const destination = isGroup ? `/chat/group/${channel.id}` : `/chat/${otherId}`;

              const messages = channel.state.messages;
              const lastMessage = messages[messages.length - 1];
              const unread = channel.countUnread();

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => navigate(destination)}
                  className="w-full flex items-center gap-3 rounded-2xl border border-base-300/50 bg-base-200/40 hover:border-primary/40 hover:bg-base-200 transition-colors px-4 py-3 text-left"
                >
                  <Avatar src={avatarSrc} name={title} size="size-12" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{title}</p>
                      {lastMessage && (
                        <span className="text-xs text-base-content/40 shrink-0">
                          {formatPreviewTime(lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/60 truncate">
                      {lastMessage ? lastMessage.text : "No messages yet — say hi!"}
                    </p>
                  </div>
                  {unread > 0 && <span className="badge badge-primary badge-sm shrink-0">{unread}</span>}
                </button>
              );
            })}
          </div>
        )}

        {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} />}
      </div>
    </div>
  );
};

export default MessagesPage;
