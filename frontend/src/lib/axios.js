import axios from "axios";

// Frontend (Vercel) and backend (Render) are two separate origins in production,
// so a relative "/api" would hit Vercel itself instead of the API - it has to be
// an absolute URL to the deployed backend, supplied via VITE_API_URL.
const BASE_URL =
  import.meta.env.MODE === "development"
    ? `http://${window.location.hostname}:5001/api`
    : `${import.meta.env.VITE_API_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});