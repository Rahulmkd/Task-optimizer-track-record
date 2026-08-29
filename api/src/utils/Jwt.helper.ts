import jwt, { SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../types/index.js";

import {
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/env.config.js";

const accessTokenSecret = JWT_ACCESS_TOKEN_SECRET;
const accessTokenExpiry = JWT_ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"];
const refreshTokenSecret = JWT_REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = JWT_REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"];

export const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const generateRefreshToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, accessTokenSecret) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, refreshTokenSecret) as IJwtPayload;
};
