import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { NODE_ENV } from "../config/env.config.js";
import { AppError } from "../utils/AppError.js";

/**
 * https://www.prisma.io/docs/orm/reference/error-reference
 */
const fromPrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
): AppError => {
  switch (err.code) {
    case "P2002": {
      const target = Array.isArray(err.meta?.target)
        ? err.meta.target.join(", ")
        : "field";
      return new AppError(`A record with this ${target} already exists.`, 409);
    }
    case "P2025":
      return new AppError("The requested record was not found.", 404);
    case "P2003":
      return new AppError(
        "This action references a record that doesn't exist.",
        400,
      );
    default:
      return new AppError("A database error occurred.", 500);
  }
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error: AppError;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = fromPrismaError(err);
  } else if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new AppError(err.message, 500);
  } else {
    error = new AppError("Something went wrong", 500);
  }

  if (NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
