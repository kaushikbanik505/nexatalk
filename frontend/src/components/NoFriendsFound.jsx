import { UsersIcon } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="card bg-base-200/70 backdrop-blur-sm border border-base-300/50 p-10 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UsersIcon className="size-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
      <p className="text-base-content/60">
        Connect with language partners below to start practicing together!
      </p>
    </div>
  );
};

export default NoFriendsFound;
