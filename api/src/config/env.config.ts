import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "./.env" });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),

  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_TOKEN_SECRET should be at least 32 characters"),
  JWT_ACCESS_TOKEN_EXPIRY: z
    .string()
    .min(1, "JWT_ACCESS_TOKEN_EXPIRY is required"),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_TOKEN_SECRET should be at least 32 characters"),
  JWT_REFRESH_TOKEN_EXPIRY: z
    .string()
    .min(1, "JWT_REFRESH_TOKEN_EXPIRY is required"),

  AI_PROVIDER: z.enum(["gemini", "groq"]).default("gemini"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GROQ_API_KEY: z.string().optional().default(""),

  APP_TIMEZONE_OFFSET_MINUTES: z.coerce.number().int().default(330),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  // eslint-disable-next-line no-console
  console.error(`Invalid environment configuration:\n${formatted}`);
  process.exit(1);
}

const env = parsed.data;

export const NODE_ENV = env.NODE_ENV;
export const PORT = env.PORT;
export const DATABASE_URL = env.DATABASE_URL;
export const FRONTEND_URL = env.FRONTEND_URL;

export const JWT_ACCESS_TOKEN_SECRET = env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRY = env.JWT_ACCESS_TOKEN_EXPIRY;
export const JWT_REFRESH_TOKEN_SECRET = env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_EXPIRY = env.JWT_REFRESH_TOKEN_EXPIRY;

// AI_PROVIDER selects which provider client gets constructed — see
// modules/ai/providers/index.ts, which now only builds the selected one.
export const AI_PROVIDER = env.AI_PROVIDER;
export const GEMINI_API_KEY = env.GEMINI_API_KEY;
export const GROQ_API_KEY = env.GROQ_API_KEY;

export const APP_TIMEZONE_OFFSET_MINUTES = env.APP_TIMEZONE_OFFSET_MINUTES;
