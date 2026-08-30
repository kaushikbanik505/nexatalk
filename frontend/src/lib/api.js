import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function unfriendUser(userId) {
  const response = await axiosInstance.delete(`/users/friends/${userId}`);
  return response.data;
}

export async function blockUser(userId) {
  const response = await axiosInstance.post(`/users/block/${userId}`);
  return response.data;
}

export async function unblockUser(userId) {
  const response = await axiosInstance.post(`/users/unblock/${userId}`);
  return response.data;
}

export async function getBlockedUsers() {
  const response = await axiosInstance.get("/users/blocked");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await axiosInstance.put("/users/profile", profileData);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function getAdminOverview() {
  const response = await axiosInstance.get("/admin/overview");
  return response.data;
}

export async function getAdminOnlineUsers() {
  const response = await axiosInstance.get("/admin/online");
  return response.data;
}

export async function getAdminUsers() {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
}

export async function getAdminModeration() {
  const response = await axiosInstance.get("/admin/moderation");
  return response.data;
}

export async function banUser(userId) {
  const response = await axiosInstance.put(`/admin/users/${userId}/ban`);
  return response.data;
}

export async function unbanUser(userId) {
  const response = await axiosInstance.put(`/admin/users/${userId}/unban`);
  return response.data;
}

export async function promoteGroupAdmin(channelId, userId) {
  const response = await axiosInstance.put(`/groups/${channelId}/admins/${userId}`);
  return response.data;
}

export async function demoteGroupAdmin(channelId, userId) {
  const response = await axiosInstance.delete(`/groups/${channelId}/admins/${userId}`);
  return response.data;
}

export async function sendAiBuddyMessage(message, history) {
  const response = await axiosInstance.post("/ai/chat", { message, history });
  return response.data;
}