import { getGroupChannel, setGroupAdmin } from "../lib/stream.js";

const getMembershipInfo = async (channelId, userId) => {
  const channel = getGroupChannel(channelId);
  const { members, channel: channelData } = await channel.query({ members: { limit: 100 } });

  const creatorId = channelData?.created_by?.id;
  const membership = members.find((member) => member.user_id === userId);
  const isAdmin = userId === creatorId || membership?.channel_role === "moderator";

  return { isAdmin, creatorId };
};

export async function promoteGroupAdmin(req, res) {
  try {
    const { channelId, userId } = req.params;

    const { isAdmin } = await getMembershipInfo(channelId, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "Only a group admin can do that" });
    }

    await setGroupAdmin(channelId, userId, true);
    res.status(200).json({ message: "Promoted to admin" });
  } catch (error) {
    console.log("Error in promoteGroupAdmin controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function demoteGroupAdmin(req, res) {
  try {
    const { channelId, userId } = req.params;

    const { isAdmin, creatorId } = await getMembershipInfo(channelId, req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "Only a group admin can do that" });
    }
    if (userId === creatorId) {
      return res.status(400).json({ message: "Can't remove the group creator's admin role" });
    }

    await setGroupAdmin(channelId, userId, false);
    res.status(200).json({ message: "Removed admin" });
  } catch (error) {
    console.log("Error in demoteGroupAdmin controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
