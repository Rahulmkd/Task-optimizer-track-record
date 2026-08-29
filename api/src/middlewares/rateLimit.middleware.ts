import rateLimit from "express-rate-limit";

/**
 * Rate limiters.
 */

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again shortly.",
  },
});
