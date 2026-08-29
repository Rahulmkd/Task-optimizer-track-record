import { z } from "zod";

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").max(200),
    time: z.string().trim().max(50).optional(),
    actionId: z.string().uuid().optional(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200)
      .optional(),
    time: z.string().trim().max(50).optional(),
    completed: z.boolean().optional(),
    actionId: z.string().uuid().nullable().optional(),
  })
  .strict();

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
