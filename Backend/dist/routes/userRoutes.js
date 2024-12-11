"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validateRequestMiddleware_1 = require("../middlewares/validateRequestMiddleware");
const userSchemas_1 = require("../schemas/userSchemas");
const router = express_1.default.Router();
router.post('/loginUser', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(userSchemas_1.loginUserSchema), userController_1.loginUser); //working
router.post('/register', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(userSchemas_1.registerUserSchema), userController_1.createUser); // working
// router.post("/change-password",authMiddleware,validateRequestMiddleware(changePasswordSchema),changePassword);
exports.default = router;
