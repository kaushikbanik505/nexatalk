import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { aiRateLimit } from "../middleware/aiRateLimit.js";
import { chatWithBuddy } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", protectRoute, aiRateLimit, chatWithBuddy);

export default router;
