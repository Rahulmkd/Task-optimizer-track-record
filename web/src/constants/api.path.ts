const AUTH_BASE = "/api/v1/auth";

export const API_PATHS = {
  AUTH: {
    REGISTER: `${AUTH_BASE}/register`,
    LOGIN: `${AUTH_BASE}/login`,
    LOGOUT: `${AUTH_BASE}/logout`,
    ME: `${AUTH_BASE}/me`,
    CHANGE_PASSWORD: `${AUTH_BASE}/change-password`,
    FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
    RESET_PASSWORD: `${AUTH_BASE}/reset-password-token`,
    REFRESH_TOKEN: `${AUTH_BASE}/refresh-token`,
  },
} as const;
