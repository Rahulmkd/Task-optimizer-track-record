// src/features/auth/services/auth.service.ts

import { api } from "@/lib/axios";
import { API_PATHS } from "@/constants/api.path";

import { ApiResponse } from "@/types/api.types";

import { AuthResponse, IUser, ResetPasswordPayload } from "../types/user.types";

import {
  LoginUserFormData,
  ResetPasswordFormData,
} from "../schemas/auth.schema";
import { RegisterPayload } from "../types/auth.types";

interface RefreshTokenResponse {
  accessToken: string;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_PATHS.AUTH.REGISTER,
      data,
    );

    return response.data.data;
  },

  async login(data: LoginUserFormData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      API_PATHS.AUTH.LOGIN,
      data,
    );

    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post(API_PATHS.AUTH.LOGOUT);
  },

  async getMe(): Promise<IUser> {
    const response = await api.get<ApiResponse<IUser>>(API_PATHS.AUTH.ME);

    return response.data.data;
  },

  async changePassword(data: ResetPasswordFormData): Promise<void> {
    await api.post(API_PATHS.AUTH.CHANGE_PASSWORD, data);
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(data: ResetPasswordPayload): Promise<void> {
    await api.post(API_PATHS.AUTH.RESET_PASSWORD, data);
  },

  async refreshToken(): Promise<string> {
    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      API_PATHS.AUTH.REFRESH_TOKEN,
    );

    return response.data.data.accessToken;
  },
};
