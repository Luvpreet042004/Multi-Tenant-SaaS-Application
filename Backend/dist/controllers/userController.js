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
exports.changePassword = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, tenantId } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const role = "user";
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                tenantId,
            },
        });
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '20 days' });
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Failed to register user" });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Compare the provided password with the stored hash
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '2 days' });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});
exports.loginUser = loginUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword } = req.body;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming `req.user` contains authenticated user info.
    console.log(id);
    try {
        // Fetch user from database
        const user = yield prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Check if old password matches
        const isValid = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            res.status(401).json({ error: "Old password is incorrect" });
            return;
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the password in the database
        yield prisma.user.update({
            where: { id: Number(id) },
            data: { password: hashedPassword },
        });
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "An error occurred while changing the password" });
    }
});
exports.changePassword = changePassword;
