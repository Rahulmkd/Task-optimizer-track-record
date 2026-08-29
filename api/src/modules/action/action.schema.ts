import { z } from "zod";

export const createActionSchema = z
  .object({
    actionName: z.string().trim().min(1, "Action name is required").max(200),
  })
  .strict();

export const updateActionSchema = z
  .object({
    actionName: z
      .string()
      .trim()
      .min(1, "Action name is required")
      .max(200)
      .optional(),
  })
  .strict();

export type CreateActionDTO = z.infer<typeof createActionSchema>;
export type UpdateActionDTO = z.infer<typeof updateActionSchema>;
