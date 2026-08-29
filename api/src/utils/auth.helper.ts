import bcrypt from "bcrypt";
import crypto from "crypto";
import { CookieOptions, Response } from "express";
import { NODE_ENV } from "../config/env.config.js";
import { prisma } from "../lib/prisma.js";

const SALT_ROUNDS = 10;

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashRefreshToken = (refreshToken: string): string => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

const isProduction = NODE_ENV === "production";

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

export const setCookies = (
  res: Response,
  refreshToken: string,
): void => {
  res.cookie("refreshToken", refreshToken, {
    ...refreshCookieOptions,
    maxAge: REFRESH_TOKEN_TTL_MS,
  });
};

export const destroyCookies = (res: Response): void => {
  res.clearCookie("refreshToken", refreshCookieOptions);
};

export const getUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
    },
  });
};