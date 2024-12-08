"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password cannot exceed 20 characters"),
    role: zod_1.z.enum(["admin", "user"]).refine(val => val === "admin" || val === "user", {
        message: "Role must be either 'admin' or 'user'",
    })
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password cannot exceed 20 characters"),
});
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").optional(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password cannot exceed 20 characters")
        .optional(),
    role: zod_1.z.enum(["admin", "user"]).optional(),
});
exports.verifyTokenSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
});
