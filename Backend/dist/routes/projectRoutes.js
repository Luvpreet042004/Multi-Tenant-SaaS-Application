"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/create', verifyAdmin_1.verifyAdmin, projectController_1.createProject); //working
router.put('/edit/:projectId', verifyAdmin_1.verifyAdmin, projectController_1.editProject); // working
router.delete('/delete/:projectId', verifyAdmin_1.verifyAdmin, projectController_1.deleteProject); //working
router.get('/:id', authMiddleware_1.default, projectController_1.getProject);
exports.default = router;
