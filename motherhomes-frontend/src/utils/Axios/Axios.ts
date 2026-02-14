import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/api", // Fallback to /api for unified deployment
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


instance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;