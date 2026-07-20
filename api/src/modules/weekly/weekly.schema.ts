import { z } from "zod";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
const CATEGORIES = [
  "Study",
  "Fitness",
  "Nutrition",
  "Personal",
  "Career",
  "Other",
] as const;

/** GET /api/v1/weekly?weekStart=2026-07-20 */
export const getWeeklyPlanSchema = z
  .object({
    weekStart: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "weekStart must be YYYY-MM-DD"),
  })
  .strict();

/** POST /api/v1/weekly/tasks */
export const createWeeklyTaskSchema = z
  .object({
    weekStart: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "weekStart must be YYYY-MM-DD"),
    title: z.string().min(1, "Title is required").max(200),
    day: z.enum(DAYS),
    priority: z.enum(PRIORITIES).default("MEDIUM"),
    category: z.enum(CATEGORIES).default("Other"),
    duration: z.number().int().min(15).max(480).default(60),
  })
  .strict();

/** PATCH /api/v1/weekly/tasks/:id */
export const updateWeeklyTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    day: z.enum(DAYS).optional(),
    priority: z.enum(PRIORITIES).optional(),
    category: z.enum(CATEGORIES).optional(),
    duration: z.number().int().min(15).max(480).optional(),
    completed: z.boolean().optional(),
  })
  .strict();

export type GetWeeklyPlanDTO = z.infer<typeof getWeeklyPlanSchema>;
export type CreateWeeklyTaskDTO = z.infer<typeof createWeeklyTaskSchema>;
export type UpdateWeeklyTaskDTO = z.infer<typeof updateWeeklyTaskSchema>;
