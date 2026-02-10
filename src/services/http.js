import axios from "axios";
import { getToken } from "./getToken";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 30000,
  withCredentials: false,
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers = token
      ? {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
      : {
        ...config.headers,
      };
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
