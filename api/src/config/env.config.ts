import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 4001;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
export const JWT_ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
export const JWT_REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY;

// Set AI_PROVIDER=groq to use Groq/LLaMA, defaults to Gemini.
export const AI_PROVIDER = process.env.AI_PROVIDER ?? "gemini";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
export const GROQ_API_KEY = process.env.GROQ_API_KEY ?? "";
