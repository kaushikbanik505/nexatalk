import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

const ONLINE_WINDOW_MS = 2 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function getOverview(req, res) {
  try {
    const now = Date.now();
    const since24h = new Date(now - DAY_MS);
    const sevenDaysAgo = new Date(now - 7 * DAY_MS);

    const [totalUsers, onlineNow, newSignups24h, pendingRequests, acceptedRequests24h, recentSignups] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ lastActiveAt: { $gte: new Date(now - ONLINE_WINDOW_MS) } }),
        User.countDocuments({ createdAt: { $gte: since24h } }),
        FriendRequest.countDocuments({ status: "pending" }),
        FriendRequest.countDocuments({ status: "accepted", updatedAt: { $gte: since24h } }),
        User.find({ createdAt: { $gte: sevenDaysAgo } }).select("createdAt"),
      ]);

    // bucket the last 7 days' signups by calendar day, oldest first
    const signupsByDay = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now - (6 - i) * DAY_MS);
      const key = day.toISOString().slice(0, 10);
      return { date: key, count: 0 };
    });
    recentSignups.forEach((u) => {
      const key = new Date(u.createdAt).toISOString().slice(0, 10);
      const bucket = signupsByDay.find((b) => b.date === key);
      if (bucket) bucket.count += 1;
    });

    res.status(200).json({
      totalUsers,
      onlineNow,
      newSignups24h,
      pendingRequests,
      acceptedRequests24h,
      signupsByDay,
    });
  } catch (error) {
    console.error("Error in getOverview controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOnlineUsers(req, res) {
  try {
    const since = new Date(Date.now() - ONLINE_WINDOW_MS);
    const users = await User.find({ lastActiveAt: { $gte: since } })
      .select("fullName email role lastActiveAt")
      .sort({ lastActiveAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getOnlineUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await User.find()
      .select("fullName email role isBanned createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getModeration(req, res) {
  try {
    const since24h = new Date(Date.now() - DAY_MS);

    const [recentSignups, recentFriendRequests] = await Promise.all([
      User.find({ createdAt: { $gte: since24h } })
        .select("fullName email createdAt")
        .sort({ createdAt: -1 }),
      FriendRequest.find({ createdAt: { $gte: since24h } })
        .populate("sender", "fullName email")
        .populate("recipient", "fullName email")
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      recentSignups,
      // sender/recipient can be null if that user was deleted since the request was made
      recentFriendRequests: recentFriendRequests.filter((r) => r.sender && r.recipient),
    });
  } catch (error) {
    console.error("Error in getModeration controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function banUser(req, res) {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: "You can't ban your own account" });
    }

    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (target.role === "admin") {
      return res.status(400).json({ message: "Can't ban another admin" });
    }

    target.isBanned = true;
    await target.save();

    res.status(200).json({ success: true, user: target });
  } catch (error) {
    console.error("Error in banUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function unbanUser(req, res) {
  try {
    const { id } = req.params;

    const target = await User.findById(id);
    if (!target) return res.status(404).json({ message: "User not found" });

    target.isBanned = false;
    await target.save();

    res.status(200).json({ success: true, user: target });
  } catch (error) {
    console.error("Error in unbanUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
