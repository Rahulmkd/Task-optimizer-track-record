import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "./config/env.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

// only in production if using NGINX, AWS or etc
// app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());

app.get("/health-check", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Api is working fine",
  });
});

import authRouter from "./modules/auth/auth.routes.js";
import taskRouter from "./modules/task/task.routes.js";
import actionRouter from "./modules/action/action.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/action", actionRouter);

app.use(globalErrorHandler);

export default app;
