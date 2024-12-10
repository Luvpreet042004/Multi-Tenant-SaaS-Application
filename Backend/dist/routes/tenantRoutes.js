"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenantController_1 = require("../controllers/tenantController");
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const router = express_1.default.Router();
router.post('/create', tenantController_1.createTenantWithAdmin);
router.get('/:tenantId', verifyAdmin_1.verifyAdmin, tenantController_1.getTenantDetails);
exports.default = router;
