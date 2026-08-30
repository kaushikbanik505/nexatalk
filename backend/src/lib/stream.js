import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Stream rejects a user's "image" field past a few KB - it expects a URL, not
// embedded image data. A profile photo uploaded from a device is stored in
// MongoDB as a full-size base64 data URI (see EditProfileModal.jsx), which can
// run to hundreds of KB, so it's stripped here rather than passed through.
const STREAM_IMAGE_SIZE_LIMIT = 8 * 1024;

export const upsertStreamUser = async (userData) => {
  try {
    const safeUserData = {
      ...userData,
      image: userData.image && userData.image.length <= STREAM_IMAGE_SIZE_LIMIT ? userData.image : undefined,
    };
    await streamClient.upsertUsers([safeUserData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};

// Stream Chat rejects channel member-role changes (addModerators/demoteModerators)
// from a client-side SDK entirely - "changing channel member roles is not allowed
// client-side" - regardless of who's calling it or what permissions they have. It
// has to go through the server SDK (this file, using the API secret), which is why
// promoting/demoting a group admin is a backend endpoint instead of a direct call
// from GroupInfoModal.jsx like the rest of that modal's actions.
export const getGroupChannel = (channelId) => streamClient.channel("messaging", channelId);

export const setGroupAdmin = (channelId, userId, isAdmin) => {
  const channel = getGroupChannel(channelId);
  return isAdmin ? channel.addModerators([userId]) : channel.demoteModerators([userId]);
};