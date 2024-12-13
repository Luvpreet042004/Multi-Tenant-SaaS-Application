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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProject = exports.getProject = exports.editProject = exports.deleteProject = exports.createProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, deadline } = req.body;
    const admin = req.user;
    const tenantId = admin === null || admin === void 0 ? void 0 : admin.tenantId;
    if (!tenantId) {
        res.status(401).json({ error: 'Admin Id not correct' });
        return;
    }
    try {
        const status = "Active";
        const tenant = yield prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
            res.status(404).json({ error: 'Tenant not found' });
            return;
        }
        const project = yield prisma.project.create({
            data: {
                name,
                description,
                status,
                deadline: new Date(deadline),
                tenantId,
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'An error occurred while creating the project' });
    }
});
exports.createProject = createProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user;
    const tenantId = admin === null || admin === void 0 ? void 0 : admin.tenantId;
    const { projectId } = req.params;
    try {
        // Check if the project exists
        const project = yield prisma.project.findUnique({ where: { id: Number(projectId), tenantId } });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        yield prisma.project.delete({ where: { id: Number(projectId) } });
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'An error occurred while deleting the project' });
    }
});
exports.deleteProject = deleteProject;
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user;
    const tenantId = admin === null || admin === void 0 ? void 0 : admin.tenantId;
    const { projectId } = req.params;
    const { name, description, status, deadline } = req.body;
    if (!tenantId) {
        res.status(401).json({ error: 'Admin Id not correct' });
        return;
    }
    try {
        const project = yield prisma.project.findUnique({ where: { id: Number(projectId), tenantId } });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        const updatedProject = yield prisma.project.update({
            where: { id: Number(projectId) },
            data: {
                name,
                description,
                status,
                deadline: deadline ? new Date(deadline) : undefined,
            },
        });
        res.status(200).json({ updatedProject, msg: "Project Updated successfully" });
    }
    catch (error) {
        console.error('Error editing project:', error);
        res.status(500).json({ error: 'An error occurred while editing the project' });
    }
});
exports.editProject = editProject;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    const user = req.user;
    const tenantId = user === null || user === void 0 ? void 0 : user.tenantId;
    if (!tenantId) {
        res.status(401).json({ error: 'TenantId not authenticated' });
        return;
    }
    try {
        const project = yield prisma.project.findUnique({
            where: { id: Number(id), tenantId }
        });
        res.status(200).json({ project: project });
    }
    catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'An error occurred while fetching project.' });
    }
});
exports.getProject = getProject;
const getAllProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user;
    if (!admin) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    try {
        const projects = yield prisma.project.findMany({
            where: { tenantId: admin.tenantId }
        });
        res.status(200).json({ projects: projects });
    }
    catch (error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'An error occurred while fetching projects.' });
    }
});
exports.getAllProject = getAllProject;
