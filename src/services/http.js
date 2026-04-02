import axios from "axios";
import { getToken } from "./getToken";

const CITY_CODE = import.meta.env.VITE_CITY_CODE;

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

    // Inject CITY_CODE into every request (only as fallback)
    if (CITY_CODE) {
      const method = config.method?.toLowerCase();
      if (method === "get" || method === "delete") {
        // Append as query parameter if not already provided
        config.params = {
          cityCode: CITY_CODE,
          ...config.params,
        };
      } else if (method === "post" || method === "put" || method === "patch") {
        // Merge into request body if not already provided
        if (config.data instanceof FormData) {
          if (!config.data.has("cityCode")) {
            config.data.append("cityCode", CITY_CODE);
          }
        } else if (config.data && typeof config.data === "object") {
          config.data = { cityCode: CITY_CODE, ...config.data };
        } else if (!config.data) {
          config.data = { cityCode: CITY_CODE };
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
