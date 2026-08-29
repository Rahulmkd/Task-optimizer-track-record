import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, NODE_ENV } from "./config/env.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import actionRouter from "./modules/action/action.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import weeklyRouter from "./modules/weekly/weekly.routes.js";

const app = express();

// Render's load balancer terminates SSL and forwards over HTTP, so Express
// needs this to correctly trust X-Forwarded-* headers in production.
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());

// Global rate limit applied to every request, with a stricter limiter
// layered on top of the auth routes below.
app.use(apiLimiter);

app.get("/health-check", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Api is working fine",
  });
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/action", actionRouter);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/weekly", weeklyRouter);

// Unmatched routes — must come after all routers, before the error handler.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);

export default app;
