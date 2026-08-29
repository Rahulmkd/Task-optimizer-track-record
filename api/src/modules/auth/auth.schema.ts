import { z } from "zod";

// Accepts an optional leading + followed by 10-15 digits (E.164-ish).
// Adjust if you need a stricter India-only format (e.g. /^[6-9]\d{9}$/).
const PHONE_REGEX = /^\+?\d{10,15}$/;

export const registerUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty").max(100),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    phoneNumber: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Enter a valid phone number (10-15 digits)"),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
