import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CameraIcon, LoaderIcon, UsersIcon, XIcon } from "lucide-react";
import { getStreamToken, getUserFriends } from "../lib/api";
import { connectStreamUser, safeStreamImage } from "../lib/streamClient";
import useAuthUser from "../hooks/useAuthUser";
import Avatar from "./Avatar";

const MIN_MEMBERS = 1; // + yourself = a group of at least 2

const NewGroupModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupPhoto, setGroupPhoto] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isCreating, setIsCreating] = useState(false);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const toggleFriend = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setGroupPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const canCreate =
    groupName.trim().length > 0 && selectedIds.size >= MIN_MEMBERS && !isCreating;

  const handleCreate = async () => {
    if (!canCreate || !authUser || !tokenData?.token) return;

    setIsCreating(true);
    try {
      const client = await connectStreamUser(authUser, tokenData.token);

      // Same 8KB cap Stream enforces everywhere else in this app (see streamClient.js) -
      // a device photo picked here is a base64 data URI that can run to hundreds of KB,
      // and unlike a profile pic there's no MongoDB copy to fall back to for a group, so
      // an oversized one is simply left off rather than breaking the group's connection.
      const channel = client.channel("messaging", crypto.randomUUID(), {
        name: groupName.trim(),
        description: groupDescription.trim() || undefined,
        image: safeStreamImage(groupPhoto),
        members: [authUser._id, ...selectedIds],
      });

      await channel.create();

      onClose();
      navigate(`/chat/group/${channel.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Could not create the group. Please try again.");
    } finally {
      setIsCreating(false);
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 shrink-0">
          <div>
            <h2 className="text-lg font-bold">New group</h2>
            <p className="text-xs text-base-content/50">Pick friends to chat and call together</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="overflow-y-auto px-6 py-5 space-y-5">
          {/* GROUP PHOTO + NAME */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar src={groupPhoto} name={groupName || "?"} size="size-16" />
              <label
                htmlFor="group-photo-input"
                className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-xs shadow-lg cursor-pointer"
              >
                <CameraIcon className="size-3" />
              </label>
              <input
                id="group-photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Group name"
              maxLength={60}
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="textarea textarea-bordered textarea-sm w-full"
            placeholder="Description (optional)"
            maxLength={200}
          />

          {/* FRIEND PICKER */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Members {selectedIds.size > 0 && `(${selectedIds.size} selected)`}
              </span>
            </label>

            {loadingFriends ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-md" />
              </div>
            ) : friends.length === 0 ? (
              <p className="text-sm text-base-content/50 py-4 text-center">
                You don't have any friends to add yet.
              </p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto rounded-xl border border-base-300/50 p-2">
                {friends.map((friend) => {
                  const isSelected = selectedIds.has(friend._id);
                  return (
                    <label
                      key={friend._id}
                      className={`flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer transition-colors ${
                        isSelected ? "bg-primary/15" : "hover:bg-base-300/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFriend(friend._id)}
                        className="checkbox checkbox-primary checkbox-sm"
                      />
                      <Avatar src={friend.profilePic} name={friend.fullName} size="size-9" />
                      <span className="font-medium truncate">{friend.fullName}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t border-base-content/10 shrink-0">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!canCreate}
            className="btn btn-primary flex-1 gap-2"
          >
            {isCreating ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <>
                <UsersIcon className="size-4" />
                Create group
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewGroupModal;
