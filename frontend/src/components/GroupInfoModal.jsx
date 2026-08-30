import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  CheckIcon,
  CrownIcon,
  LoaderIcon,
  LogOutIcon,
  PencilIcon,
  ShieldIcon,
  ShieldOffIcon,
  UserMinusIcon,
  XIcon,
} from "lucide-react";
import { demoteGroupAdmin, promoteGroupAdmin } from "../lib/api";
import Avatar from "./Avatar";

// Stream's own channel member roles ("moderator" for anyone promoted, plus
// whoever's id matches the channel's created_by) are reused directly as this
// group's "admin"/"creator" concept instead of inventing a parallel one.
// removeMembers is a real Stream Chat call made straight from this client,
// but promoting/demoting an admin is NOT - Stream blocks channel member-role
// changes client-side entirely ("changing channel member roles is not
// allowed client-side"), so those two go through backend endpoints
// (lib/api.js) that use the Stream server SDK instead. Both are still
// enforced server-side, not just hidden buttons.
const GroupInfoModal = ({ channel, authUser, onClose }) => {
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(channel.data?.description || "");
  const [savingDescription, setSavingDescription] = useState(false);

  const members = Object.values(channel.state.members);
  const creatorId = channel.data?.created_by?.id;

  const isCreator = (userId) => Boolean(userId) && userId === creatorId;
  const isAdmin = (member) =>
    member.channel_role === "moderator" || isCreator(member.user?.id);

  const myMembership = channel.state.members[authUser._id];
  const iAmAdmin = myMembership ? isAdmin(myMembership) : false;

  const runAction = async (id, action) => {
    setBusyId(id);
    try {
      await action();
    } catch (error) {
      console.error("Group action failed:", error);
      toast.error(error.response?.data?.message || "Couldn't complete that action.");
    } finally {
      setBusyId(null);
    }
  };

  const handleMakeAdmin = (userId) =>
    runAction(userId, async () => {
      await promoteGroupAdmin(channel.id, userId);
      await channel.watch();
      toast.success("Made admin");
    });

  const handleRemoveAdmin = (userId) =>
    runAction(userId, async () => {
      await demoteGroupAdmin(channel.id, userId);
      await channel.watch();
      toast.success("Removed admin");
    });

  const handleSaveDescription = async () => {
    setSavingDescription(true);
    try {
      await channel.updatePartial({ set: { description: descriptionDraft.trim() } });
      setEditingDescription(false);
      toast.success("Description updated");
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Couldn't update the description.");
    } finally {
      setSavingDescription(false);
    }
  };

  const handleRemoveMember = (userId, name) =>
    runAction(userId, async () => {
      await channel.removeMembers([userId]);
      toast.success(`Removed ${name} from the group`);
    });

  const handleExit = () =>
    runAction("exit", async () => {
      await channel.removeMembers([authUser._id]);
      toast.success("You left the group");
      onClose();
      navigate("/messages");
    });

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
          <h2 className="text-lg font-bold">Group info</h2>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* GROUP IDENTITY */}
        <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-3 shrink-0">
          <Avatar src={channel.data?.image} name={channel.data?.name} size="size-20" />
          <p className="font-bold text-lg text-center">{channel.data?.name || "Group"}</p>
          <p className="text-xs text-base-content/50">{members.length} members</p>
        </div>

        {/* DESCRIPTION */}
        <div className="px-6 pb-4 shrink-0">
          {editingDescription ? (
            <div className="space-y-2">
              <textarea
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                className="textarea textarea-bordered textarea-sm w-full"
                placeholder="What's this group about?"
                maxLength={200}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDescriptionDraft(channel.data?.description || "");
                    setEditingDescription(false);
                  }}
                  className="btn btn-ghost btn-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDescription}
                  disabled={savingDescription}
                  className="btn btn-primary btn-xs gap-1"
                >
                  {savingDescription ? (
                    <LoaderIcon className="size-3 animate-spin" />
                  ) : (
                    <CheckIcon className="size-3" />
                  )}
                  Save
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => iAmAdmin && setEditingDescription(true)}
              className={`w-full text-left text-sm rounded-lg px-3 py-2 -mx-3 flex items-start justify-between gap-2 ${
                iAmAdmin ? "hover:bg-base-300/30 cursor-pointer" : "cursor-default"
              }`}
            >
              <span className={channel.data?.description ? "text-base-content/70" : "text-base-content/40 italic"}>
                {channel.data?.description ||
                  (iAmAdmin ? "Add a group description" : "No description yet")}
              </span>
              {iAmAdmin && <PencilIcon className="size-3.5 text-base-content/30 shrink-0 mt-0.5" />}
            </button>
          )}
        </div>

        {/* MEMBER LIST */}
        <div className="overflow-y-auto px-3 py-2 space-y-1 flex-1">
          {members.map((member) => {
            const userId = member.user?.id;
            const admin = isAdmin(member);
            const creator = isCreator(userId);
            const isSelf = userId === authUser._id;
            const busy = busyId === userId;
            const canManage = iAmAdmin && !isSelf && !creator;

            return (
              <div
                key={userId}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-base-300/30 transition-colors"
              >
                <Avatar src={member.user?.image} name={member.user?.name} size="size-10" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {member.user?.name}
                    {isSelf && <span className="text-base-content/40 font-normal"> (You)</span>}
                  </p>
                  {(creator || admin) && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <CrownIcon className="size-3" />
                      {creator ? "Creator" : "Admin"}
                    </p>
                  )}
                </div>

                {busy ? (
                  <LoaderIcon className="size-4 animate-spin text-base-content/40 shrink-0" />
                ) : (
                  canManage && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        title={admin ? "Remove as admin" : "Make admin"}
                        onClick={() =>
                          admin ? handleRemoveAdmin(userId) : handleMakeAdmin(userId)
                        }
                        className="btn btn-ghost btn-xs btn-circle"
                      >
                        {admin ? (
                          <ShieldOffIcon className="size-3.5" />
                        ) : (
                          <ShieldIcon className="size-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        title="Remove from group"
                        onClick={() => handleRemoveMember(userId, member.user?.name)}
                        className="btn btn-ghost btn-xs btn-circle text-error"
                      >
                        <UserMinusIcon className="size-3.5" />
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* STICKY FOOTER */}
        <div className="px-6 py-4 border-t border-base-content/10 shrink-0">
          <button
            type="button"
            onClick={handleExit}
            disabled={busyId === "exit"}
            className="btn btn-outline btn-error w-full gap-2"
          >
            {busyId === "exit" ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <LogOutIcon className="size-4" />
            )}
            Exit group
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GroupInfoModal;
