import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ShieldOffIcon } from "lucide-react";
import { blockUser, getUserFriends, unfriendUser } from "../lib/api";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import StarryBackground from "../components/StarryBackground";
import HomeButton from "../components/HomeButton";
import BlockedUsersModal from "../components/BlockedUsersModal";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const [showBlocked, setShowBlocked] = useState(false);

  // A short poll (not a websocket) so presence dots drift back to "offline"
  // and friends who go active both update without requiring a manual refresh -
  // same pattern the Admin dashboard's Online tab already uses.
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    refetchInterval: 30000,
  });

  const invalidateFriends = () => queryClient.invalidateQueries({ queryKey: ["friends"] });

  const { mutate: runUnfriend } = useMutation({
    mutationFn: unfriendUser,
    onSuccess: () => {
      toast.success("Friend removed");
      invalidateFriends();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't remove that friend"),
  });

  const { mutate: runBlock } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success("User blocked");
      invalidateFriends();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't block that user"),
  });

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <StarryBackground />
      <div className="relative z-10 container mx-auto space-y-6">
        <HomeButton />

        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
            <p className="text-base-content/60 mt-1">
              Everyone you've connected with so far — jump into a chat any time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBlocked(true)}
            className="btn btn-ghost btn-sm gap-2"
          >
            <ShieldOffIcon className="size-4" />
            Blocked users
          </button>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                onUnfriend={runUnfriend}
                onBlock={runBlock}
              />
            ))}
          </div>
        )}
      </div>

      {showBlocked && <BlockedUsersModal onClose={() => setShowBlocked(false)} />}
    </div>
  );
};

export default FriendsPage;
