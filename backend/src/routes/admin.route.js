import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";
import {
  banUser,
  getModeration,
  getOnlineUsers,
  getOverview,
  getUsers,
  unbanUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protectRoute, protectAdminRoute);

router.get("/overview", getOverview);
router.get("/online", getOnlineUsers);
router.get("/users", getUsers);
router.get("/moderation", getModeration);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);

export default router;
