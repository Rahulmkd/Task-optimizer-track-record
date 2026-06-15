import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),

    email: z.email("Please enter a valid email address"),

    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string("Old password is required"),
    newPassword: z
      .string("New password is required")
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export type RegisterUserFormData = z.infer<typeof registerSchema>;
export type LoginUserFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
