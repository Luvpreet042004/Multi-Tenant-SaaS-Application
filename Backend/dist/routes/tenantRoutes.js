"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenantController_1 = require("../controllers/tenantController");
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const validateRequestMiddleware_1 = require("../middlewares/validateRequestMiddleware");
const tenantSchema_1 = require("../schemas/tenantSchema");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.post('/create', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(tenantSchema_1.tenantSchema), tenantController_1.createTenantWithAdmin); //working
router.get('/:tenantId', verifyAdmin_1.verifyAdmin, tenantController_1.getTenantDetails); //working
router.put('/update', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(tenantSchema_1.updateTenantSchema), verifyAdmin_1.verifyAdmin, tenantController_1.updateTenant); //working
router.delete('/delete', verifyAdmin_1.verifyAdmin, tenantController_1.deleteTenant); // working
router.get('/allprojects', verifyAdmin_1.verifyAdmin, projectController_1.getAllProject);
exports.default = router;
