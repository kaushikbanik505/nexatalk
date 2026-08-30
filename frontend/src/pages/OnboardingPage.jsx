import { useState } from "react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { CameraIcon, CheckCircleIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import StarryBackground from "../components/StarryBackground";
import Avatar from "../components/Avatar";
import { getLanguageFlag } from "../components/FriendCard";

const REQUIRED_FIELDS = ["fullName", "bio", "nativeLanguage", "learningLanguage", "location"];

const PERKS = [
  "Get matched with the right language partners",
  "Show up in the community's learner feed",
  "Start chatting the moment you finish",
];

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const filledCount = REQUIRED_FIELDS.filter((field) => formState[field]?.trim()).length;
  const progress = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
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
    reader.onload = () => setFormState((prev) => ({ ...prev, profilePic: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <StarryBackground />

      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors"
      >
        <ShipWheelIcon className="size-5" />
        <span className="font-mono font-bold tracking-wider">NexaTalk</span>
      </Link>

      <div className="relative z-10 border border-primary/20 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* FORM SECTION */}
        <div className="w-full lg:w-3/5 p-8 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Complete your profile</h1>
          <p className="text-sm text-base-content/60 mt-2">
            Tell the community a bit about yourself so we can match you with the right language
            partners.
          </p>

          {/* PROGRESS */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-base-content/50 mb-1.5">
              <span>Profile completeness</span>
              <span className="font-semibold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-7">
            {/* PROFILE PIC */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <Avatar
                  src={formState.profilePic}
                  name={formState.fullName}
                  size="size-20"
                  className="ring-4 ring-primary/15"
                />
                <label
                  htmlFor="onboarding-photo-input"
                  className="absolute -bottom-1 -right-1 btn btn-circle btn-primary btn-xs shadow-lg cursor-pointer"
                >
                  <CameraIcon className="size-3.5" />
                </label>
                <input
                  id="onboarding-photo-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1.5">Profile photo</p>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-outline btn-sm gap-1.5"
                >
                  <ShuffleIcon className="size-3.5" />
                  Random avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control w-full space-y-2">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full focus:input-primary"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control w-full space-y-2">
              <label className="label">
                <span className="label-text font-medium">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24 focus:textarea-primary"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full space-y-2">
                <label className="label">
                  <span className="label-text font-medium">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, learningLanguage: e.target.value })
                  }
                  className="select select-bordered w-full focus:select-primary"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control w-full space-y-2">
              <label className="label">
                <span className="label-text font-medium">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-5 text-base-content/40" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10 focus:input-primary"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="btn btn-primary w-full gap-2 mt-2" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW SECTION */}
        <div className="hidden lg:flex w-full lg:w-2/5 bg-gradient-to-br from-primary/15 via-base-200 to-secondary/10 flex-col justify-center p-10 border-l border-primary/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-4">
            Live preview
          </p>

          <div className="rounded-2xl overflow-hidden border border-base-content/10 bg-base-100 shadow-xl">
            <div className="bg-gradient-to-r from-primary/70 via-secondary/60 to-primary/70 px-5 pt-5 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={formState.profilePic}
                  name={formState.fullName || "?"}
                  size="size-14"
                  className="ring-4 ring-base-100"
                />
                <div className="min-w-0">
                  <p className="font-bold leading-tight truncate text-white">
                    {formState.fullName || "Your name"}
                  </p>
                  {formState.location && (
                    <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-1">
                      <MapPinIcon className="size-3" />
                      {formState.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {formState.bio ? (
                <p className="text-sm text-base-content/70 leading-relaxed line-clamp-4">
                  {formState.bio}
                </p>
              ) : (
                <p className="text-sm text-base-content/40 italic">
                  Your bio will show up here as you type...
                </p>
              )}

              {(formState.nativeLanguage || formState.learningLanguage) && (
                <div className="flex flex-wrap gap-1.5">
                  {formState.nativeLanguage && (
                    <span className="badge badge-ghost badge-sm text-xs">
                      {getLanguageFlag(formState.nativeLanguage)}
                      Native: {formState.nativeLanguage}
                    </span>
                  )}
                  {formState.learningLanguage && (
                    <span className="badge badge-outline badge-sm text-xs">
                      {getLanguageFlag(formState.learningLanguage)}
                      Learning: {formState.learningLanguage}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-start gap-2.5 text-sm text-base-content/70">
                <CheckCircleIcon className="size-4 text-primary mt-0.5 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;
