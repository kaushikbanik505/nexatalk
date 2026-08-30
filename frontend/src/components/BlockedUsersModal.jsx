import { createPortal } from "react-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ShieldOffIcon, XIcon } from "lucide-react";
import { getBlockedUsers, unblockUser } from "../lib/api";
import Avatar from "./Avatar";

const BlockedUsersModal = ({ onClose }) => {
  const queryClient = useQueryClient();

  const { data: blockedUsers = [], isLoading } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  const { mutate: unblock, isPending } = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success("User unblocked");
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't unblock that user"),
  });

  return createPortal(
    <div
      data-theme="night"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border border-base-content/10 w-full max-w-md rounded-3xl shadow-2xl shadow-black/50 max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 shrink-0">
          <h2 className="text-lg font-bold">Blocked users</h2>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3 space-y-1 flex-1">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : blockedUsers.length === 0 ? (
            <p className="text-sm text-base-content/50 text-center py-8">
              You haven't blocked anyone.
            </p>
          ) : (
            blockedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-base-300/30"
              >
                <Avatar src={user.profilePic} name={user.fullName} size="size-10" />
                <p className="font-medium truncate flex-1">{user.fullName}</p>
                <button
                  type="button"
                  onClick={() => unblock(user._id)}
                  disabled={isPending}
                  className="btn btn-outline btn-xs gap-1.5"
                >
                  <ShieldOffIcon className="size-3.5" />
                  Unblock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlockedUsersModal;
