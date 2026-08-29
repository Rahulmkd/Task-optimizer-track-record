import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL, NODE_ENV } from "../config/env.config.js";

const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
  log: NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
