"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantSchema = void 0;
const zod_1 = require("zod");
exports.tenantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Tenant name is required." }),
    domain: zod_1.z.string(),
    adminEmail: zod_1.z.string().email().min(1, { message: "minimum length is 1" }),
    adminPassword: zod_1.z.string().min(6, "Password must be at least 6 characters long").max(20, "Password cannot exceed 20 characters"),
});
