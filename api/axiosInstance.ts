import { getAuth } from "@/store/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: "https://ungustatory-erringly-ralph.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // Get the current token from the auth store
    const token = getAuth().user?.token;

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("API Error:", error?.response?.data || error.message);

    // Handle token expiration or invalid token errors
    if (error.response?.status === 401) {
      // You can add logic to refresh token here if needed
      console.log("Authentication error - please log in again");
    }

    return Promise.reject(error);
  }
);

export default api;
