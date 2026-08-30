import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  ActivityIcon,
  LayoutDashboardIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import {
  banUser,
  getAdminModeration,
  getAdminOnlineUsers,
  getAdminOverview,
  getAdminUsers,
  unbanUser,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import StarryBackground from "../components/StarryBackground";
import HomeButton from "../components/HomeButton";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { id: "online", label: "Online", icon: ActivityIcon },
  { id: "moderation", label: "Moderation", icon: ShieldAlertIcon },
  { id: "users", label: "Users", icon: UsersIcon },
];

const formatTime = (value) => new Date(value).toLocaleTimeString();
const formatDate = (value) => new Date(value).toLocaleDateString();
const dayLabel = (isoDate) => new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });

const StatTile = ({ label, value }) => (
  <div className="rounded-2xl border border-base-300/50 bg-base-200/40 p-4">
    <p className="text-xs font-semibold tracking-wide text-base-content/50">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const RoleBadge = ({ role }) => (
  <span className={`badge badge-sm ${role === "admin" ? "badge-primary" : "badge-ghost"}`}>{role}</span>
);

const StatusBadge = ({ isBanned }) =>
  isBanned ? (
    <span className="badge badge-error badge-sm">Banned</span>
  ) : (
    <span className="badge badge-success badge-sm">Active</span>
  );

const AdminPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");

  const { data: overview } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: getAdminOverview,
    enabled: activeTab === "overview",
  });

  const { data: onlineUsers = [] } = useQuery({
    queryKey: ["admin", "online"],
    queryFn: getAdminOnlineUsers,
    enabled: activeTab === "online",
    refetchInterval: 10000,
  });

  const { data: moderation } = useQuery({
    queryKey: ["admin", "moderation"],
    queryFn: getAdminModeration,
    enabled: activeTab === "moderation",
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    enabled: activeTab === "users",
  });

  const invalidateAdminQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const { mutate: runBan } = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      toast.success("User banned");
      invalidateAdminQueries();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't ban that user"),
  });

  const { mutate: runUnban } = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      toast.success("User unbanned");
      invalidateAdminQueries();
    },
    onError: (error) => toast.error(error.response?.data?.message || "Couldn't unban that user"),
  });

  const maxSignupDay = Math.max(1, ...(overview?.signupsByDay || []).map((d) => d.count));

  const trimmedSearch = userSearch.trim().toLowerCase();
  const filteredUsers = trimmedSearch
    ? users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(trimmedSearch) ||
          u.email.toLowerCase().includes(trimmedSearch)
      )
    : users;

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <StarryBackground />
      <div className="relative z-10 container mx-auto max-w-4xl space-y-8">
        <HomeButton />

        {/* HEADER */}
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-error">ADMIN</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="text-base-content/70 max-w-2xl">
            Platform-wide analytics and user management — visible only to the admin account.
          </p>
        </div>

        {/* TABS */}
        <div className="inline-flex items-center gap-1 rounded-full border border-base-300/50 bg-base-200/60 p-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "bg-primary text-primary-content"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && overview && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatTile label="REGISTERED USERS" value={overview.totalUsers} />
              <StatTile label="ONLINE NOW" value={overview.onlineNow} />
              <StatTile label="NEW SIGNUPS (24H)" value={overview.newSignups24h} />
              <StatTile label="PENDING REQUESTS" value={overview.pendingRequests} />
              <StatTile label="CONNECTIONS MADE (24H)" value={overview.acceptedRequests24h} />
            </div>

            <div className="rounded-2xl border border-base-300/50 bg-base-200/40 p-5">
              <p className="text-xs font-semibold tracking-wide text-base-content/50 mb-1">
                SIGNUPS, LAST 7 DAYS
              </p>
              <p className="text-sm text-base-content/50 mb-5">
                One bar per calendar day, oldest first — a small enough user base that this is a
                real count, not a sampled estimate.
              </p>
              <div className="flex items-end gap-3 h-32">
                {overview.signupsByDay.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-semibold text-base-content/70">{day.count}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary min-h-[4px]"
                      style={{ height: `${(day.count / maxSignupDay) * 100}%` }}
                    />
                    <span className="text-[11px] text-base-content/40">{dayLabel(day.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ONLINE */}
        {activeTab === "online" && (
          <div className="space-y-3">
            <p className="text-sm text-base-content/50">
              {onlineUsers.length} signed in · active in the last 2 minutes · refreshes every 10s
            </p>
            <div className="rounded-2xl border border-base-300/50 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-base-200/60">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      NAME
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      ROLE
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      LAST ACTIVE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/40">
                  {onlineUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="px-4 py-2.5 font-medium">{u.fullName}</td>
                      <td className="px-4 py-2.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-2.5 text-base-content/60">{formatTime(u.lastActiveAt)}</td>
                    </tr>
                  ))}
                  {onlineUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-base-content/40">
                        Nobody's active right now.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODERATION */}
        {activeTab === "moderation" && moderation && (
          <div className="space-y-8">
            <section className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-base-content/50">
                RECENT SIGNUPS ({moderation.recentSignups.length}, LAST 24H)
              </p>
              {moderation.recentSignups.length === 0 ? (
                <p className="text-sm text-base-content/40">No new signups in the last 24 hours.</p>
              ) : (
                <div className="space-y-2">
                  {moderation.recentSignups.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-base-300/50 bg-base-200/40 px-4 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">{u.fullName}</p>
                        <p className="text-xs text-base-content/50 truncate">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-base-content/40">{formatTime(u.createdAt)}</span>
                        <button
                          type="button"
                          onClick={() => runBan(u._id)}
                          className="btn btn-outline btn-error btn-xs whitespace-nowrap"
                        >
                          Ban
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-base-content/50">
                RECENT FRIEND-REQUEST ACTIVITY ({moderation.recentFriendRequests.length}, LAST 24H)
              </p>
              {moderation.recentFriendRequests.length === 0 ? (
                <p className="text-sm text-base-content/40">
                  No friend-request activity in the last 24 hours.
                </p>
              ) : (
                <div className="space-y-2">
                  {moderation.recentFriendRequests.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-base-300/50 bg-base-200/40 px-4 py-2.5"
                    >
                      <p className="text-sm truncate">
                        <span className="font-medium">{r.sender.fullName}</span>
                        <span className="text-base-content/40"> → </span>
                        <span className="font-medium">{r.recipient.fullName}</span>
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`badge badge-sm ${r.status === "accepted" ? "badge-success" : "badge-ghost"}`}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs text-base-content/40">{formatTime(r.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative w-full max-w-xs">
                <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3 size-4 text-base-content/40" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="input input-bordered input-sm w-full pl-9 pr-8 focus:input-primary"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch("")}
                    className="absolute top-1/2 -translate-y-1/2 right-2 text-base-content/40 hover:text-base-content"
                    aria-label="Clear search"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-base-content/50">
                {trimmedSearch ? `${filteredUsers.length} of ${users.length} users` : `${users.length} users`}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300/50 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-base-200/60">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      NAME
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      EMAIL
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      ROLE
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      JOINED
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium text-xs tracking-wide text-base-content/50">
                      STATUS
                    </th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300/40">
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === authUser?._id;
                    return (
                      <tr key={u._id}>
                        <td className="px-4 py-2.5 font-medium">{u.fullName}</td>
                        <td className="px-4 py-2.5 text-base-content/60">{u.email}</td>
                        <td className="px-4 py-2.5">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-2.5 text-base-content/60">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-2.5">
                          <StatusBadge isBanned={u.isBanned} />
                        </td>
                        <td className="px-4 py-2.5">
                          {u.role === "admin" || isSelf ? null : u.isBanned ? (
                            <button
                              type="button"
                              onClick={() => runUnban(u._id)}
                              className="btn btn-outline btn-xs whitespace-nowrap"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => runBan(u._id)}
                              className="btn btn-outline btn-error btn-xs whitespace-nowrap"
                            >
                              Ban
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-base-content/40">
                        No users match "{userSearch.trim()}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-base-content/30 pt-2">
          <ShieldCheckIcon className="size-3.5" />
          Only the account set as ADMIN_EMAIL on the server can reach this page.
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
