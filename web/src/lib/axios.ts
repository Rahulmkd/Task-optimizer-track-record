import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { tokenService } from "./auth.token";
import { API_PATHS } from "@/constants/api.path";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!API_URL) {
  console.warn(
    "[axios] NEXT_PUBLIC_BACKEND_API_URL is not set — API calls will fail.",
  );
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                AXIOS INSTANCE                              */
/* -------------------------------------------------------------------------- */

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                          REQUEST INTERCEPTOR                               */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* -------------------------------------------------------------------------- */
/*                        REFRESH TOKEN CONTROL FLAGS                         */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                           AUTH ROUTES SKIP LIST                            */
/* -------------------------------------------------------------------------- */

const AUTH_ROUTES = [
  API_PATHS.AUTH.LOGIN,
  API_PATHS.AUTH.REGISTER,
  API_PATHS.AUTH.REFRESH_TOKEN,
];

/* -------------------------------------------------------------------------- */
/*                          RESPONSE INTERCEPTOR                              */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route),
    );

    // Do NOT handle refresh for non-401 or auth routes
    if (status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /*                          IF ALREADY REFRESHING                         */
    /* ---------------------------------------------------------------------- */

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }

            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    /* ---------------------------------------------------------------------- */
    /*                        START REFRESH PROCESS                           */
    /* ---------------------------------------------------------------------- */

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await api.post(
        API_PATHS.AUTH.REFRESH_TOKEN,
        {},
        { withCredentials: true },
      );

      const newAccessToken = response.data.data.accessToken;

      // save token
      tokenService.setToken(newAccessToken);

      // process queued requests
      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      tokenService.clearToken();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
