import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { connectStreamUser } from "../lib/streamClient";

// Stream fires "message.new" for a channel this client is actively watching
// (e.g. ChatPage.jsx/MessagesPage.jsx are open) and "notification.message_new"
// for every other channel the user belongs to but isn't currently watching -
// listening to both is what makes a message trigger a desktop notification no
// matter which page (or no NexaTalk page at all) is currently open.
const useMessageNotifications = (authUser) => {
  const navigate = useNavigate();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!authUser || !tokenData?.token) return;
    if (!("Notification" in window)) return;

    let client;
    let cancelled = false;

    const handleNewMessage = (event) => {
      if (Notification.permission !== "granted") return;

      const message = event.message;
      if (!message || message.user?.id === authUser._id) return;

      const channelId = event.channel_id;
      if (!channelId) return;

      const isGroup = Boolean(event.channel?.name);
      const chatUrl = isGroup ? `/chat/group/${channelId}` : `/chat/${message.user?.id}`;

      // Already looking at this exact conversation with the tab focused -
      // a notification here would just be a redundant popup over the message
      // the user can already see land in the message list.
      if (!document.hidden && window.location.pathname === chatUrl) return;

      const title = isGroup ? event.channel?.name || "New group message" : message.user?.name || "New message";
      const body = message.text || "Sent an attachment";

      const notification = new Notification(title, {
        body,
        icon: message.user?.image || undefined,
        tag: channelId, // collapses rapid-fire messages from the same chat into one notification
      });

      notification.onclick = () => {
        window.focus();
        navigate(chatUrl);
        notification.close();
      };
    };

    (async () => {
      client = await connectStreamUser(authUser, tokenData.token);
      if (cancelled) return;

      client.on("message.new", handleNewMessage);
      client.on("notification.message_new", handleNewMessage);
    })();

    return () => {
      cancelled = true;
      if (client) {
        client.off("message.new", handleNewMessage);
        client.off("notification.message_new", handleNewMessage);
      }
    };
  }, [authUser, tokenData, navigate]);
};

export default useMessageNotifications;
