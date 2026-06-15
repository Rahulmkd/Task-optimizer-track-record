import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string().min(1, "Name cannot be empty"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    phoneNumber: z.string().min(6, "Phone number must be 10 digits").max(12),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .strict();

export const logoutUserSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type registerUserDTO = z.infer<typeof registerUserSchema>;
export type loginUserDTO = z.infer<typeof loginUserSchema>;
export type logoutUserDTO = z.infer<typeof logoutUserSchema>;
export type refreshTokenDTO = z.infer<typeof refreshTokenSchema>;
