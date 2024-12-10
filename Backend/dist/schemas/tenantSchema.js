"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTenantSchema = void 0;
const zod_1 = require("zod");
exports.createTenantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    domain: zod_1.z.string().url("A valid domain is required"),
});
