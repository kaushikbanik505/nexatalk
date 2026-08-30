import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CameraIcon, LinkIcon, LoaderIcon, MapPinIcon, PhoneIcon, PlusIcon, XIcon } from "lucide-react";
import { updateProfile } from "../lib/api";
import Avatar from "./Avatar";

const EditProfileModal = ({ authUser, onClose }) => {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    phone: authUser?.phone || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    links: authUser?.links?.length ? authUser.links : [""],
  });

  const { mutate: saveMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

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

  const handleLinkChange = (idx, value) => {
    setFormState((prev) => {
      const links = [...prev.links];
      links[idx] = value;
      return { ...prev, links };
    });
  };

  const addLinkField = () => {
    setFormState((prev) => ({ ...prev, links: [...prev.links, ""] }));
  };

  const removeLinkField = (idx) => {
    setFormState((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation({
      ...formState,
      links: formState.links.map((link) => link.trim()).filter(Boolean),
    });
  };

  return createPortal(
    <div
      data-theme="night"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-base-200 border border-base-content/10 w-full max-w-lg rounded-3xl shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 shrink-0">
          <div>
            <h2 className="text-lg font-bold">Edit Profile</h2>
            <p className="text-xs text-base-content/50">Update your public profile info</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <XIcon className="size-4" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <form
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* PROFILE PIC */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <div className="relative">
              <Avatar
                src={formState.profilePic}
                name={formState.fullName}
                size="size-28"
                className="rounded-full ring-4 ring-primary/20"
              />
              <label
                htmlFor="profile-pic-input"
                className="absolute bottom-0 right-0 btn btn-circle btn-primary shadow-lg cursor-pointer"
              >
                <CameraIcon className="size-4" />
              </label>
              <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <span className="text-xs text-base-content/50">
              Click the camera to choose a photo from your device
            </span>
          </div>

          {/* FULL NAME */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              className="input input-bordered w-full"
              placeholder="Your full name"
            />
          </div>

          {/* BIO */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="textarea textarea-bordered h-20"
              placeholder="Tell others about yourself"
            />
          </div>

          {/* PHONE + LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1.5">
                  <PhoneIcon className="size-3.5 text-base-content/40" />
                  Phone
                </span>
              </label>
              <input
                type="tel"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Phone number"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1.5">
                  <MapPinIcon className="size-3.5 text-base-content/40" />
                  Location
                </span>
              </label>
              <input
                type="text"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="input input-bordered w-full"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* LINKS */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Links</span>
            </label>
            <div className="space-y-2">
              {formState.links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <LinkIcon className="size-4 text-base-content/40 shrink-0" />
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => handleLinkChange(idx, e.target.value)}
                    className="input input-bordered input-sm w-full"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeLinkField(idx)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLinkField}
              className="btn btn-ghost btn-sm mt-2 gap-1 normal-case"
            >
              <PlusIcon className="size-4" /> Add link
            </button>
          </div>
        </form>

        {/* STICKY FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t border-base-content/10 shrink-0">
          <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={isPending}
            className="btn btn-primary flex-1"
          >
            {isPending ? <LoaderIcon className="size-4 animate-spin" /> : "Save changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
