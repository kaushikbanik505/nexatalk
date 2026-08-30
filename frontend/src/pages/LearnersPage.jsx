import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../lib/api";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, XIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import { getLanguageFlag } from "../components/FriendCard";
import StarryBackground from "../components/StarryBackground";
import Avatar from "../components/Avatar";
import HomeButton from "../components/HomeButton";

const LearnersPage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();
  const langFilter = searchParams.get("lang");

  const { data: allRecommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const recommendedUsers = langFilter
    ? allRecommendedUsers.filter(
        (user) => user.learningLanguage?.toLowerCase() === langFilter.toLowerCase()
      )
    : allRecommendedUsers;

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        if (req.recipient) outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <StarryBackground />
      <div className="relative z-10 container mx-auto space-y-6">
        <HomeButton />

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {langFilter ? (
              <span className="inline-flex items-center gap-2">
                {getLanguageFlag(langFilter)}
                Learning {capitialize(langFilter)}
              </span>
            ) : (
              "Meet New Learners"
            )}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <p className="text-base-content/60">
              {langFilter
                ? `Everyone currently learning ${capitialize(langFilter)}`
                : "Discover perfect language exchange partners based on your profile"}
            </p>
            {langFilter && (
              <button
                onClick={() => setSearchParams({})}
                className="inline-flex items-center gap-1.5 rounded-full border border-base-300/50 bg-base-200/70 px-3 py-1 text-xs font-medium hover:border-primary/50 transition-colors"
              >
                <XIcon className="size-3" />
                Clear filter
              </button>
            )}
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200/70 backdrop-blur-sm border border-base-300/50 p-10 text-center">
            <h3 className="font-semibold text-lg mb-2">
              {langFilter ? `No one learning ${capitialize(langFilter)} yet` : "No recommendations available"}
            </h3>
            <p className="text-base-content/60">
              {langFilter
                ? "Check back later, or browse everyone instead."
                : "Check back later for new language partners!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

              return (
                <div
                  key={user._id}
                  className="group relative overflow-hidden rounded-2xl border border-base-300/50 bg-base-200/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* top accent glow */}
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                  <div className="relative p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profilePic}
                        name={user.fullName}
                        size="size-16"
                        className="ring-2 ring-base-100 group-hover:ring-primary/30 transition-all duration-300"
                      />

                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs text-base-content/60 mt-1">
                            <MapPinIcon className="size-3 mr-1 shrink-0" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Languages with flags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-base-300/60 bg-base-100/40 px-3 py-1 text-xs font-medium">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && (
                      <p className="text-sm text-base-content/60 border-l-2 border-base-300/50 pl-3 italic line-clamp-2">
                        {user.bio}
                      </p>
                    )}

                    {/* Action button */}
                    <button
                      className={`btn w-full mt-2 gap-2 ${
                        hasRequestBeenSent
                          ? "btn-disabled"
                          : "btn-primary hover:scale-[1.02] transition-transform"
                      } `}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnersPage;
