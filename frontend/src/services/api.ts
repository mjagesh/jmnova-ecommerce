import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      const auth = JSON.parse(storedAuth);

      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
