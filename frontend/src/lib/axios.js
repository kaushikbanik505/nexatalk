import axios from "axios";

// In production, vercel.json rewrites /api/* to the Render backend
// server-side, so a relative "/api" is correct - the browser only ever talks
// to its own origin, never to the Render domain directly. That matters: a
// cookie set across a real cross-site request (Render's domain, SameSite=None)
// gets silently dropped by any browser/extension blocking third-party
// cookies, which is common enough to otherwise break login for real users.
const BASE_URL =
  import.meta.env.MODE === "development" ? `http://${window.location.hostname}:5001/api` : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});