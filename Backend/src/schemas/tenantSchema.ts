import { z } from 'zod';

export const tenantSchema = z.object({
    name: z.string().min(1, { message: "Tenant name is required." }),
    domain: z.string(),
    adminEmail : z.string().email().min(1, { message: "minimum length is 1"}),
    adminPassword : z.string().min(6, "Password must be at least 6 characters long").max(20, "Password cannot exceed 20 characters"),
});

export const updateTenantSchema = z.object({
    name: z.string().optional(),
    domain: z.string().optional(),
  });