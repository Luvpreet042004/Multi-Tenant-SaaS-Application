import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  tenantId: z.number().int("Tenant ID must be an integer").positive("Tenant ID must be a positive integer"),
});


export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(20, "Password cannot exceed 20 characters"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password must be at least 6 characters long"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});
