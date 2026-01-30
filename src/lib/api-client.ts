import axios from "axios";

declare global {
  interface Window {
    __API_URL__?: string;
  }
}

export const apiClient = axios.create({
  baseURL: window.__API_URL__ || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);
