import { api } from "@/lib/axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";

interface AxiosArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
  timeout?: number;
}

interface AxiosErrorResponse {
  status?: number;
  data?: unknown;
  error?: string;
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosArgs, unknown, AxiosErrorResponse> =>
  async ({ url, method, data, params, timeout }) => {
    try {
      const result = await api({
        url,
        method,
        data,
        params,
        ...(timeout ? { timeout } : {}),
      });

      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError<{ message?: string; error?: string }>;

      const status = err.response?.status ?? 500;
      const data = err.response?.data ?? err.message;
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || err.message;

      return {
        error: {
          status,
          data,
          error: errorMsg,
        },
      };
    }
  };
