import { Request } from "express";
import { AppError } from "./AppError.js";

/**
 * Reads the authenticated user's id off the request.
 */
export const getUserId = (req: Request): string => {
  if (!req.user?.id) {
    throw new AppError("Unauthorized", 401);
  }

  return req.user.id;
};

/**
 * Reads and validates a UUID route param (defaults to `:id`).
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getParamId = (req: Request, paramName = "id"): string => {
  const id = req.params[paramName];

  if (typeof id !== "string" || !UUID_REGEX.test(id)) {
    throw new AppError(`Invalid ${paramName}`, 400);
  }

  return id;
};
