import axios from "axios";

/* ================= CONFIG ================= */
const BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "http://localhost:5000/api";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/* ================= TOKEN STORE ================= */
export const tokenStore = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  // 👉 backend trả: { token, refreshToken }
  setTokens({ token, refreshToken }) {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token); // MAP token → accessToken
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

/* ================= AXIOS INSTANCE ================= */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.getAccessToken();
    console.log(
      `[API] Request: ${config.method?.toUpperCase()} ${config.url}`,
      { hasToken: !!token }
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[API] Request Error:", error);
    return Promise.reject(error);
  }
);

/* ================= REFRESH TOKEN ================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const refreshAccessToken = async () => {
  console.log("[API] Refreshing Access Token...");
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  console.log("[API] Refresh Success:", res.data);

  // 👉 backend trả token
  const newToken = res.data.accessToken || res.data.token;

  tokenStore.setTokens({ token: newToken });
  return newToken;
};

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => {
    console.log(
      `[API] Response Success: ${response.config.url}`,
      response.status
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(
      `[API] Response Error: ${originalRequest?.url}`,
      error.response?.status
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenStore.clear();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
