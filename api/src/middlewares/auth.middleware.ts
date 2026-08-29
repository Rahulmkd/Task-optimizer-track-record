import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/Jwt.helper.js";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return next(new AppError("Unauthorized request", 401));
    }

    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};
