"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaMiddleware = void 0;
const zod_1 = require("zod");
const validateSchemaMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            next(error);
        }
    };
};
exports.validateSchemaMiddleware = validateSchemaMiddleware;
