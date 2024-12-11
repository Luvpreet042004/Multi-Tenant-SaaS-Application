"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").min(1, "Email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
    tenantId: zod_1.z.number().int("Tenant ID must be an integer").positive("Tenant ID must be a positive integer"),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").min(1, "Email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long").max(20, "Password cannot exceed 20 characters"),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(6, "Old password must be at least 6 characters long"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long"),
});
