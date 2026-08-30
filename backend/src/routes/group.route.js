import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { demoteGroupAdmin, promoteGroupAdmin } from "../controllers/group.controller.js";

const router = express.Router();

router.put("/:channelId/admins/:userId", protectRoute, promoteGroupAdmin);
router.delete("/:channelId/admins/:userId", protectRoute, demoteGroupAdmin);

export default router;
