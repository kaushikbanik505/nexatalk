import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import adminRoutes from "./routes/admin.route.js";
import groupRoutes from "./routes/group.route.js";
import aiRoutes from "./routes/ai.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    // In dev, reflect back whatever origin made the request (e.g. a phone hitting
    // this machine's LAN IP instead of localhost) rather than a single fixed value -
    // safe since the server only binds to the local network, not the public internet.
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : true,
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/ai", aiRoutes);

// Only present when this same service also builds/serves the frontend
// (a combined single-service deploy). When the frontend is deployed
// separately (e.g. on Vercel, with this API on Render), frontend/dist
// never gets built here, so this backend has nothing to fall back to
// for a non-API route - respond with a plain status instead of a
// dist/index.html-not-found 500.
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (process.env.NODE_ENV === "production" && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "NexaTalk API is running" });
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});