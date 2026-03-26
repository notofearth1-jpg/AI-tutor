import axios from "axios";

let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

// Ensure protocol exists
if (!rawApiUrl.startsWith('http')) {
  rawApiUrl = `https://${rawApiUrl}`;
}

// Remove trailing slash
rawApiUrl = rawApiUrl.replace(/\/$/, "");

// Ensure /api suffix
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      // Avoid infinite loop if refresh itself fails
      if (originalRequest.url?.includes("/auth/refresh")) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await api.post("/auth/refresh");
          return api(originalRequest);
        } catch (err) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  }
);
