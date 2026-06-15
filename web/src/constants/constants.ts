export const APP_NAME = "NexusAuth";
export const APP_DESCRIPTION = "The authentication platform for modern teams.";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/home",
} as const;

export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "123456",
} as const;
