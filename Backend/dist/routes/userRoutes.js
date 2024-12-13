"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validateRequestMiddleware_1 = require("../middlewares/validateRequestMiddleware");
const userSchemas_1 = require("../schemas/userSchemas");
const userSchemas_2 = require("../schemas/userSchemas");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const verifyAdmin_1 = require("../middlewares/verifyAdmin");
const router = express_1.default.Router();
router.get('/loginUser', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(userSchemas_1.loginUserSchema), userController_1.loginUser); //working
router.post('/register', (0, validateRequestMiddleware_1.validateSchemaMiddleware)(userSchemas_1.registerUserSchema), userController_1.createUser); // working
router.put("/change-password", (0, validateRequestMiddleware_1.validateSchemaMiddleware)(userSchemas_2.changePasswordSchema), authMiddleware_1.default, userController_1.changePassword); // working
router.delete('/delete', verifyAdmin_1.verifyAdmin, userController_1.deleteUser); // working
exports.default = router;
