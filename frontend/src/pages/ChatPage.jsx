import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import ChatHeader from "../components/ChatHeader";
import { connectStreamUser, withStreamRetry } from "../lib/streamClient";

const ChatPage = () => {
  const { id: targetId } = useParams();
  const isGroup = useLocation().pathname.startsWith("/chat/group/");

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");
        setError(false);

        const { client, currChannel } = await withStreamRetry(async () => {
          const client = await connectStreamUser(authUser, tokenData.token);

          // Group channels are already created (with their members) by
          // NewGroupModal.jsx before navigating here - targetId is the real
          // channel id, just watch it. 1-on-1 channels don't exist ahead of
          // time, so the id is derived the same way on both ends: the two
          // participants' Mongo ids sorted alphabetically and joined with a
          // dash, meaning whichever person opens the conversation first, both
          // land in the exact same channel with zero extra bookkeeping.
          const currChannel = isGroup
            ? client.channel("messaging", targetId)
            : client.channel("messaging", [authUser._id, targetId].sort().join("-"), {
                members: [authUser._id, targetId],
              });

          await currChannel.watch();

          return { client, currChannel };
        });

        setChatClient(client);
        setChannel(currChannel);
      } catch (err) {
        console.error("Error initializing chat:", err);
        toast.error("Could not connect to chat. Please try again.", { id: "chat-connect-error" });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetId, isGroup]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
        <p className="text-lg font-semibold">Couldn't connect to this chat</p>
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

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-full p-3 sm:p-5">
      <div className="h-full max-w-4xl mx-auto rounded-2xl border border-base-300/50 overflow-hidden shadow-xl shadow-black/20 str-chat__theme-dark">
        <Chat client={chatClient} theme="messaging dark">
          <Channel channel={channel}>
            <div className="w-full h-full min-w-0 flex flex-col">
              <Window>
                <ChatHeader onVideoCall={handleVideoCall} isGroup={isGroup} />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};
export default ChatPage;