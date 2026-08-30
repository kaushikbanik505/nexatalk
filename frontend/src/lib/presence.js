// Matches the Admin dashboard's own "Online" window (backend/src/controllers/admin.controller.js,
// ONLINE_WINDOW_MS) - lastActiveAt is a heartbeat bumped on authenticated requests (at most once
// every 30s, see auth.middleware.js), not a live websocket presence, so "online" here really means
// "used the app in the last 2 minutes."
const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export const isRecentlyActive = (lastActiveAt) =>
  Boolean(lastActiveAt) && Date.now() - new Date(lastActiveAt).getTime() < ONLINE_WINDOW_MS;
