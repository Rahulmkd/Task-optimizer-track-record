import { z } from "zod";

export const createActionSchema = z
  .object({
    actionName: z.string().min(1, "Require valid Action Name").max(200),
  })
  .strict();

export const updateActionSchema = z
  .object({
    actionName: z.string().min(1, "Require valid Action").max(200).optional(),
  })
  .strict();

export const actionIdParamSchema = z
  .object({
    id: z.string().uuid("Invalid Action id"),
  })
  .strict();

export type createActionDTO = z.infer<typeof createActionSchema>;
export type updateActionDTO = z.infer<typeof updateActionSchema>;
export type taskIdParamDTO = z.infer<typeof actionIdParamSchema>;
