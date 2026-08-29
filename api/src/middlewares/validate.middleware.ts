import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { AppError } from "../utils/AppError.js";

type RequestPart = "body" | "query" | "params";

const formatIssues = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues
    .map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`)
    .join(", ");

export const validate =
  (schema: ZodObject<any>, part: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      throw new AppError(formatIssues(result.error.issues), 400);
    }

    Object.assign(req[part] as object, result.data);

    next();
  };
