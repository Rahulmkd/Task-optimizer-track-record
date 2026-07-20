export const APP_NAME = "Task Optimizer";
export const APP_DESCRIPTION = "The Task Optimizer platform for modern teams.";

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",
} as const;

export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "Admin@123",
} as const;
