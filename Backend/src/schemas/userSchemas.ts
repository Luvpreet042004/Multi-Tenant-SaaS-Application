import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "user"]).refine(val => val === "admin" || val === "user", {
    message: "Role must be either 'admin' or 'user'",
  }),
  tenantId: z.string().uuid("Invalid tenant ID"),
});


export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password cannot exceed 20 characters"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export const verifyTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});
