import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  BanIcon,
  CheckIcon,
  LoaderIcon,
  UserMinusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { blockUser, getStreamToken, unfriendUser } from "../lib/api";
import { connectStreamUser } from "../lib/streamClient";
import { isRecentlyActive } from "../lib/presence";
import Avatar from "./Avatar";

// The WhatsApp-style "tap a contact's name in a chat" screen - a 1-on-1 twin
// of GroupInfoModal.jsx. friend is the friends-list entry ChatHeader.jsx
// already looked up (fullName/profilePic/languages/lastActiveAt), not a
// separate fetch.
const ContactInfoModal = ({ friend, authUser, onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [view, setView] = useState("info"); // "info" | "addToGroup"
  const [groups, setGroups] = useState(null); // null = not loaded yet
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const isOnline = isRecentlyActive(friend?.lastActiveAt);

  const leaveAndClose = () => {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    onClose();
    navigate("/friends");
  };

  const { mutate: runUnfriend, isPending: unfriending } = useMutation({
    mutationFn: unfriendUser,
    onSuccess: () => {
      toast.success("Friend removed");
      leaveAndClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't remove that friend"),
  });

  const { mutate: runBlock, isPending: blocking } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("User blocked");
      leaveAndClose();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't block that user"),
  });

  const handleUnfriend = () => {
    if (window.confirm(`Remove ${friend.fullName} from your friends?`)) runUnfriend(friend._id);
  };

  const handleBlock = () => {
    if (
      window.confirm(
        `Block ${friend.fullName}? They'll be removed as a friend and won't be able to send you a new friend request.`
      )
    ) {
      runBlock(friend._id);
    }
  };

  const loadGroups = async () => {
    setView("addToGroup");
    if (groups !== null) return; // already loaded once this time the modal is open

    setLoadingGroups(true);
    try {
      const tokenData = await getStreamToken();
      const client = await connectStreamUser(authUser, tokenData.token);
      const channels = await client.queryChannels(
        { type: "messaging", members: { $in: [authUser._id] } },
        { last_message_at: -1 },
        { state: true }
      );

      // Only real groups (named channels) this friend isn't already in.
      const eligible = channels.filter(
        (ch) => ch.data?.name && !Object.keys(ch.state.members).includes(friend._id)
      );
      setGroups(eligible);
    } catch (error) {
      console.error("Error loading groups:", error);
      toast.error("Couldn't load your groups.");
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const handleAddToGroup = async (channel) => {
    setAddingId(channel.id);
    try {
      await channel.addMembers([friend._id]);
      toast.success(`Added to "${channel.data?.name}"`);
      setGroups((prev) => prev.filter((c) => c.id !== channel.id));
    } catch (error) {
      console.error("Error adding to group:", error);
      toast.error("Couldn't add them to that group.");
    } finally {
      setAddingId(null);
    }
  };

  return createPortal(
    <div
      data-theme="night"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border border-base-content/10 w-full max-w-md rounded-3xl shadow-2xl shadow-black/50 max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY HEADER */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-base-content/10 shrink-0">
          {view === "addToGroup" && (
            <button
              type="button"
              onClick={() => setView("info")}
              className="btn btn-ghost btn-sm btn-circle"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
          )}
          <h2 className="text-lg font-bold flex-1">
            {view === "info" ? "Contact info" : "Add to a group"}
          </h2>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        {view === "info" ? (
          <>
            {/* IDENTITY */}
            <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-4 shrink-0">
              <Avatar
                src={friend?.profilePic}
                name={friend?.fullName}
                size="size-20"
                isOnline={isOnline}
              />
              <p className="font-bold text-lg text-center">{friend?.fullName}</p>
              <p className="text-xs text-base-content/50">{isOnline ? "Online" : "Offline"}</p>
            </div>

            {(friend?.nativeLanguage || friend?.learningLanguage) && (
              <div className="px-6 pb-4 flex flex-wrap gap-1.5 justify-center shrink-0">
                {friend?.nativeLanguage && (
                  <span className="badge badge-ghost badge-sm">Native: {friend.nativeLanguage}</span>
                )}
                {friend?.learningLanguage && (
                  <span className="badge badge-outline badge-sm">
                    Learning: {friend.learningLanguage}
                  </span>
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="px-6 pb-6 space-y-2 flex-1">
              <button
                type="button"
                onClick={loadGroups}
                className="btn btn-outline w-full gap-2 justify-start"
              >
                <UsersIcon className="size-4" />
                Add to a group
              </button>
              <button
                type="button"
                onClick={handleUnfriend}
                disabled={unfriending}
                className="btn btn-outline w-full gap-2 justify-start"
              >
                {unfriending ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <UserMinusIcon className="size-4" />
                )}
                Unfriend
              </button>
              <button
                type="button"
                onClick={handleBlock}
                disabled={blocking}
                className="btn btn-outline btn-error w-full gap-2 justify-start"
              >
                {blocking ? <LoaderIcon className="size-4 animate-spin" /> : <BanIcon className="size-4" />}
                Block
              </button>
            </div>
          </>
        ) : (
          <div className="overflow-y-auto px-4 py-3 space-y-1 flex-1">
            {loadingGroups ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-md" />
              </div>
            ) : groups.length === 0 ? (
              <p className="text-sm text-base-content/50 text-center py-8">
                No groups of yours that {friend?.fullName} isn't already in.
              </p>
            ) : (
              groups.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-base-300/30"
                >
                  <Avatar src={channel.data?.image} name={channel.data?.name} size="size-10" />
                  <p className="font-medium truncate flex-1">{channel.data?.name}</p>
                  <button
                    type="button"
                    onClick={() => handleAddToGroup(channel)}
                    disabled={addingId === channel.id}
                    className="btn btn-primary btn-xs gap-1"
                  >
                    {addingId === channel.id ? (
                      <LoaderIcon className="size-3 animate-spin" />
                    ) : (
                      <CheckIcon className="size-3" />
                    )}
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ContactInfoModal;
