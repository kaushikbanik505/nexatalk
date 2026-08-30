import jwt from "jsonwebtoken";
import User from "../models/User.js";

const PRESENCE_UPDATE_INTERVAL_MS = 30 * 1000;

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (user.isBanned) {
      res.clearCookie("jwt");
      return res.status(403).json({ message: "This account has been suspended" });
    }

    // one-time sync: an account whose email matches ADMIN_EMAIL is promoted to admin
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (adminEmail && user.email.toLowerCase() === adminEmail && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    // throttled presence heartbeat - avoids a DB write on every single request
    if (Date.now() - new Date(user.lastActiveAt).getTime() > PRESENCE_UPDATE_INTERVAL_MS) {
      user.lastActiveAt = new Date();
      User.findByIdAndUpdate(user._id, { lastActiveAt: user.lastActiveAt }).catch(() => {});
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
