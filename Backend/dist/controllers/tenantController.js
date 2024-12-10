"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantDetails = exports.createTenantWithAdmin = void 0;
const prismaClient_1 = require("../prisma/prismaClient"); // Adjust path if necessary
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const createTenantWithAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, domain, adminEmail, adminPassword } = req.body;
        const existingTenant = yield prismaClient_1.prisma.tenant.findUnique({
            where: { domain },
        });
        if (existingTenant) {
            res.status(400).json({ error: "A tenant with this domain already exists." });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(adminPassword, 10);
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        // Using a transaction to ensure both tenant and admin user are created atomically
        const result = yield prismaClient_1.prisma.$transaction((prismaTransaction) => __awaiter(void 0, void 0, void 0, function* () {
            // Create the tenant
            const tenant = yield prismaTransaction.tenant.create({
                data: { name, domain },
            });
            // Create the admin user
            const adminUser = yield prismaTransaction.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: "admin",
                    tenantId: tenant.id,
                },
            });
            const token = jsonwebtoken_1.default.sign({ userId: adminUser.id, tenantId: tenant.id, role: adminUser.role }, JWT_SECRET, { expiresIn: "2d" } // Token valid for 2 days
            );
            return { tenant, adminUser, token };
        }));
        res.status(201).json({
            message: "Tenant and admin user created successfully",
            tenant: result.tenant,
            adminUser: result.adminUser,
            token: result.token,
        });
    }
    catch (error) {
        console.error("Error creating tenant with admin:", error);
        res.status(500).json({ error: "An error occurred while creating the tenant." });
    }
});
exports.createTenantWithAdmin = createTenantWithAdmin;
const getTenantDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const tenant = yield prismaClient_1.prisma.tenant.findUnique({
            where: { id: user.tenantId },
            include: { users: true },
        });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
        }
        res.status(200).json(tenant);
    }
    catch (error) {
        console.error('Error fetching tenant details:', error);
        res.status(500).json({ error: 'An error occurred while fetching tenant details' });
    }
});
exports.getTenantDetails = getTenantDetails;
