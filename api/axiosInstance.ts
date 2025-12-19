import axios from "axios";

const api = axios.create({
  baseURL: "https://ungustatory-erringly-ralph.ngrok-free.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // later: get token from zustand / asyncStorage
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
